import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/infrastructure/api/axios-client';
import { getDatabase } from '@/infrastructure/persistence/sqlite';
import { LineYieldRecord as LineYield } from '@/core/domain/entities';

export const useYieldReporting = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (yieldData: LineYield) => {
      // 1. Save to SQLite first (Offline-First)
      const db = await getDatabase();
      await db.runAsync(
        'INSERT INTO pending_yields (campaign_id, yield_percentage, reported_at, status) VALUES (?, ?, ?, ?)',
        [yieldData.campaignId, yieldData.yieldPercentage, yieldData.reportedAt, 'pending']
      );

      // 2. Attempt to send to API
      try {
        const response = await axiosClient.post('/v1/line-yields', {
          campaign_id: yieldData.campaignId,
          yield_percentage: yieldData.yieldPercentage,
          reported_at: yieldData.reportedAt,
        });

        // 3. If success, update SQLite to 'synced'
        await db.runAsync(
          'UPDATE pending_yields SET status = ? WHERE campaign_id = ? AND reported_at = ?',
          ['synced', yieldData.campaignId, yieldData.reportedAt]
        );

        return response.data;
      } catch (error) {
        console.error('Sync failed, kept as pending in SQLite', error);
        throw error; // Let React Query handle the error state
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['line-yields'] });
    },
  });

  return {
    reportYield: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
