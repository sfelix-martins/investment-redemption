import formatCurrency from '../../../utils/formatCurrency/formatCurrency';

export class EmptyAmountToReedemError extends Error {
  constructor() {
    super('Preencha os valores a resgatar!');
  }
}

export class ValueToRedeemGreaterThanAvailableError extends Error {
  constructor() {
    super('O valor a resgatar não pode ser maior que o saldo disponível');
  }
}

export const mountMaxValueErrorMessage = (max: number) => {
  return `Valor não pode ser maior que ${formatCurrency(max, {
    withSymbol: true,
  })}`;
};
