import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AppProviders } from "./AppProviders";
import { AppLayout } from "../shared/components/AppLayout";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { RequestsPage } from "../features/requests/RequestsPage";
import { RequestDetailsPage } from "../features/requests/RequestDetailsPage";
import { RequestFormPage } from "../features/requests/RequestFormPage";

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="requests" element={<RequestsPage />} />
            <Route path="requests/new" element={<RequestFormPage />} />
            <Route path="requests/:id" element={<RequestDetailsPage />} />
            <Route path="requests/:id/edit" element={<RequestFormPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}
