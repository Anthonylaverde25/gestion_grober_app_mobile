import { useQuery } from '@tanstack/react-query';
import { LineYieldRepository } from '@/infrastructure/api/repositories/LineYieldRepository';
import { CampaignYieldSummary } from '@/core/domain/entities';

/**
 * Hook to fetch the pre-processed yield summary for a campaign.
 * Used by: campaign detail screen (KPIs), YieldLineChart, and chart.tsx (expanded view).
 *
 * - Fetches hourly aggregated chart points (full campaign) from the backend.
 * - Also returns global KPIs computed server-side.
 * - Significantly faster than loading raw records: e.g. 2000 raw → 72 hourly points.
 */
export const useCampaignYieldSummary = (campaignId: string) => {
  return useQuery<CampaignYieldSummary>({
    queryKey: ['campaign-yield-summary', campaignId],
    queryFn: () => LineYieldRepository.getCampaignYieldSummary(campaignId),
    enabled: !!campaignId,
    staleTime: 1000 * 60,      // 1 minute — aggregated data changes less frequently
    refetchInterval: 1000 * 60, // Refresh every minute
  });
};
