import {
  ClipboardList,
  LayoutDashboard,
  Plus,
  Search,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router";

const pageTitles: Record<string, string> = {
  "/": "داشبورد",
  "/requests": "درخواست‌ها",
  "/requests/new": "ثبت درخواست جدید",
};

export function AppLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname]
    ?? (location.pathname.endsWith("/edit") ? "ویرایش درخواست" : "جزئیات درخواست");

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">
            <ClipboardList size={22} />
          </span>
          <span>
            <strong>درخواست‌یار</strong>
            <small>سامانه مدیریت سازمانی</small>
          </span>
        </div>

        <div className="sidebar-label">فضای کاری</div>
        <nav className="main-nav" aria-label="منوی اصلی">
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <LayoutDashboard size={19} />
            <span>داشبورد</span>
          </NavLink>
          <NavLink to="/requests" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <ClipboardList size={19} />
            <span>همه درخواست‌ها</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-dot" />
            <div>
              <strong>سرویس محلی</strong>
              <small>اتصال به API آزمایشی</small>
            </div>
          </div>
          <span className="sidebar-version">نسخه ارزیابی ۱.۰</span>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-heading">
            <span className="breadcrumb">پنل مدیریت</span>
            <h1>{title}</h1>
          </div>
          <div className="topbar-actions">
            <Link className="icon-button topbar-search" to="/requests" aria-label="جست‌وجوی درخواست‌ها">
              <Search size={19} />
            </Link>
            <div className="profile">
              <span className="profile-avatar">ف</span>
              <span className="profile-copy">
                <strong>کاربر سیستم</strong>
                <small>مدیر</small>
              </span>
            </div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>

        {location.pathname !== "/requests/new" && !location.pathname.endsWith("/edit") && (
          <NavLink to="/requests/new" className="mobile-create" aria-label="ثبت درخواست جدید">
            <Plus size={22} />
          </NavLink>
        )}
      </div>
    </div>
  );
}
