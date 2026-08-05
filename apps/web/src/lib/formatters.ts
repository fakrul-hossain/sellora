import { platformConfig } from '@/config/platform.config';

export function formatCurrency(amount: number, overrideSymbol?: string): string {
  const symbol = overrideSymbol || platformConfig.currency.symbol;
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);

  return platformConfig.currency.position === 'prefix'
    ? `${symbol} ${formattedNumber}`
    : `${formattedNumber} ${symbol}`;
}

export function formatNumber(value: number, locale: 'en' | 'bn' = 'en'): string {
  if (locale === 'bn') {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return value
      .toString()
      .split('')
      .map((digit) => banglaDigits[parseInt(digit, 10)] || digit)
      .join('');
  }
  return new Intl.NumberFormat('en-US').format(value);
}
