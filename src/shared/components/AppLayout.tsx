import {
  ClipboardList,
  LayoutDashboard,
  Plus,
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
      <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
      <aside className="sidebar">
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

      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-heading">
            <span className="breadcrumb">پنل مدیریت</span>
            <h1>{title}</h1>
          </div>
        </header>

        <main className="page-content" id="main-content" tabIndex={-1}>
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
