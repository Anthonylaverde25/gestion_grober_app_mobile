import { useQuery } from '@tanstack/react-query';
import { MachineRepository } from '@/infrastructure/api/repositories/MachineRepository';

export const useMachineCampaigns = (machineId: string, companyId?: string) =>
  useQuery({
    queryKey: ['machine-campaigns', machineId, companyId],
    queryFn: () => MachineRepository.getCampaigns(machineId, companyId),
    enabled: !!machineId,
    staleTime: 1000 * 60 * 2,
  });
