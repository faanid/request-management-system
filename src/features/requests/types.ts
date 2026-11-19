export type RequestStatus = "new" | "in_progress" | "completed";
export type RequestPriority = "low" | "medium" | "high";

export interface RequestRecord {
  id: number;
  title: string;
  description: string;
  requester: string;
  priority: RequestPriority;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  version: number;
}

export interface RequestListResponse {
  items: RequestRecord[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface RequestFilters {
  q?: string;
  status?: RequestStatus | "";
  priority?: RequestPriority | "";
  page: number;
  page_size: number;
}

export interface RequestPayload {
  title: string;
  description: string;
  requester: string;
  priority: RequestPriority;
}

export interface UpdateRequestPayload extends Partial<RequestPayload> {
  status?: RequestStatus;
  expected_version: number;
}

export interface DashboardStats {
  total: number;
  new: number;
  in_progress: number;
  completed: number;
  open: number;
}
