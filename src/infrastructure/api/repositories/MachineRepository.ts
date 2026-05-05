import axiosClient from '../axios-client';
import { Campaign } from '@/core/domain/entities';

interface ApiCampaign {
  id: string;
  company_id: string;
  codigo: string;
  status: string;
  started_at: string;
  finished_at?: string | null;
  total_yield_records?: number;
  machine: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  article: {
    id: string;
    name: string;
  };
}

const mapCampaign = (raw: ApiCampaign): Campaign => ({
  id: raw.id,
  campaignNumber: raw.codigo,
  articleId: raw.article?.id ?? '',
  machineId: raw.machine?.id ?? '',
  clientId: raw.client?.id ?? '',
  status: mapStatus(raw.status),
  startDate: raw.started_at,
  endDate: raw.finished_at ?? undefined,
  articleName: raw.article?.name,
  clientName: raw.client?.name,
  machineName: raw.machine?.name,
  companyName: (raw as any).company_name,
  totalYieldRecords: raw.total_yield_records,
});

function mapStatus(status: string): Campaign['status'] {
  const s = status.toLowerCase();
  if (s === 'active' || s === 'open') return 'active';
  if (s === 'finished' || s === 'completed' || s === 'closed') return 'completed';
  if (s === 'paused') return 'paused';
  return 'active';
}

export const MachineRepository = {
  /**
   * GET /v1/campaigns
   * Backend returns campaigns for the specified company (via X-Company-ID header).
   * We filter client-side by machineId.
   */
  async getCampaigns(machineId: string, companyId?: string): Promise<Campaign[]> {
    const response = await axiosClient.get<{ data: ApiCampaign[] }>('/v1/campaigns', {
      ...(companyId ? { headers: { 'X-Company-ID': companyId } } : {}),
    });
    const raw = Array.isArray(response.data.data)
      ? response.data.data
      : (response.data as any);
    const all = (Array.isArray(raw) ? raw : []).map(mapCampaign);
    // Filter by the specific machine
    return all.filter((c) => c.machineId === machineId);
  },

  /**
   * GET /v1/campaigns (all)
   * Returns all campaigns for the specified company context.
   */
  async getAllCampaigns(companyId?: string): Promise<Campaign[]> {
    const response = await axiosClient.get<{ data: ApiCampaign[] }>('/v1/campaigns', {
      ...(companyId ? { headers: { 'X-Company-ID': companyId } } : {}),
    });
    const raw = Array.isArray(response.data.data)
      ? response.data.data
      : (response.data as any);
    return (Array.isArray(raw) ? raw : []).map(mapCampaign);
  },
  
  /**
   * GET /v1/mobile/active-campaigns
   * Returns all active campaigns across all companies.
   */
  async getActiveCampaigns(): Promise<Campaign[]> {
    const response = await axiosClient.get<{ data: ApiCampaign[] }>('/v1/mobile/active-campaigns');
    const raw = Array.isArray(response.data.data)
      ? response.data.data
      : (response.data as any);
    return (Array.isArray(raw) ? raw : []).map(mapCampaign);
  },
};
