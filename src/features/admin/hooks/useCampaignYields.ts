import { useQuery } from '@tanstack/react-query';
import { LineYieldRepository } from '@/infrastructure/api/repositories/LineYieldRepository';
import { useMemo } from 'react';

export const useCampaignYields = (campaignId: string) => {
  const query = useQuery({
    queryKey: ['campaign-yields', campaignId],
    queryFn: () => LineYieldRepository.getByCampaign(campaignId),
    enabled: !!campaignId,
    staleTime: 1000 * 30, // Yield data refreshes every 30s
    refetchInterval: 1000 * 30,
  });

  const stats = useMemo(
    () => LineYieldRepository.computeStats(query.data ?? []),
    [query.data]
  );

  return { ...query, stats };
};
