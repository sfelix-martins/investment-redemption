import { AxiosError } from 'axios';
import { useCallback } from 'react';

import {
  Investment,
  InvestmentWithoutStockBalanceDefined,
  StockWithoutBalanceDefined,
} from '../../api/entities';
import { useInvestmentsSWR } from './useInvestmentsSWR';

interface UseInvestmentsApi {
  data: Investment[];
  isLoading: boolean;
  error?: AxiosError;
}

function calculateStockBalance(
  investment: InvestmentWithoutStockBalanceDefined,
  stock: StockWithoutBalanceDefined,
) {
  return investment.totalBalance * (stock.percentage / 100);
}

function getStocksWithBalanceDefined(
  investment: InvestmentWithoutStockBalanceDefined,
) {
  return investment.stocks.map((stock) => ({
    ...stock,
    balance: calculateStockBalance(investment, stock),
  }));
}

export function useInvestments(): UseInvestmentsApi {
  const { data, isLoading, error } = useInvestmentsSWR();

  const calculateInvestmentStocksBalance = useCallback(() => {
    return data.map((investment) => ({
      ...investment,
      stocks: getStocksWithBalanceDefined(investment),
    }));
  }, [data]);

  return {
    data: calculateInvestmentStocksBalance(),
    isLoading,
    error,
  };
}
