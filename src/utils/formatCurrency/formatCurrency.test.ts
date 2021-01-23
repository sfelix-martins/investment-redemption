import formatCurrency from './formatCurrency';

describe('formatCurrency', () => {
  it.each([
    [1, '1,00'],
    [1000, '1.000,00'],
    [1000000, '1.000.000,00'],
  ])(
    'should format the numeric value %d to formatted BLR currency value "%s" without symbol',
    (numeric: number, formatted: string) => {
      expect(formatCurrency(numeric, { withSymbol: false })).toBe(formatted);
    },
  );

  it.each([
    [1, 'R$ 1,00'],
    [1000, 'R$ 1.000,00'],
    [1000000, 'R$ 1.000.000,00'],
  ])(
    'should format the numeric value %d to formatted BLR currency value "%s" with symbol',
    (numeric: number, formatted: string) => {
      expect(formatCurrency(numeric, { withSymbol: true })).toBe(formatted);
    },
  );
});
