import React from 'react';
import { Text, TextProps } from 'react-native';

import formatCurrency from '../../utils/formatCurrency/formatCurrency';

type Props = TextProps & {
  children: number;
  withSymbol?: boolean;
};

export default function CurrencyText({
  children,
  withSymbol = false,
  ...rest
}: Props) {
  return (
    <Text accessibilityRole="text" {...rest}>
      {formatCurrency(children, { withSymbol })}
    </Text>
  );
}
