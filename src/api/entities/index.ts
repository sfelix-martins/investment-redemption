export interface Stock {
  id: string;
  symbol: string;
  percentage: number;
}

export interface Invesment {
  name: string;
  goal: string;
  totalBalance: number;
  inGracePeriod: boolean;
  stocks: Stock[];
}
