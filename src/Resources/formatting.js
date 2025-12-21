import { currenciesObj } from "./currenciesObj";

const DEFAULT_DECIMALS = 2;

export function getCurrencyDecimalDigits(currencyCode) {
  if (!currencyCode || typeof currencyCode !== "string") return DEFAULT_DECIMALS;
  const meta = currenciesObj?.[currencyCode];
  const digits = meta?.decimal_digits;
  return Number.isFinite(digits) ? digits : DEFAULT_DECIMALS;
}

export function getCurrencySymbol(currencyCode) {
  if (!currencyCode || typeof currencyCode !== "string") return "";
  const meta = currenciesObj?.[currencyCode];
  return meta?.symbol_native || meta?.symbol || currencyCode;
}

export function formatNumber(value, decimals = DEFAULT_DECIMALS) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  const safeDecimals = Number.isFinite(decimals) ? decimals : DEFAULT_DECIMALS;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  }).format(num);
}

/**
 * Like formatMoney(), but returns parts so the prefix can be styled separately.
 */
export function formatMoneyParts(value, currencyPrefixOrCode = "", currencyCode) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return { prefix: "", number: "" };
  }

  let resolvedCurrencyCode = currencyCode;
  let prefix = currencyPrefixOrCode || "";

  if (!resolvedCurrencyCode && typeof currencyPrefixOrCode === "string") {
    if (currenciesObj?.[currencyPrefixOrCode]) {
      resolvedCurrencyCode = currencyPrefixOrCode;
      prefix = getCurrencySymbol(currencyPrefixOrCode);
    }
  }

  const decimals = getCurrencyDecimalDigits(resolvedCurrencyCode);
  const number = formatNumber(num, decimals);
  return { prefix, number };
}

/**
 * Formats a numeric value using comma thousands separators.
 *
 * - If `currencyCode` is provided, its `decimal_digits` is used.
 * - If `currencyPrefixOrCode` looks like a currency code (e.g. "UGX"), it will be used as the currency code.
 * - If a prefix is provided (e.g. "$"), it will be prepended as-is.
 */
export function formatMoney(value, currencyPrefixOrCode = "", currencyCode) {
  const { prefix, number } = formatMoneyParts(
    value,
    currencyPrefixOrCode,
    currencyCode
  );
  if (!number) return "";
  return `${prefix}${number}`;
}
