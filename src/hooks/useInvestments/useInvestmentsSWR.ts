import useSWR from 'swr';

import { InvestmentWithoutStockBalanceDefined } from '../../api/entities';
import { fetchInvestments } from '../../api/investments/fetchInvestments';

export function useInvestmentsSWR() {
  const { data, error } = useSWR<InvestmentWithoutStockBalanceDefined[]>(
    'invesments',
    fetchInvestments,
  );

  return {
    data: data ?? [],
    isLoading: !data,
    error,
  };
}
