import useSWR from 'swr';

import { Invesment } from '../../api/entities';
import { fetchInvestments } from '../../api/investments/fetchInvestments';

export function useInvestmentsSWR() {
  const { data, error } = useSWR<Invesment[]>('invesments', fetchInvestments);

  return {
    data: data ?? [],
    isLoading: !data,
    error,
  };
}
