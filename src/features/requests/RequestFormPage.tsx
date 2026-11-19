import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../shared/api/client";
import { StateView } from "../../shared/components/StateView";
import { createRequest, updateRequest } from "./api";
import { useRequest } from "./hooks";
import { requestSchema, type RequestFormValues } from "./schemas";

const defaultValues: RequestFormValues = {
  title: "",
  description: "",
  requester: "",
  priority: "medium",
};

export function RequestFormPage() {
  const { id } = useParams();
  const requestId = id ? Number(id) : null;
  const isEditing = id !== undefined;
  const isValidRequestId = requestId !== null && Number.isInteger(requestId) && requestId > 0;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requestQuery = useRequest(requestId ?? 0);
  const [formError, setFormError] = useState("");
  const [hasConflict, setHasConflict] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues,
  });

  const mutation = useMutation({
    mutationFn: async (values: RequestFormValues) => {
      if (isEditing && requestQuery.data && requestId !== null) {
        return updateRequest(requestId, {
          ...values,
          expected_version: requestQuery.data.version,
        });
      }
      return createRequest(values);
    },
  });

  useEffect(() => {
    if (isEditing && requestQuery.data) {
      reset({
        title: requestQuery.data.title,
        description: requestQuery.data.description,
        requester: requestQuery.data.requester,
        priority: requestQuery.data.priority,
      });
    }
  }, [isEditing, requestQuery.data, reset]);

  async function onSubmit(values: RequestFormValues) {
    setFormError("");
    setHasConflict(false);

    try {
      const saved = await mutation.mutateAsync(values);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["requests"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] }),
      ]);
      navigate(`/requests/${saved.id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setHasConflict(true);
        setFormError("این درخواست در جای دیگری ویرایش شده است. قبل از ذخیره دوباره، نسخه جدید را بارگیری کنید.");
        return;
      }

      setFormError(error instanceof ApiError
        ? error.message
        : "ذخیره درخواست با خطای غیرمنتظره مواجه شد.");
    }
  }

  async function reloadLatestVersion() {
    const result = await requestQuery.refetch();
    if (result.data) {
      reset({
        title: result.data.title,
        description: result.data.description,
        requester: result.data.requester,
        priority: result.data.priority,
      });
      setHasConflict(false);
      setFormError("");
    }
  }

  if (isEditing && !isValidRequestId) {
    return (
      <StateView
        kind="error"
        title="شناسه درخواست معتبر نیست"
        description="برای ویرایش، یک درخواست معتبر را از فهرست انتخاب کنید."
        action={<Link className="button button-secondary button-small" to="/requests">بازگشت به فهرست</Link>}
      />
    );
  }

  if (isEditing && requestQuery.isPending) {
    return <StateView kind="loading" title="در حال دریافت اطلاعات درخواست" />;
  }

  if (isEditing && (requestQuery.isError || !requestQuery.data)) {
    return (
      <StateView
        kind="error"
        title="اطلاعات درخواست در دسترس نیست"
        description="درخواست موردنظر پیدا نشد یا ارتباط با سرویس برقرار نیست."
        onRetry={() => void requestQuery.refetch()}
        action={<Link className="button button-secondary button-small" to="/requests">بازگشت به فهرست</Link>}
      />
    );
  }

  return (
    <div className="page-stack form-page">
      <div className="back-row">
        <Link className="back-link" to={isEditing && requestId ? `/requests/${requestId}` : "/requests"}>
          <ArrowRight size={17} />
          {isEditing ? "بازگشت به جزئیات" : "بازگشت به درخواست‌ها"}
        </Link>
      </div>

      <section className="page-intro">
        <div>
          <p className="page-kicker">{isEditing ? "ویرایش اطلاعات" : "ثبت اطلاعات جدید"}</p>
          <h2>{isEditing ? "ویرایش درخواست" : "ثبت درخواست جدید"}</h2>
          <p className="welcome-description">
            {isEditing ? "اطلاعات موردنیاز را اصلاح و تغییرات را ذخیره کنید." : "فرم زیر را برای ثبت درخواست سازمانی تکمیل کنید."}
          </p>
        </div>
      </section>

      <form className="content-panel request-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-section-heading">
          <h3>اطلاعات درخواست</h3>
          <span>فیلدهای ستاره‌دار الزامی هستند</span>
        </div>

        {formError && (
          <div className="inline-alert" role="alert">
            <span>{formError}</span>
            {hasConflict && (
              <button className="alert-action" type="button" onClick={() => void reloadLatestVersion()}>
                بارگیری نسخه جدید
              </button>
            )}
          </div>
        )}

        <div className="form-grid">
          <label className="form-field form-field-full">
            <span>عنوان درخواست <b>*</b></span>
            <input
              {...register("title")}
              placeholder="مثلاً درخواست دسترسی به سامانه گزارش‌گیری"
              maxLength={120}
              required
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && <small className="field-error" id="title-error">{errors.title.message}</small>}
          </label>

          <label className="form-field form-field-full">
            <span>شرح درخواست <b>*</b></span>
            <textarea
              {...register("description")}
              placeholder="جزئیات و دلیل ثبت درخواست را بنویسید..."
              rows={6}
              maxLength={2000}
              required
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && <small className="field-error" id="description-error">{errors.description.message}</small>}
          </label>

          <label className="form-field">
            <span>نام درخواست‌دهنده <b>*</b></span>
            <input
              {...register("requester")}
              placeholder="نام و نام خانوادگی"
              maxLength={100}
              required
              aria-invalid={Boolean(errors.requester)}
              aria-describedby={errors.requester ? "requester-error" : undefined}
            />
            {errors.requester && <small className="field-error" id="requester-error">{errors.requester.message}</small>}
          </label>

          <label className="form-field">
            <span>اولویت درخواست <b>*</b></span>
            <select
              {...register("priority")}
              required
              aria-invalid={Boolean(errors.priority)}
              aria-describedby={errors.priority ? "priority-error" : undefined}
            >
              <option value="low">کم</option>
              <option value="medium">متوسط</option>
              <option value="high">زیاد</option>
            </select>
            {errors.priority && <small className="field-error" id="priority-error">{errors.priority.message}</small>}
          </label>
        </div>

        <div className="form-footer">
          <Link className="button button-secondary" to={isEditing && requestId ? `/requests/${requestId}` : "/requests"}>
            انصراف
          </Link>
          <button className="button button-primary" type="submit" disabled={mutation.isPending || (isEditing && !isDirty)}>
            <Save size={17} />
            {mutation.isPending ? "در حال ذخیره..." : isEditing ? "ذخیره تغییرات" : "ثبت درخواست"}
          </button>
        </div>
      </form>
    </div>
  );
}
