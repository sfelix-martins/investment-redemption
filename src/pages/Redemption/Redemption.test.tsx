import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import { Investment } from '../../api/entities';
import Redemption from './Redemption';
import * as safeArea from 'react-native-safe-area-context';
import formatCurrency from '../../utils/formatCurrency/formatCurrency';
import * as redemptionHook from '../../hooks/useRedemption/useRedemption';
import * as dialogHook from '../../hooks/useDialog/useDialog';
import { left, right } from '../../utils/logic/Either';
import { DialogContextData } from '../../contexts/DialogContext/DialogContext';

jest.mock('../../hooks/useRedemption/useRedemption');
jest.mock('../../hooks/useDialog/useDialog');
jest.mock('react-native-safe-area-context');

const useDialogMock = dialogHook.default as jest.MockedFunction<
  typeof dialogHook.default
>;
const useRedemptionMock = redemptionHook.default as jest.MockedFunction<
  typeof redemptionHook.default
>;

const useSafeAreaInsetsMock = safeArea.useSafeAreaInsets as jest.MockedFunction<
  typeof safeArea.useSafeAreaInsets
>;
useSafeAreaInsetsMock.mockReturnValue({
  bottom: 10,
  left: 10,
  right: 10,
  top: 10,
});

const mockUseRedemption = (options?: redemptionHook.UseRedemptionApi) => {
  const defaultMock = {
    hasErrorOnStock: jest.fn(),
    getStockError: jest.fn(),
    totalValue: 100,
    getStockRedemptionValue: jest.fn(),
  } as any;

  useRedemptionMock.mockReturnValue({
    ...defaultMock,
    ...options,
  });
};

interface SetupOptions {
  investment?: Investment;
  mockUseRedemptionOptions?: redemptionHook.UseRedemptionApi;
  mockUseDialogOptions?: Partial<DialogContextData>;
}

const setup = (options?: SetupOptions) => {
  mockUseRedemption(options?.mockUseRedemptionOptions);

  let investment = options?.investment;

  if (!investment) {
    investment = {
      goal: 'as',
      inGracePeriod: false,
      name: 'My best investment',
      stocks: [],
      totalBalance: 1000,
    };
  }

  const route = { params: { investment } } as any;

  useDialogMock.mockReturnValue({
    showErrorDialog: jest.fn(),
    showSuccessDialog: jest.fn(),
    ...options?.mockUseDialogOptions,
  });

  const utils = render(<Redemption route={route} />);

  return {
    utils,
    investment,
  };
};

it('should render the investment name and total balance', () => {
  const {
    utils: { getByText },
    investment,
  } = setup();

  const investmentName = getByText(investment.name);
  const totalBalance = getByText('R$ 1.000,00');

  expect(investmentName).toBeDefined();
  expect(totalBalance).toBeDefined();
});

it('should render a symbol, balance and input for each invesment stock', () => {
  const investment: Investment = {
    goal: 'Vacation',
    inGracePeriod: false,
    name: 'First',
    totalBalance: 300,
    stocks: [
      {
        id: '1',
        balance: 30,
        symbol: 'BBAS3',
        percentage: 10,
      },
      {
        id: '2',
        balance: 270,
        symbol: 'VALE3',
        percentage: 90,
      },
    ],
  };

  const {
    utils: { getByText, getAllByLabelText },
  } = setup({ investment });

  const inputs = getAllByLabelText('Valor a resgatar');
  expect(inputs.length).toBe(investment.stocks.length);
  investment.stocks.forEach((stock) => {
    expect(getByText(stock.symbol)).toBeDefined();
    expect(
      getByText(formatCurrency(stock.balance, { withSymbol: true })),
    ).toBeDefined();
  });
});

it('should show validation error when has error in stock', () => {
  const investment: Investment = {
    goal: 'Vacation',
    inGracePeriod: false,
    name: 'First',
    totalBalance: 300,
    stocks: [
      {
        id: '1',
        balance: 30,
        symbol: 'BBAS3',
        percentage: 10,
      },
    ],
  };

  const errorMessage = 'Some error message';
  const {
    utils: { getByA11yRole },
  } = setup({
    investment,
    mockUseRedemptionOptions: {
      getStockError: jest.fn().mockReturnValue(errorMessage),
      hasErrorOnStock: jest.fn().mockReturnValue(true),
    } as any,
  });

  const helperText = getByA11yRole('alert');

  expect(helperText.props.children).toBe(errorMessage);
});

it('should render the total value', () => {
  const totalValue = 8090;
  const {
    utils: { getByText },
  } = setup({
    mockUseRedemptionOptions: {
      totalValue,
    } as any,
  });

  const totalValueElement = getByText(
    formatCurrency(totalValue, { withSymbol: true }),
  );

  expect(totalValueElement).toBeDefined();
});

it('should show error dialog when confirm redeem and occurr some error', () => {
  let showErrorDialogMock = jest.fn();

  const errorMessage = 'Something is wrong';
  const {
    utils: { getByA11yRole },
  } = setup({
    mockUseDialogOptions: {
      showErrorDialog: showErrorDialogMock,
    } as any,
    mockUseRedemptionOptions: {
      redeem: jest.fn().mockReturnValue(left(new Error(errorMessage))),
    } as any,
  });

  const confirmRedeemButton = getByA11yRole('button');

  fireEvent.press(confirmRedeemButton);

  expect(showErrorDialogMock).toHaveBeenCalledWith({
    message: errorMessage,
  });
});

it('should show sucess dialog when redeem works fine', () => {
  let showSuccessDialogMock = jest.fn();

  const successMessage = 'OK';
  const {
    utils: { getByA11yRole },
  } = setup({
    mockUseDialogOptions: {
      showSuccessDialog: showSuccessDialogMock,
    },
    mockUseRedemptionOptions: {
      redeem: jest.fn().mockReturnValue(
        right({
          message: successMessage,
        }),
      ),
    } as any,
  });

  const confirmRedeemButton = getByA11yRole('button');

  fireEvent.press(confirmRedeemButton);

  expect(showSuccessDialogMock).toHaveBeenCalledWith({
    actionText: 'Novo resgate',
    message: successMessage,
    title: 'Resgate Efetuado!',
  });
});
