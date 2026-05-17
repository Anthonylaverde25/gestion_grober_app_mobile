import axiosClient from '../axios-client';
import { LineYieldRecord, YieldStats, CampaignYieldSummary } from '@/core/domain/entities';

// ── Raw API shapes ────────────────────────────────────────────────────────────

interface ApiLineYield {
  id: string;
  company_id: string;
  campaign_id: string;
  forming_yield: number;
  packing_yield: number;
  recorded_at: string;
  notes?: string | null;
  alias?: { id: string; alias: string } | null;
}

interface ApiPaginatedYields {
  data: ApiLineYield[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface ApiYieldSummary {
  data: {
    kpis: {
      total_records: number;
      avg_forming: number;
      avg_packing: number;
      avg_total: number;
      max: number;
      min: number;
      trend: 'up' | 'down' | 'stable';
    };
    chart_points: Array<{
      label: string;        // "11/05 14h" — date + hour
      date_label: string;   // "11/05"
      time_label: string;   // "14:00"
      avg_forming: number;
      avg_packing: number;
      sample_count: number;
    }>;
    recent_records: Array<{
      id: string;
      forming_yield: number;
      packing_yield: number;
      avg_yield: number;
      time_label: string;   // "14:00"
      date_label: string;   // "11/05"
      operator_alias?: string | null;
    }>;
  };
}

// ── Mappers ───────────────────────────────────────────────────────────────────

const mapLineYield = (raw: ApiLineYield): LineYieldRecord => ({
  id: raw.id,
  campaignId: raw.campaign_id,
  yieldPercentage:
    Math.round(((Number(raw.forming_yield) + Number(raw.packing_yield)) / 2) * 10) / 10,
  formingYield: Number(raw.forming_yield),
  packingYield: Number(raw.packing_yield),
  reportedAt: raw.recorded_at,
  status: 'synced',
  operatorAlias: raw.alias?.alias,
});

// ── Repository ────────────────────────────────────────────────────────────────

export const LineYieldRepository = {
  /**
   * GET /v1/mobile/campaigns/:id/yields/summary
   *
   * Returns pre-processed KPIs, hourly chart points (label ready for gifted-charts),
   * and the last 24 records pre-formatted by the backend.
   * The frontend must NOT perform any numeric calculation on this data.
   */
  async getCampaignYieldSummary(campaignId: string): Promise<CampaignYieldSummary> {
    const response = await axiosClient.get<ApiYieldSummary>(
      `/v1/mobile/campaigns/${campaignId}/yields/summary`
    );
    const raw = response.data.data;

    return {
      kpis: {
        totalRecords: raw.kpis.total_records,
        avgForming:   raw.kpis.avg_forming,
        avgPacking:   raw.kpis.avg_packing,
        avgTotal:     raw.kpis.avg_total,
        max:          raw.kpis.max,
        min:          raw.kpis.min,
        trend:        raw.kpis.trend,
      },
      chartPoints: raw.chart_points.map((p) => ({
        label:       p.label,          // "11/05 14h"
        dateLabel:   p.date_label,     // "11/05"
        timeLabel:   p.time_label,     // "14:00"
        avgForming:  p.avg_forming,
        avgPacking:  p.avg_packing,
        sampleCount: p.sample_count,
      })),
      recentRecords: raw.recent_records.map((r) => ({
        id:            r.id,
        formingYield:  r.forming_yield,
        packingYield:  r.packing_yield,
        avgYield:      r.avg_yield,
        timeLabel:     r.time_label,
        dateLabel:     r.date_label,
        operatorAlias: r.operator_alias ?? undefined,
      })),
    };
  },

  /**
   * GET /v1/mobile/campaigns/:id/yields?page=N
   * Paginated raw records (30 per page) for the infinite-scroll history screen.
   */
  async getByCampaignPaginated(
    campaignId: string,
    page: number
  ): Promise<{ records: LineYieldRecord[]; meta: ApiPaginatedYields['meta'] }> {
    const response = await axiosClient.get<ApiPaginatedYields>(
      `/v1/mobile/campaigns/${campaignId}/yields`,
      { params: { page } }
    );
    return {
      records: response.data.data.map(mapLineYield),
      meta:    response.data.meta,
    };
  },

  /** @deprecated Use getByCampaignPaginated. Kept for backward compat. */
  async getByCampaign(campaignId: string): Promise<LineYieldRecord[]> {
    const result = await LineYieldRepository.getByCampaignPaginated(campaignId, 1);
    return result.records;
  },

  computeStats(records: LineYieldRecord[]): YieldStats {
    if (records.length === 0) return { average: 0, max: 0, min: 0, trend: 'stable' };
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
