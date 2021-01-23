import { act } from 'react-test-renderer';

import { renderHook } from '@testing-library/react-hooks';

import useRedemption from './useRedemption';
import { Stock } from '../../api/entities';

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

  it('should set an error and remove the stock redemption when amount to redeem is greater than stock balance', () => {
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
    expect(result.current.stockRedemptions[stock.id]).toBeUndefined();
    expect(result.current.totalValue).toBe(0);
  });

  it('should set an error and remove the wrong stock redemption when amount to redeem is greater than stock balance and has more than one stock redemption', () => {
    const { result } = renderHook(() => useRedemption());

    const stock: Stock = {
      id: '1234',
      balance: 100,
      symbol: 'ITSA4',
      percentage: 0,
    };
    const validAmountToRedeem = 100;
    const greatedThanBalanceAmountToRedeem = 101;

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
        greatedThanBalanceAmountToRedeem,
      );
      result.current.setStockAmountToRedeem(
        anotherStock,
        validAnotherAmountToRedeem,
      );
    });

    expect(result.current.getStockError(stock)).toBe(
      'Valor não pode ser maior que R$ 100,00',
    );
    expect(result.current.stockRedemptions[stock.id]).toBeUndefined();
    expect(result.current.stockRedemptions[anotherStock.id]).toBeDefined();
    expect(result.current.totalValue).toBe(validAnotherAmountToRedeem);
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
    expect(result.current.stockRedemptions[stock.id]).toBeUndefined();
    expect(result.current.totalValue).toBe(0);

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
