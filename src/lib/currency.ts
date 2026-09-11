const DEFAULT_CURRENCY = 'USD'

function normalizeCurrency(currency?: string) {
  const normalized = currency?.trim().toUpperCase()
  return normalized && /^[A-Z]{3}$/.test(normalized)
    ? normalized
    : DEFAULT_CURRENCY
}

export function formatCurrency(
  value?: number | null,
  currency?: string,
  options?: Intl.NumberFormatOptions
) {
  if (value == null) return '—'

  const formatOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: normalizeCurrency(currency),
    maximumFractionDigits: 0,
    ...options,
  }

  try {
    return new Intl.NumberFormat(undefined, formatOptions).format(value)
  } catch {
    return new Intl.NumberFormat(undefined, {
      ...formatOptions,
      currency: DEFAULT_CURRENCY,
    }).format(value)
  }
}
