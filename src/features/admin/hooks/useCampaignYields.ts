import { useInfiniteQuery } from '@tanstack/react-query';
import { LineYieldRepository } from '@/infrastructure/api/repositories/LineYieldRepository';
import { useMemo } from 'react';

/**
 * Hook to fetch paginated yield records for the infinite scroll history screen.
 * Each page returns 40 records ordered by recorded_at desc.
 *
 * Use `useCampaignYieldSummary` instead for KPIs and chart data.
 */
export const useCampaignYields = (campaignId: string) => {
  const query = useInfiniteQuery({
    queryKey: ['campaign-yields', campaignId],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      LineYieldRepository.getByCampaignPaginated(campaignId, pageParam as number),
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    enabled: !!campaignId,
    staleTime: 1000 * 30, // 30s
  });

  // Flat list of all records fetched so far across all pages
  const allRecords = useMemo(
    () => query.data?.pages.flatMap((p) => p.records) ?? [],
    [query.data]
  );

  // First-page records only (for the compact list in the detail screen)
  const recentRecords = useMemo(
    () => query.data?.pages[0]?.records ?? [],
    [query.data]
  );

  // Total records from API meta (available after first page load)
  const totalRecords = query.data?.pages[0]?.meta.total ?? 0;

  return {
    ...query,
    allRecords,
    recentRecords,
    totalRecords,
  };
};
