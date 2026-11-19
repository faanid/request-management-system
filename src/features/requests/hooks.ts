import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getRequest, getRequests, updateRequest } from "./api";
import type {
  DashboardStats,
  RequestFilters,
  RequestListResponse,
  RequestRecord,
  UpdateRequestPayload,
} from "./types";

export const requestKeys = {
  lists: () => ["requests", "list"] as const,
  list: (filters: RequestFilters) => ["requests", "list", filters] as const,
  detail: (id: number) => ["requests", "detail", id] as const,
};

export function useRequests(filters: RequestFilters) {
  return useQuery({
    queryKey: requestKeys.list(filters),
    queryFn: () => getRequests(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useRequest(id: number) {
  return useQuery({
    queryKey: requestKeys.detail(id),
    queryFn: () => getRequest(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}

interface UpdateVariables {
  id: number;
  payload: UpdateRequestPayload;
}

interface UpdateContext {
  previousLists: [readonly unknown[], RequestListResponse | undefined][];
  previousDetail: RequestRecord | undefined;
  previousStats: DashboardStats | undefined;
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation<RequestRecord, Error, UpdateVariables, UpdateContext>({
    mutationFn: ({ id, payload }) => updateRequest(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: requestKeys.lists() });
      await queryClient.cancelQueries({ queryKey: requestKeys.detail(id) });

      const previousLists = queryClient.getQueriesData<RequestListResponse>({
        queryKey: requestKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<RequestRecord>(requestKeys.detail(id));
      const previousStats = queryClient.getQueryData<DashboardStats>(["dashboard", "stats"]);

      previousLists.forEach(([queryKey, cached]) => {
        if (!cached) return;
        queryClient.setQueryData<RequestListResponse>(queryKey, {
          ...cached,
          items: cached.items.map((item) => (
            item.id === id ? { ...item, ...payload } : item
          )),
        });
      });

      if (previousDetail) {
        queryClient.setQueryData<RequestRecord>(requestKeys.detail(id), {
          ...previousDetail,
          ...payload,
        });
      }

      if (previousStats && payload.status) {
        const currentStatus = previousDetail?.status
          ?? previousLists.flatMap(([, cached]) => cached?.items ?? [])
            .find((item) => item.id === id)?.status;

        if (currentStatus && currentStatus !== payload.status) {
          const nextStats = { ...previousStats };
          nextStats[currentStatus] = Math.max(0, nextStats[currentStatus] - 1);
          nextStats[payload.status] += 1;
          nextStats.open = nextStats.new + nextStats.in_progress;
          queryClient.setQueryData(["dashboard", "stats"], nextStats);
        }
      }

      return { previousLists, previousDetail, previousStats };
    },
    onError: (_error, variables, context) => {
      context?.previousLists.forEach(([queryKey, cached]) => {
        queryClient.setQueryData(queryKey, cached);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(requestKeys.detail(variables.id), context.previousDetail);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(["dashboard", "stats"], context.previousStats);
      }
    },
    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: requestKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: requestKeys.detail(variables.id) }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] }),
      ]);
    },
  });
}
