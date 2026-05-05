import { Campaign } from '@/core/domain/entities';

export interface CampaignDTO {
  id: string;
  company_id: string;
  codigo: string;
  status: 'active' | 'completed' | 'paused';
  started_at: string;
  finished_at: string | null;
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

export class CampaignMapper {
  static toDomain(dto: CampaignDTO): Campaign {
    return {
      id: dto.id,
      campaignNumber: dto.codigo,
      articleId: dto.article.id,
      machineId: dto.machine.id,
      clientId: dto.client.id,
      status: dto.status,
      startDate: dto.started_at,
      endDate: dto.finished_at || undefined,
      articleName: dto.article.name,
      clientName: dto.client.name,
    };
  }

  static toDomainList(dtos: CampaignDTO[]): Campaign[] {
    return dtos.map(this.toDomain);
  }
}
