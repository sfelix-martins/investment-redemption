import { useCallback, useEffect, useState } from 'react';

import { Investment, Stock } from '../../api/entities';
import formatCurrency from '../../utils/formatCurrency/formatCurrency';
import { Either, left, right } from '../../utils/logic/Either';
import {
  EmptyAmountToReedemError,
  ValueToRedeemGreaterThanAvailableError,
} from './errors';

const mountMaxValueErrorMessage = (max: number) => {
  return `Valor não pode ser maior que ${formatCurrency(max, {
    withSymbol: true,
  })}`;
};

type ErrorMessage = string;

interface Errors {
  [stockId: string]: ErrorMessage;
}

interface StockRedemptions {
  [stockId: string]: {
    stock: Stock;
    value: number;
  };
}

type SuccessResponse = {
  message: string;
};

export interface UseRedemptionApi {
  setStockAmountToRedeem(stock: Stock, value: number): void;
  totalValue: number;
  getStockRedemptionValue(stock: Stock): number | undefined;
  hasErrorOnStock(stock: Stock): boolean;
  getStockError(stock: Stock): ErrorMessage;
  stockRedemptions: StockRedemptions;
  redeem(
    investment: Investment,
  ): Either<
    EmptyAmountToReedemError | ValueToRedeemGreaterThanAvailableError,
    SuccessResponse
  >;
  clear(): void;
}

export default function useRedemption(): UseRedemptionApi {
  const [stockRedemptions, setStockRedemptions] = useState<StockRedemptions>(
    {},
  );
  const [errors, setErrors] = useState<Errors>({});
  const [totalValue, setTotalValue] = useState(0);

  const updateTotalValue = useCallback(() => {
    let total = 0;
    for (const stockId in stockRedemptions) {
      total += stockRedemptions[stockId].value;
    }

    setTotalValue(total);
  }, [stockRedemptions]);

  useEffect(() => {
    updateTotalValue();
  }, [updateTotalValue]);

  const addValueGreaterThanBalanceError = useCallback((stock: Stock) => {
    setErrors((existentErrors) => ({
      ...existentErrors,
      [stock.id]: mountMaxValueErrorMessage(stock.balance),
    }));
  }, []);

  const removeValueGreaterThanBalanceError = useCallback((stock: Stock) => {
    setErrors((existentErrors) => {
      delete existentErrors[stock.id];
      return { ...existentErrors };
    });
  }, []);

  const addStockRedemptionValue = useCallback((stock: Stock, value: number) => {
    setStockRedemptions((existentStockRedemptions) => ({
      ...existentStockRedemptions,
      [stock.id]: { stock, value },
    }));
  }, []);

  const getStockError = useCallback((stock: Stock) => errors[stock.id], [
    errors,
  ]);

  const hasErrorOnStock = useCallback(
    (stock: Stock) => !!getStockError(stock),
    [getStockError],
  );

  const setStockAmountToRedeem = useCallback(
    (stock: Stock, value: number) => {
      if (value > stock.balance) {
        addValueGreaterThanBalanceError(stock);
      } else {
        removeValueGreaterThanBalanceError(stock);
      }

      addStockRedemptionValue(stock, value);
    },
    [
      addStockRedemptionValue,
      addValueGreaterThanBalanceError,
      removeValueGreaterThanBalanceError,
    ],
  );

  const redeem = useCallback(
    (
      investment: Investment,
    ): Either<EmptyAmountToReedemError, SuccessResponse> => {
      if (totalValue > investment.totalBalance) {
        return left(new ValueToRedeemGreaterThanAvailableError());
      }

      if (totalValue === 0) {
        return left(new EmptyAmountToReedemError());
      }

      return right({
        message: 'O valor solicitado está em sua conta em até 5 dias úteis',
      });
    },
    [totalValue],
  );

  const clear = useCallback(() => {
    setErrors({});
    setStockRedemptions({});
  }, []);

  const getStockRedemptionValue = useCallback(
    (stock: Stock) => stockRedemptions[stock.id]?.value,
    [stockRedemptions],
  );

  return {
    totalValue,
    stockRedemptions,
    setStockAmountToRedeem,
    getStockRedemptionValue,
    hasErrorOnStock,
    getStockError,
    redeem,
    clear,
  };
}
