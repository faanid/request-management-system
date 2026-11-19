import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import type { RequestFilters, RequestPriority, RequestStatus } from "./types";
import { useRequests, useUpdateRequest } from "./hooks";
import { PriorityBadge } from "../../shared/components/PriorityBadge";
import { StateView } from "../../shared/components/StateView";
import { formatDate, formatNumber } from "../../shared/lib/format";
import { ApiError } from "../../shared/api/client";

const statusOptions: { value: RequestStatus | ""; label: string }[] = [
  { value: "", label: "همه وضعیت‌ها" },
  { value: "new", label: "جدید" },
  { value: "in_progress", label: "در حال بررسی" },
  { value: "completed", label: "تکمیل‌شده" },
];

const priorityOptions: { value: RequestPriority | ""; label: string }[] = [
  { value: "", label: "همه اولویت‌ها" },
  { value: "high", label: "زیاد" },
  { value: "medium", label: "متوسط" },
  { value: "low", label: "کم" },
];

function getFilters(params: URLSearchParams): RequestFilters {
  const pageParam = Number(params.get("page") ?? 1);

  return {
    q: params.get("q") ?? "",
    status: (params.get("status") ?? "") as RequestStatus | "",
    priority: (params.get("priority") ?? "") as RequestPriority | "",
    page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1,
    page_size: 10,
  };
}

export function RequestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = getFilters(searchParams);
  const [search, setSearch] = useState<string>(filters.q ?? "");
  const requestsQuery = useRequests(filters);
  const updateMutation = useUpdateRequest();

  useEffect(() => {
    setSearch(filters.q ?? "");
  }, [filters.q]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const query = search.trim();
      setSearchParams((current) => {
        if ((current.get("q") ?? "") === query) return current;
        const next = new URLSearchParams(current);
        if (query) next.set("q", query);
        else next.delete("q");
        next.set("page", "1");
        return next;
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search, setSearchParams]);

  function updateFilter(key: "status" | "priority", value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  }

  function changePage(page: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    setSearchParams(next);
  }

  function changeStatus(id: number, status: RequestStatus, expectedVersion: number) {
    updateMutation.mutate({
      id,
      payload: { status, expected_version: expectedVersion },
    });
  }

  const data = requestsQuery.data;
  const hasActiveFilters = Boolean(filters.q?.trim() || filters.status || filters.priority);
  const mutationError = updateMutation.error;
  const isConflict = mutationError instanceof ApiError && mutationError.status === 409;

  if (requestsQuery.isPending) {
    return <StateView kind="loading" title="در حال دریافت فهرست درخواست‌ها" />;
  }

  if (requestsQuery.isError) {
    return (
      <StateView
        kind="error"
        title="فهرست درخواست‌ها بارگذاری نشد"
        description="اتصال به سرویس برقرار نیست. لطفاً دوباره تلاش کنید."
        onRetry={() => void requestsQuery.refetch()}
      />
    );
  }

  return (
    <div className="page-stack">
      <section className="page-intro">
        <div>
          <p className="page-kicker">مدیریت و پیگیری</p>
          <h2>همه درخواست‌ها</h2>
          <p className="welcome-description">درخواست‌ها را جست‌وجو، فیلتر و به‌روزرسانی کنید.</p>
        </div>
        <Link className="button button-primary" to="/requests/new">
          <Plus size={18} />
          درخواست جدید
        </Link>
      </section>

      <section className="content-panel requests-panel">
        <div className="list-toolbar">
          <div className="search-field">
            <Search size={18} />
            <input
              aria-label="جست‌وجوی درخواست"
              placeholder="جست‌وجو بر اساس عنوان یا درخواست‌دهنده..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button type="button" className="clear-search" onClick={() => setSearch("")} aria-label="پاک کردن جست‌وجو">
                ×
              </button>
            )}
          </div>
          <div className="filter-controls">
            <label className="select-field">
              <SlidersHorizontal size={16} />
              <select
                aria-label="فیلتر وضعیت"
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
              >
                {statusOptions.map((option) => (
                  <option value={option.value} key={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={15} />
            </label>
            <label className="select-field">
              <select
                aria-label="فیلتر اولویت"
                value={filters.priority}
                onChange={(event) => updateFilter("priority", event.target.value)}
              >
                {priorityOptions.map((option) => (
                  <option value={option.value} key={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={15} />
            </label>
          </div>
        </div>

        {isConflict && (
          <div className="inline-alert" role="alert">
            این درخواست در جای دیگری تغییر کرده است. اطلاعات فهرست به‌روزرسانی شد؛ دوباره وضعیت را انتخاب کنید.
          </div>
        )}
        {mutationError && !isConflict && (
          <div className="inline-alert" role="alert">
            تغییر وضعیت انجام نشد. وضعیت قبلی بازیابی شد.
          </div>
        )}

        <div className="list-summary">
          <span>نمایش <strong>{formatNumber(data?.items.length ?? 0)}</strong> مورد از <strong>{formatNumber(data?.total ?? 0)}</strong> درخواست</span>
        </div>

        {data?.items.length ? (
          <>
            <div className="table-wrap">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>عنوان درخواست</th>
                    <th>درخواست‌دهنده</th>
                    <th>تاریخ ثبت</th>
                    <th>اولویت</th>
                    <th>وضعیت</th>
                    <th aria-label="عملیات" />
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <Link to={`/requests/${request.id}`} className="request-title-link">
                          <span className="table-request-icon"><ClipboardList size={17} /></span>
                          <span>
                            <strong>{request.title}</strong>
                            <small>شناسه #{formatNumber(request.id)}</small>
                          </span>
                        </Link>
                      </td>
                      <td>{request.requester}</td>
                      <td className="date-cell">{formatDate(request.created_at)}</td>
                      <td><PriorityBadge priority={request.priority} /></td>
                      <td>
                        <label className="status-control">
                          <span className="sr-only">تغییر وضعیت {request.title}</span>
                          <select
                            value={request.status}
                            onChange={(event) => changeStatus(request.id, event.target.value as RequestStatus, request.version)}
                            disabled={updateMutation.isPending}
                            aria-label={`وضعیت ${request.title}`}
                          >
                            {statusOptions.filter((option) => option.value).map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <Link className="table-action" to={`/requests/${request.id}`} aria-label={`مشاهده ${request.title}`}>
                          <ChevronLeft size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-request-list">
              {data.items.map((request) => (
                <article className="mobile-request-card" key={request.id}>
                  <div className="mobile-card-top">
                    <span className="table-request-icon"><ClipboardList size={17} /></span>
                    <Link to={`/requests/${request.id}`} className="mobile-request-title">{request.title}</Link>
                    <Link className="table-action" to={`/requests/${request.id}`} aria-label="مشاهده جزئیات">
                      <ChevronLeft size={18} />
                    </Link>
                  </div>
                  <div className="mobile-card-meta">
                    <span>{request.requester}</span>
                    <span>{formatDate(request.created_at)}</span>
                  </div>
                  <div className="mobile-card-bottom">
                    <PriorityBadge priority={request.priority} />
                    <label className="status-control">
                      <span className="sr-only">تغییر وضعیت {request.title}</span>
                      <select
                        value={request.status}
                        onChange={(event) => changeStatus(request.id, event.target.value as RequestStatus, request.version)}
                        disabled={updateMutation.isPending}
                        aria-label={`وضعیت ${request.title}`}
                      >
                        {statusOptions.filter((option) => option.value).map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            </div>

            <div className="pagination">
              <span>صفحه {formatNumber(data.page)} از {formatNumber(Math.max(data.total_pages, 1))}</span>
              <div className="pagination-actions">
                <button
                  type="button"
                  className="pagination-button"
                  disabled={data.page <= 1}
                  onClick={() => changePage(data.page - 1)}
                  aria-label="صفحه قبل"
                >
                  <ChevronRight size={17} />
                </button>
                <button
                  type="button"
                  className="pagination-button"
                  disabled={data.page >= data.total_pages}
                  onClick={() => changePage(data.page + 1)}
                  aria-label="صفحه بعد"
                >
                  <ChevronLeft size={17} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <StateView
            kind="empty"
            title={
              hasActiveFilters
                ? "درخواستی پیدا نشد"
                : data?.total === 0
                  ? "هنوز درخواستی ثبت نشده است"
                  : "درخواستی در این صفحه نیست"
            }
            description={
              hasActiveFilters
                ? "عبارت جست‌وجو یا فیلترها را تغییر دهید."
                : data?.total === 0
                  ? "برای شروع، اولین درخواست را ثبت کنید."
                  : "به صفحه اول فهرست برگردید."
            }
            action={
              hasActiveFilters ? (
                <button
                  className="button button-secondary button-small"
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSearchParams(new URLSearchParams());
                  }}
                >
                  پاک کردن فیلترها
                </button>
              ) : data?.total === 0 ? (
                <Link className="button button-primary button-small" to="/requests/new">
                  <Plus size={16} />
                  ثبت درخواست
                </Link>
              ) : (
                <button
                  className="button button-secondary button-small"
                  type="button"
                  onClick={() => changePage(1)}
                >
                  رفتن به صفحه اول
                </button>
              )
            }
          />
        )}
      </section>
    </div>
  );
}
