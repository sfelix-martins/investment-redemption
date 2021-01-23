import React, { useState, useEffect } from 'react';
import { Text, TextProps } from 'react-native';

type Props = TextProps & {
  children: number;
  withSymbol?: boolean;
};

const withSymbolOptions = {
  style: 'currency',
  currency: 'BRL',
  currencyDisplay: 'symbol',
};

const withoutSymbolOptions = {
  minimumFractionDigits: 2,
};

export default function CurrencyText({
  children,
  withSymbol = false,
  ...rest
}: Props) {
  const options = withSymbol ? withSymbolOptions : withoutSymbolOptions;

  return (
    <Text accessibilityRole="text" {...rest}>
      {children.toLocaleString('pt-BR', options)}
    </Text>
  );
}
