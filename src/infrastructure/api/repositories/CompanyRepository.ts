import axiosClient from '../axios-client';
import { Company, Machine } from '@/core/domain/entities';

// ─── Raw API shapes (snake_case from Laravel) ────────────────────────────────

interface ApiCompany {
  id: string;
  name: string;
  slug?: string;
  country?: string;
  machines_count?: number;
  active_campaigns_count?: number;
  created_at?: string;
}

interface ApiMachine {
  id: string;
  name: string;
  company_id?: string;
  furnace_id?: string;
  status?: string;
  current_article?: {
    id: string;
    name: string;
  };
  current_campaign?: {
    id: string;
    client_name: string;
  } | null;
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

const mapCompany = (raw: ApiCompany): Company => ({
  id: raw.id,
  name: raw.name,
  slug: raw.slug,
  country: raw.country,
  machinesCount: raw.machines_count,
  activeCampaignsCount: raw.active_campaigns_count,
  createdAt: raw.created_at,
});

const mapMachine = (raw: ApiMachine): Machine => ({
  id: raw.id,
  name: raw.name,
  code: raw.furnace_id ?? '',
  companyId: raw.company_id,
  status: mapStatus(raw.status),
  type: raw.current_article?.name,
  currentCampaignId: raw.current_campaign?.id ?? undefined,
  currentClientName: raw.current_campaign?.client_name ?? undefined,
});

function mapStatus(status?: string): Machine['status'] {
  switch (status) {
    case 'operational': return 'active';
    case 'maintenance': return 'maintenance';
    case 'shutdown': return 'inactive';
    default: return 'active';
  }
}

// ─── Repository ───────────────────────────────────────────────────────────────

export const CompanyRepository = {
  /**
   * GET /v1/companies
   * Returns all companies the authenticated admin can see.
   */
  async getAll(): Promise<Company[]> {
    const response = await axiosClient.get<{ data: ApiCompany[] }>('/v1/companies');
    const raw = Array.isArray(response.data.data)
      ? response.data.data
      : (response.data as any);
    return (Array.isArray(raw) ? raw : []).map(mapCompany);
  },

  /**
   * GET /v1/companies/:id
   * Single company detail.
   */
  async getById(id: string): Promise<Company> {
    const response = await axiosClient.get<{ data: ApiCompany }>(`/v1/companies/${id}`);
    return mapCompany(response.data.data);
  },

  /**
   * GET /v1/machines?company_id=:id
   * Machines (hornos/líneas) belonging to a company.
   * NOTE: Backend requires company_id as query param, not as URL segment.
   */
  async getMachines(companyId: string): Promise<Machine[]> {
    const response = await axiosClient.get<{ data: ApiMachine[] }>('/v1/machines', {
      params: { company_id: companyId },
      headers: { 'X-Company-ID': companyId },
    });
    const raw = Array.isArray(response.data.data)
      ? response.data.data
      : (response.data as any);
    return (Array.isArray(raw) ? raw : []).map(mapMachine);
  },
};
