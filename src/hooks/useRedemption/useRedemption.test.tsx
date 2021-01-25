import { act } from 'react-test-renderer';

import { renderHook } from '@testing-library/react-hooks';

import { Stock } from '../../api/entities';
import {
  EmptyAmountToReedemError,
  ValueToRedeemGreaterThanAvailableError,
} from './errors';
import useRedemption from './useRedemption';

describe('setStockamountToRedeem', () => {
  it('should add a stock redemption value updating total value when not exists', () => {
    const { result } = renderHook(() => useRedemption());

    const stock: Stock = {
      id: '1234',
      balance: 100,
      symbol: 'ITSA4',
      percentage: 0,
    };
    const amountToRedeem = 50;

    act(() => {
      result.current.setStockAmountToRedeem(stock, amountToRedeem);
    });

    expect(result.current.stockRedemptions).toStrictEqual({
      [stock.id]: {
        stock,
        value: amountToRedeem,
      },
    });
    expect(result.current.totalValue).toBe(amountToRedeem);
  });

  it('should udpate the stock redemption value updating total value when it exists', () => {
    const { result } = renderHook(() => useRedemption());

    const stock: Stock = {
      id: '1234',
      balance: 100,
      symbol: 'ITSA4',
      percentage: 0,
    };
    const amountToRedeem = 50;

    act(() => {
      result.current.setStockAmountToRedeem(stock, 90);
      result.current.setStockAmountToRedeem(stock, amountToRedeem);
    });

    expect(result.current.stockRedemptions).toStrictEqual({
      [stock.id]: {
        stock,
        value: amountToRedeem,
      },
    });
    expect(result.current.totalValue).toBe(amountToRedeem);
  });

  it('should add a stock redemption value, keep the existent stock redemptions updating total value when add another stock redemption', async () => {
    const { result } = renderHook(() => useRedemption());

    const stock: Stock = {
      id: '1234',
      balance: 100,
      symbol: 'ITSA4',
      percentage: 0,
    };
    const amountToRedeem = 50;
    const anotherstock: Stock = {
      id: '4321',
      balance: 1000,
      symbol: 'KLBN11',
      percentage: 0,
    };
    const anotherAmountToRedeem = 100;

    act(() => {
      result.current.setStockAmountToRedeem(stock, amountToRedeem);
      result.current.setStockAmountToRedeem(
        anotherstock,
        anotherAmountToRedeem,
      );
    });

    expect(result.current.stockRedemptions).toStrictEqual({
      [stock.id]: {
        stock,
        value: amountToRedeem,
      },
      [anotherstock.id]: {
        stock: anotherstock,
        value: anotherAmountToRedeem,
      },
    });
    expect(result.current.totalValue).toBe(
      anotherAmountToRedeem + amountToRedeem,
    );
  });

  it('should set an error when amount to redeem is greater than stock balance', () => {
    const { result } = renderHook(() => useRedemption());

    const stock: Stock = {
      id: '1234',
      balance: 100,
      symbol: 'ITSA4',
      percentage: 0,
    };
    const amountToRedeem = 101;

    act(() => {
      result.current.setStockAmountToRedeem(stock, amountToRedeem);
    });

    expect(result.current.hasErrorOnStock(stock)).toBe(true);
    expect(result.current.getStockError(stock)).toBe(
      'Valor não pode ser maior que R$ 100,00',
    );
  });

  it('should set an error when amount to redeem is greater than stock balance and has more than one stock redemption', () => {
    const { result } = renderHook(() => useRedemption());

    const stock: Stock = {
      id: '1234',
      balance: 100,
      symbol: 'ITSA4',
      percentage: 0,
    };
    const validAmountToRedeem = 100;
    const greaterThanBalanceAmountToRedeem = 101;

    const anotherStock: Stock = {
      id: '4321',
      balance: 100,
      symbol: 'KLBN11',
      percentage: 0,
    };
    const validAnotherAmountToRedeem = 90;

    act(() => {
      result.current.setStockAmountToRedeem(stock, validAmountToRedeem);
      result.current.setStockAmountToRedeem(
        stock,
        greaterThanBalanceAmountToRedeem,
      );
      result.current.setStockAmountToRedeem(
        anotherStock,
        validAnotherAmountToRedeem,
      );
    });

    expect(result.current.getStockError(stock)).toBe(
      'Valor não pode ser maior que R$ 100,00',
    );
    expect(result.current.stockRedemptions[anotherStock.id]).toBeDefined();
    expect(result.current.totalValue).toBe(
      validAnotherAmountToRedeem + greaterThanBalanceAmountToRedeem,
    );
  });

  it('should remove error when value is correct', () => {
    const { result } = renderHook(() => useRedemption());

    const stock: Stock = {
      id: '1234',
      balance: 100,
      symbol: 'ITSA4',
      percentage: 0,
    };
    const amountToRedeem = 101;

    act(() => {
      result.current.setStockAmountToRedeem(stock, amountToRedeem);
    });

    expect(result.current.hasErrorOnStock(stock)).toBe(true);
    expect(result.current.getStockError(stock)).toBe(
      'Valor não pode ser maior que R$ 100,00',
    );

    const newValidamountToRedeem = 100;
    act(() => {
      result.current.setStockAmountToRedeem(stock, newValidamountToRedeem);
    });

    expect(result.current.hasErrorOnStock(stock)).toBe(false);
    expect(result.current.getStockError(stock)).toBeUndefined();
    expect(result.current.stockRedemptions).toStrictEqual({
      [stock.id]: {
        stock,
        value: newValidamountToRedeem,
      },
    });
    expect(result.current.totalValue).toBe(newValidamountToRedeem);
  });
});

describe('redeem', () => {
  it('should return an error if one amount to redeem is greater than stock available balance', () => {
    const { result } = renderHook(() => useRedemption());

    const stock: Stock = {
      id: '1234',
      balance: 100,
      symbol: 'ITSA4',
      percentage: 0,
    };
    const amountToRedeem = 101;

    act(() => {
      result.current.setStockAmountToRedeem(stock, amountToRedeem);
    });

    const redeemedOrError = result.current.redeem();

    expect(redeemedOrError.isLeft()).toBe(true);
    expect(redeemedOrError.value).toBeInstanceOf(
      ValueToRedeemGreaterThanAvailableError,
    );
  });

  it('should return an error if total amount to redeem is empty', () => {
    const { result } = renderHook(() => useRedemption());

    const redeemedOrError = result.current.redeem();

    expect(redeemedOrError.isLeft()).toBe(true);
    expect(redeemedOrError.value).toBeInstanceOf(EmptyAmountToReedemError);
  });

  it('should return a success when all is OK', () => {
    const { result } = renderHook(() => useRedemption());

    const stock: Stock = {
      id: '1234',
      balance: 100,
      symbol: 'ITSA4',
      percentage: 0,
    };
    const amountToRedeem = 90;

    act(() => {
      result.current.setStockAmountToRedeem(stock, amountToRedeem);
    });

    const redeemedOrError = result.current.redeem();

    expect(redeemedOrError.isRight()).toBe(true);
    expect(redeemedOrError.value.message).toEqual(expect.any(String));
  });
});
