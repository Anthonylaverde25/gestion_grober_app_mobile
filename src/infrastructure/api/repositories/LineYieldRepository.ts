import axiosClient from '../axios-client';
import { LineYieldRecord, YieldStats } from '@/core/domain/entities';

/**
 * Real API shape from LineYieldResource:
 * {
 *   id, company_id, campaign_id,
 *   forming_yield, packing_yield,
 *   recorded_at, notes,
 *   alias: { id, alias } | null
 * }
 */
interface ApiLineYield {
  id: string;
  company_id: string;
  campaign_id: string;
  forming_yield: number;
  packing_yield: number;
  recorded_at: string;
  notes?: string | null;
  alias?: {
    id: string;
    alias: string;
  } | null;
}

const mapLineYield = (raw: ApiLineYield): LineYieldRecord => ({
  id: raw.id,
  campaignId: raw.campaign_id,
  // Overall yield = average of forming and packing
  yieldPercentage: Math.round(((Number(raw.forming_yield) + Number(raw.packing_yield)) / 2) * 10) / 10,
  formingYield: Number(raw.forming_yield),
  packingYield: Number(raw.packing_yield),
  reportedAt: raw.recorded_at,
  status: 'synced',
  operatorAlias: raw.alias?.alias,
});

export const LineYieldRepository = {
  /**
   * GET /v1/campaigns/:id/line-yields/history
   * All yield records for a campaign.
   */
  async getByCampaign(campaignId: string): Promise<LineYieldRecord[]> {
    const response = await axiosClient.get<{ data: ApiLineYield[] }>(
      `/v1/mobile/campaigns/${campaignId}/yields`
    );
    const raw = Array.isArray(response.data.data)
      ? response.data.data
      : (response.data as any);
    return (Array.isArray(raw) ? raw : []).map(mapLineYield);
  },

  /**
   * Compute basic stats from a list of yield records.
   */
  computeStats(records: LineYieldRecord[]): YieldStats {
    if (records.length === 0) {
      return { average: 0, max: 0, min: 0, trend: 'stable' };
    }
    const vals = records.map((r) => r.yieldPercentage);
    const average = vals.reduce((a, b) => a + b, 0) / vals.length;
    const max = Math.max(...vals);
    const min = Math.min(...vals);

    let trend: YieldStats['trend'] = 'stable';
    if (records.length >= 2) {
      const last = vals[vals.length - 1];
      const prev = vals[vals.length - 2];
      if (last > prev + 1) trend = 'up';
      else if (last < prev - 1) trend = 'down';
    }
    return { average: Math.round(average * 10) / 10, max, min, trend };
  },
};
