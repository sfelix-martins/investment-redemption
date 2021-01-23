import { Invesment } from '../../api/entities';
import { useInvestmentsSWR } from './useInvestmentsSWR';

interface UseInvestmentsApi {
  data: Invesment[];
  isLoading: boolean;
  error: unknown;
}

export function useInvestments(): UseInvestmentsApi {
  return useInvestmentsSWR();
}
