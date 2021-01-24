import React from 'react';

import { fireEvent, render } from '@testing-library/react-native';

import { Investment } from '../../api/entities';
import * as useInvestmentsHook from '../../hooks/useInvestments/useInvestments';
import formatCurrency from '../../utils/formatCurrency/formatCurrency';
import Investments from './Investments';

jest.mock('../../hooks/useInvestments/useInvestments');

const useInvestmentsMock = useInvestmentsHook.useInvestments as jest.MockedFunction<
  typeof useInvestmentsHook.useInvestments
>;

interface SetupOptions {
  useInvestmentsMockOptions?: Partial<useInvestmentsHook.UseInvestmentsApi>;
  navigateFunction?: any;
}

const setup = (options?: SetupOptions) => {
  useInvestmentsMock.mockReturnValue({
    data: [],
    isLoading: false,
    error: undefined,
    ...options?.useInvestmentsMockOptions,
  });

  return render(
    <Investments
      navigation={{ navigate: options?.navigateFunction ?? jest.fn() } as any}
    />,
  );
};

describe('Investments', () => {
  it('should render an error message if occur an error loading investments', () => {
    const { getByA11yRole } = setup({
      useInvestmentsMockOptions: {
        error: 1 as any,
      },
    });

    const errorAlert = getByA11yRole('alert');

    expect(errorAlert).toBeDefined();
  });

  it('should render a loading while load investments', () => {
    const { getByA11yRole } = setup({
      useInvestmentsMockOptions: {
        isLoading: true,
      },
    });

    const loading = getByA11yRole('progressbar');

    expect(loading).toBeDefined();
  });

  it('should render a list the investments showing name, goal and totalBalance', () => {
    const investments: Investment[] = [
      {
        goal: 'A new car',
        inGracePeriod: false,
        name: 'Investment I',
        stocks: [],
        totalBalance: 1000,
      },
      {
        goal: 'Vacation',
        inGracePeriod: false,
        name: 'Investment II',
        stocks: [],
        totalBalance: 2300,
      },
    ];

    const { getByText } = setup({
      useInvestmentsMockOptions: {
        data: investments,
      },
    });

    investments.forEach((investment) => {
      expect(getByText(investment.goal)).toBeDefined();
      expect(getByText(investment.name)).toBeDefined();
      expect(
        getByText(
          formatCurrency(investment.totalBalance, { withSymbol: false }),
        ),
      ).toBeDefined();
    });
  });

  it('should disable on list investments in grace period and not allow navigate to Redemption page', () => {
    const investments: Investment[] = [
      {
        goal: 'A new car',
        inGracePeriod: false,
        name: 'Investment I',
        stocks: [],
        totalBalance: 1000,
      },
      {
        goal: 'Vacation',
        inGracePeriod: true,
        name: 'Investment II',
        stocks: [],
        totalBalance: 2300,
      },
    ];

    const navigateMock = jest.fn();

    const { getByA11yState, getAllByA11yRole } = setup({
      useInvestmentsMockOptions: {
        data: investments,
      },
      navigateFunction: navigateMock,
    });

    const inGracePeriod = getByA11yState({ disabled: true });

    expect(inGracePeriod).toBeDefined();
    const [_, disabledItem] = getAllByA11yRole('button');

    fireEvent.press(disabledItem);

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('should navigate to Redemption details page when investment is not in grace period', () => {
    const investments: Investment[] = [
      {
        goal: 'A new car',
        inGracePeriod: false,
        name: 'Investment I',
        stocks: [],
        totalBalance: 1000,
      },
      {
        goal: 'Vacation',
        inGracePeriod: true,
        name: 'Investment II',
        stocks: [],
        totalBalance: 2300,
      },
    ];

    const navigateMock = jest.fn();

    const { getByA11yState, getAllByA11yRole } = setup({
      useInvestmentsMockOptions: {
        data: investments,
      },
      navigateFunction: navigateMock,
    });

    const inGracePeriod = getByA11yState({ disabled: true });

    expect(inGracePeriod).toBeDefined();
    const [firstItem] = getAllByA11yRole('button');

    fireEvent.press(firstItem);

    expect(navigateMock).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('Redemption', {
      investment: investments[0],
    });
  });
});
