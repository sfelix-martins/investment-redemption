export interface Stock {
  id: string;
  symbol: string;
  percentage: number;
  balance: number;
}

export interface Investment {
  name: string;
  goal: string;
  totalBalance: number;
  inGracePeriod: boolean;
  stocks: Stock[];
}

export type StockWithoutBalanceDefined = Omit<Stock, 'balance'>;

export type InvestmentWithoutStockBalanceDefined = Omit<
  Investment,
  'stocks'
> & {
  stocks: StockWithoutBalanceDefined[];
};
