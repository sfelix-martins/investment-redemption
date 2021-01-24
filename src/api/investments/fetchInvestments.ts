import axios from 'axios';

import {
  InvestmentWithoutStockBalanceDefined,
  StockWithoutBalanceDefined,
} from '../entities';

interface Acao {
  id: string;
  nome: string;
  percentual: number;
}

interface ListaInvestimento {
  nome: string;
  objetivo: string;
  saldoTotalDisponivel: number;
  indicadorCarencia: 'S' | 'N';
  acoes: Acao[];
}

interface FetchInvestmentsResponse {
  response: {
    status: string;
    data: {
      listaInvestimentos: ListaInvestimento[];
    };
  };
}

const convertFromResponseStockToStockEntity = (
  from: Acao,
): StockWithoutBalanceDefined => ({
  id: from.id,
  symbol: from.nome,
  percentage: from.percentual,
});

const convertFromResponseInvestmentToInvestmentEntity = (
  from: ListaInvestimento,
): InvestmentWithoutStockBalanceDefined => ({
  name: from.nome,
  goal: from.objetivo,
  totalBalance: from.saldoTotalDisponivel,
  inGracePeriod: from.indicadorCarencia === 'S',
  stocks: from.acoes.map(convertFromResponseStockToStockEntity),
});

export const fetchInvestments = async (): Promise<
  InvestmentWithoutStockBalanceDefined[]
> => {
  const { data } = await axios.get<FetchInvestmentsResponse>(
    'https://www.mocky.io/v2/5e76797e2f0000f057986099',
  );

  const investments: InvestmentWithoutStockBalanceDefined[] = data.response.data.listaInvestimentos.map(
    convertFromResponseInvestmentToInvestmentEntity,
  );

  return investments;
};
