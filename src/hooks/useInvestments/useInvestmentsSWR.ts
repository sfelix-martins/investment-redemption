import { AxiosError } from 'axios';
import useSWR from 'swr';

import { InvestmentWithoutStockBalanceDefined } from '../../api/entities';
import { fetchInvestments } from '../../api/investments/fetchInvestments';

export function useInvestmentsSWR() {
  const { data, error } = useSWR<
    InvestmentWithoutStockBalanceDefined[],
    AxiosError
  >('invesments', fetchInvestments, {
    errorRetryCount: 1,
  });

  return {
    data: data ?? [],
    isLoading: !data,
    error,
  };
}
