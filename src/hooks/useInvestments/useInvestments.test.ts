import { renderHook } from '@testing-library/react-hooks';

import { InvestmentWithoutStockBalanceDefined } from '../../api/entities';
import { useInvestments } from './useInvestments';
import * as useInvestmentsSWRHook from './useInvestmentsSWR';

jest.mock('./useInvestmentsSWR');

const useInvestmentsSWRMock = useInvestmentsSWRHook.default as jest.MockedFunction<
  typeof useInvestmentsSWRHook.default
>;

describe('useInvestments', () => {
  it('should return the stocks with balance calculated', () => {
    const data: InvestmentWithoutStockBalanceDefined = {
      totalBalance: 1000,
      stocks: [
        {
          id: '1',
          symbol: 'ITSA4',
          percentage: 10,
        },
        {
          id: '2',
          symbol: 'BBAS3',
          percentage: 50,
        },
        {
          id: '3',
          symbol: 'KLBN11',
          percentage: 40,
        },
      ],
    } as InvestmentWithoutStockBalanceDefined;

    useInvestmentsSWRMock.mockReturnValue({
      data: [data],
      error: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useInvestments());

    result.current.data.forEach((investment) => {
      investment.stocks.forEach((stock) => {
        if (stock.percentage === 10) {
          expect(stock.balance).toBe(100);
        }
        if (stock.percentage === 50) {
          expect(stock.balance).toBe(500);
        }
        if (stock.percentage === 40) {
          expect(stock.balance).toBe(400);
        }
      });
    });
  });
});
