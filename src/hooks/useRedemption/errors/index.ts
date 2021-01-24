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
