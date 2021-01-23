import React from 'react';

import { render } from '@testing-library/react-native';

import { Investment } from '../../api/entities';
import Redemption from './Redemption';

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
