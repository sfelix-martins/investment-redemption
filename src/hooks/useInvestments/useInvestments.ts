import { useCallback, useEffect, useState } from 'react';

import {
  Investment,
  InvestmentWithoutStockBalanceDefined,
  StockWithoutBalanceDefined,
} from '../../api/entities';
import { useInvestmentsSWR } from './useInvestmentsSWR';

interface UseInvestmentsApi {
  data: Investment[];
  isLoading: boolean;
  error: unknown;
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
  const [investments, setInvestments] = useState<Investment[]>([]);

  const { data, isLoading, error } = useInvestmentsSWR();

  const calculateInvestmentStocksBalance = useCallback(() => {
    return data.map((investment) => ({
      ...investment,
      stocks: getStocksWithBalanceDefined(investment),
    }));
  }, [data]);

  useEffect(() => {
    const investmentsWithStocksBalanceDefined = calculateInvestmentStocksBalance();
    setInvestments(investmentsWithStocksBalanceDefined);
  }, [calculateInvestmentStocksBalance]);

  return {
    data: investments,
    isLoading,
    error,
  };
}
