// ─────────────────────────────────────────────
// Domain Entities — Mobile Operations
// Mirrors: sistema_gestion_api contracts
// ─────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  slug?: string;
  country?: string;
  machinesCount?: number;
  activeCampaignsCount?: number;
  createdAt?: string;
}

export interface Machine {
  id: string;
  name: string;
  code: string;
  companyId?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  type?: string;
  currentCampaignId?: string;
  currentClientName?: string;
}

export interface Campaign {
  id: string;
  campaignNumber: string;
  articleId: string;
  machineId: string;
  clientId: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  articleName?: string;
  clientName?: string;
  machineName?: string;
  companyName?: string;
}

export interface LineYieldRecord {
  id: string;
  campaignId: string;
  yieldPercentage: number;
  formingYield?: number;
  packingYield?: number;
  reportedAt: string;
  operatorAlias?: string;
  status: 'pending' | 'synced' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  companies?: Company[];
}

export interface YieldStats {
  average: number;
  max: number;
  min: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * One hourly chart point — pre-formatted by the backend.
 * The `label` field ("14:00") is ready for gifted-charts; no frontend formatting needed.
 */
export interface YieldChartPoint {
  label: string;       // "14:00" — pre-formatted by backend (no frontend computation)
  avgForming: number;
  avgPacking: number;
  sampleCount: number;
}

/**
 * A recent record pre-formatted by the backend for the timeline list.
 * All display strings are computed server-side to keep the frontend render-only.
 */
export interface RecentYieldRecord {
  id: string;
  formingYield: number;
  packingYield: number;
  avgYield: number;
  timeLabel: string;      // "14:00" — pre-formatted by backend
  dateLabel: string;      // "11/05" — pre-formatted by backend
  operatorAlias?: string;
}

/** Full summary payload from GET /mobile/campaigns/{id}/yields/summary */
export interface CampaignYieldSummary {
  kpis: {
    totalRecords: number;
    avgForming: number;
    avgPacking: number;
    avgTotal: number;
    max: number;
    min: number;
    trend: 'up' | 'down' | 'stable';
  };
  chartPoints: YieldChartPoint[];
  recentRecords: RecentYieldRecord[];
}
