import { useQuery } from '@tanstack/react-query';
import { CompanyRepository } from '@/infrastructure/api/repositories/CompanyRepository';

export const useCompanies = () =>
  useQuery({
    queryKey: ['companies'],
    queryFn: () => CompanyRepository.getAll(),
    staleTime: 1000 * 60 * 3,
  });

export const useCompany = (id: string) =>
  useQuery({
    queryKey: ['company', id],
    queryFn: () => CompanyRepository.getById(id),
    enabled: !!id,
  });

export const useCompanyMachines = (companyId: string) =>
  useQuery({
    queryKey: ['company-machines', companyId],
    queryFn: () => CompanyRepository.getMachines(companyId),
    enabled: !!companyId,
    staleTime: 1000 * 60 * 2,
  });
