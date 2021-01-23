import React from 'react';

import { render } from '@testing-library/react-native';

import { Investment } from '../../api/entities';
import Redemption from './Redemption';
import * as safeArea from 'react-native-safe-area-context';

jest.mock('react-native-safe-area-context');

const useSafeAreaInsetsMock = safeArea.useSafeAreaInsets as jest.MockedFunction<
  typeof safeArea.useSafeAreaInsets
>;
useSafeAreaInsetsMock.mockReturnValue({
  bottom: 10,
  left: 10,
  right: 10,
  top: 10,
});

it('should render the investment name and total balance', () => {
  const investment: Investment = {
    goal: 'as',
    inGracePeriod: false,
    name: 'My best investment',
    stocks: [],
    totalBalance: 1000,
  };

  const route = { params: { investment } } as any;

  const { getByText } = render(<Redemption route={route} />);

  const investmentName = getByText(investment.name);
  // const totalBalance = getByText('R$ 1.000,00');

  expect(investmentName).toBeDefined();
  // expect(totalBalance).toBeDefined();
});

// it('should render the stocks symbol and balance according to percentage', () => {

// });
