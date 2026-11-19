import {
  ArrowLeft,
  ArrowUpLeft,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Clock3,
  Plus,
} from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "./api";
import { useRequests } from "../requests/hooks";
import { StatusBadge } from "../../shared/components/StatusBadge";
import { PriorityBadge } from "../../shared/components/PriorityBadge";
import { StatCard } from "../../shared/components/StatCard";
import { StateView } from "../../shared/components/StateView";
import { formatDate } from "../../shared/lib/format";

export function DashboardPage() {
  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: getDashboardStats,
  });
  const requestsQuery = useRequests({ page: 1, page_size: 5 });

  const hasError = statsQuery.isError || requestsQuery.isError;

  if (hasError) {
    return (
      <StateView
        kind="error"
        title="دریافت اطلاعات داشبورد ممکن نشد"
        description="اتصال سرویس را بررسی کنید و دوباره تلاش کنید."
        onRetry={() => {
          void statsQuery.refetch();
          void requestsQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="page-stack">
      <section className="welcome-row">
        <div>
          <p className="page-kicker">نمای کلی فعالیت‌ها</p>
          <h2>روز بخیر، به پنل درخواست‌ها خوش آمدید</h2>
          <p className="welcome-description">
            وضعیت درخواست‌های سازمان را در یک نگاه دنبال کنید.
          </p>
        </div>
        <Link className="button button-primary" to="/requests/new">
          <Plus size={18} />
          ثبت درخواست
        </Link>
      </section>

      <section className="stats-grid" aria-label="آمار درخواست‌ها">
        <StatCard
          label="کل درخواست‌ها"
          value={statsQuery.isPending ? null : (statsQuery.data?.total ?? 0)}
          icon={ClipboardList}
          tone="blue"
          helper="تمام درخواست‌ها"
        />
        <StatCard
          label="درخواست‌های جدید"
          value={statsQuery.isPending ? null : (statsQuery.data?.new ?? 0)}
          icon={CircleDot}
          tone="amber"
          helper="نیازمند بررسی"
        />
        <StatCard
          label="در حال بررسی"
          value={statsQuery.isPending ? null : (statsQuery.data?.in_progress ?? 0)}
          icon={Clock3}
          tone="slate"
          helper="در جریان"
        />
        <StatCard
          label="تکمیل‌شده"
          value={statsQuery.isPending ? null : (statsQuery.data?.completed ?? 0)}
          icon={CheckCircle2}
          tone="green"
          helper="بسته‌شده"
        />
      </section>

      <section className="content-panel">
        <div className="panel-heading">
          <div>
            <h3>آخرین درخواست‌ها</h3>
            <p>جدیدترین موارد ثبت‌شده در سامانه</p>
          </div>
          <Link className="text-link" to="/requests">
            مشاهده همه
            <ArrowLeft size={16} />
          </Link>
        </div>

        {requestsQuery.isPending ? (
          <StateView kind="loading" title="در حال دریافت درخواست‌ها" />
        ) : requestsQuery.data?.items.length ? (
          <div className="recent-list">
            {requestsQuery.data.items.map((request) => (
              <Link className="recent-item" to={`/requests/${request.id}`} key={request.id}>
                <span className="request-file-icon">
                  <ClipboardList size={19} />
                </span>
                <span className="recent-main">
                  <strong>{request.title}</strong>
                  <small>{request.requester} · {formatDate(request.created_at)}</small>
                </span>
                <span className="recent-meta">
                  <PriorityBadge priority={request.priority} />
                  <StatusBadge status={request.status} />
                </span>
                <ArrowUpLeft className="recent-arrow" size={17} />
              </Link>
            ))}
          </div>
        ) : (
          <StateView
            kind="empty"
            title="هنوز درخواستی ثبت نشده است"
            description="با ثبت اولین درخواست، فعالیت‌ها در این بخش نمایش داده می‌شوند."
            action={
              <Link className="button button-primary button-small" to="/requests/new">
                <Plus size={16} />
                ثبت درخواست
              </Link>
            }
          />
        )}
      </section>

    </div>
  );
}
