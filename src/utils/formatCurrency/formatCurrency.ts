interface Options {
  withSymbol?: boolean;
}

export default function formatCurrency(
  value: number,
  { withSymbol = false }: Options,
): string {
  const formattedWithoutSymbol = value
    .toFixed(2)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  if (withSymbol) {
    return `R$ ${formattedWithoutSymbol}`;
  }

  return formattedWithoutSymbol;
}
