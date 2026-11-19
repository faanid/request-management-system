import { apiRequest } from "../../shared/api/client";
import type {
  RequestFilters,
  RequestListResponse,
  RequestPayload,
  RequestRecord,
  UpdateRequestPayload,
} from "./types";

export function getRequests(filters: RequestFilters): Promise<RequestListResponse> {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  params.set("page", String(filters.page));
  params.set("page_size", String(filters.page_size));

  return apiRequest<RequestListResponse>(`/api/requests?${params.toString()}`);
}

export function getRequest(id: number): Promise<RequestRecord> {
  return apiRequest<RequestRecord>(`/api/requests/${id}`);
}

export function createRequest(payload: RequestPayload): Promise<RequestRecord> {
  return apiRequest<RequestRecord>("/api/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateRequest(
  id: number,
  payload: UpdateRequestPayload,
): Promise<RequestRecord> {
  return apiRequest<RequestRecord>(`/api/requests/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
