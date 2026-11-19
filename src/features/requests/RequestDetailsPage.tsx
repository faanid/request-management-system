import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  FileText,
  Pencil,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { ApiError } from "../../shared/api/client";
import { PriorityBadge } from "../../shared/components/PriorityBadge";
import { StateView } from "../../shared/components/StateView";
import { StatusBadge } from "../../shared/components/StatusBadge";
import { formatDateTime } from "../../shared/lib/format";
import { useRequest, useUpdateRequest } from "./hooks";
import type { RequestStatus } from "./types";

const statusOptions: { value: RequestStatus; label: string }[] = [
  { value: "new", label: "جدید" },
  { value: "in_progress", label: "در حال بررسی" },
  { value: "completed", label: "تکمیل‌شده" },
];

export function RequestDetailsPage() {
  const { id } = useParams();
  const requestId = Number(id);
  const navigate = useNavigate();
  const requestQuery = useRequest(requestId);
  const updateMutation = useUpdateRequest();
  const [actionMessage, setActionMessage] = useState("");
  const isValidRequestId = Number.isInteger(requestId) && requestId > 0;

  if (!isValidRequestId) {
    return (
      <StateView
        kind="error"
        title="شناسه درخواست معتبر نیست"
        description="از فهرست درخواست‌ها یک مورد معتبر انتخاب کنید."
        action={<Link className="button button-secondary button-small" to="/requests">بازگشت به فهرست</Link>}
      />
    );
  }

  if (requestQuery.isPending) {
    return <StateView kind="loading" title="در حال دریافت جزئیات درخواست" />;
  }

  if (requestQuery.isError || !requestQuery.data) {
    return (
      <StateView
        kind="error"
        title="درخواست موردنظر پیدا نشد"
        description="ممکن است درخواست حذف شده باشد یا ارتباط با سرویس برقرار نباشد."
        onRetry={() => void requestQuery.refetch()}
        action={
          <Link className="button button-secondary button-small" to="/requests">
            بازگشت به فهرست
          </Link>
        }
      />
    );
  }

  const request = requestQuery.data;
  const isConflict = updateMutation.error instanceof ApiError
    && updateMutation.error.status === 409;

  function updateStatus(status: RequestStatus) {
    setActionMessage("");
    updateMutation.mutate(
      {
        id: request.id,
        payload: { status, expected_version: request.version },
      },
      {
        onSuccess: () => setActionMessage("وضعیت درخواست با موفقیت به‌روزرسانی شد."),
        onError: (error) => {
          setActionMessage(error instanceof ApiError && error.status === 409
            ? "این درخواست در تب یا نشست دیگری تغییر کرده است. اطلاعات جدید را بارگیری کنید."
            : "تغییر وضعیت انجام نشد. وضعیت قبلی بازیابی شد.");
        },
      },
    );
  }

  return (
    <div className="page-stack">
      <div className="back-row">
        <button className="back-link" type="button" onClick={() => navigate("/requests")}>
          <ArrowRight size={17} />
          بازگشت به درخواست‌ها
        </button>
        <span className="record-id">شناسه درخواست: #{request.id}</span>
      </div>

      {actionMessage && (
        <div className={`inline-alert ${updateMutation.isSuccess ? "inline-alert-success" : ""}`} role="status">
          <span>{actionMessage}</span>
          {isConflict && (
            <button
              className="alert-action"
              type="button"
              onClick={async () => {
                const result = await requestQuery.refetch();
                if (result.isSuccess) setActionMessage("");
              }}
            >
              <RefreshCw size={14} />
              بارگیری مجدد
            </button>
          )}
        </div>
      )}

      <section className="detail-header content-panel">
        <div className="detail-title-group">
          <span className="detail-file-icon"><FileText size={22} /></span>
          <div>
            <p className="page-kicker">جزئیات درخواست</p>
            <h2>{request.title}</h2>
            <div className="detail-badges">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
            </div>
          </div>
        </div>
        <Link className="button button-primary" to={`/requests/${request.id}/edit`}>
          <Pencil size={17} />
          ویرایش درخواست
        </Link>
      </section>

      <div className="detail-grid">
        <section className="content-panel detail-description">
          <div className="panel-heading">
            <div>
              <h3>شرح درخواست</h3>
              <p>اطلاعات و توضیحات ثبت‌شده</p>
            </div>
          </div>
          <p className="description-copy">{request.description}</p>
        </section>

        <aside className="content-panel detail-sidebar">
          <h3>اطلاعات ثبت</h3>
          <div className="detail-info-row">
            <span className="detail-info-icon"><UserRound size={17} /></span>
            <span>
              <small>درخواست‌دهنده</small>
              <strong>{request.requester}</strong>
            </span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-icon"><CalendarDays size={17} /></span>
            <span>
              <small>تاریخ ثبت</small>
              <strong>{formatDateTime(request.created_at)}</strong>
            </span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-icon"><Clock3 size={17} /></span>
            <span>
              <small>آخرین به‌روزرسانی</small>
              <strong>{formatDateTime(request.updated_at)}</strong>
            </span>
          </div>
          <div className="detail-version">
            <span>نسخه رکورد</span>
            <strong>{request.version}</strong>
          </div>
        </aside>
      </div>

      <section className="content-panel status-editor">
        <div>
          <h3>به‌روزرسانی وضعیت</h3>
          <p>تغییر وضعیت بلافاصله در فهرست و داشبورد منعکس می‌شود.</p>
        </div>
        <label className="select-field status-editor-select">
          <span className="sr-only">وضعیت درخواست</span>
          <select
            value={request.status}
            onChange={(event) => updateStatus(event.target.value as RequestStatus)}
            disabled={updateMutation.isPending}
          >
            {statusOptions.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      </section>
    </div>
  );
}
