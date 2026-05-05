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
