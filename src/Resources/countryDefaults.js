import ct from "countries-and-timezones";
import countryToCurrency from "country-to-currency";
import isoCountries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

import { countries as onboardingCountries } from "./listOfCountries";
import { timezonesList } from "./timezones";

isoCountries.registerLocale(enLocale);

const countryCodeOverrides = {
  "Antigua & Deps": "AG",
  "Bosnia Herzegovina": "BA",
  Brunei: "BN",
  Burkina: "BF",
  "Cape Verde": "CV",
  "Central African Rep": "CF",
  "Congo {Democratic Rep}": "CD",
  "East Timor": "TL",
  "Ireland {Republic}": "IE",
  "Ivory Coast": "CI",
  "Korea North": "KP",
  "Korea South": "KR",
  Kosovo: "XK",
  Laos: "LA",
  Macedonia: "MK",
  Micronesia: "FM",
  Moldova: "MD",
  "Myanmar, {Burma}": "MM",
  "Russian Federation": "RU",
  "St Kitts & Nevis": "KN",
  "St Lucia": "LC",
  "Saint Vincent & the Grenadines": "VC",
  "Sao Tome & Principe": "ST",
  Swaziland: "SZ",
  Tanzania: "TZ",
  "Trinidad & Tobago": "TT",
  "Vatican City": "VA",
  Venezuela: "VE",
  Vietnam: "VN",
};

const countryTimezoneOverrides = {
  Argentina: "America/Argentina/Buenos_Aires",
  Australia: "Australia/Sydney",
  Bahamas: "US/Eastern",
  Brazil: "America/Sao_Paulo",
  Canada: "America/Toronto",
  "Cape Verde": "Atlantic/Cape_Verde",
  Chile: "America/Santiago",
  China: "Asia/Shanghai",
  Cyprus: "Asia/Nicosia",
  Ecuador: "America/Guayaquil",
  Kiribati: "Pacific/Tarawa",
  Malaysia: "Asia/Kuala_Lumpur",
  Micronesia: "Pacific/Pohnpei",
  Mexico: "America/Mexico_City",
  Oman: "Asia/Muscat",
  Portugal: "Europe/Lisbon",
  "Russian Federation": "Europe/Moscow",
  Seychelles: "Indian/Mahe",
  Spain: "Europe/Madrid",
  "Trinidad & Tobago": "America/Port_of_Spain",
  Ukraine: "Europe/Kyiv",
  "United States": "US/Eastern",
  Uzbekistan: "Asia/Tashkent",
  "Vatican City": "Europe/Rome",
  Vietnam: "Asia/Ho_Chi_Minh",
};

const normalizeCountryName = (value = "") =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[{}(),.'’]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const normalizedCountryCodeMap = Object.entries(
  isoCountries.getNames("en", { select: "all" }),
).reduce((acc, [code, names]) => {
  const candidates = Array.isArray(names) ? names : [names];

  candidates.forEach((name) => {
    acc[normalizeCountryName(name)] = code;
  });

  return acc;
}, {});

Object.entries(countryCodeOverrides).forEach(([countryName, code]) => {
  normalizedCountryCodeMap[normalizeCountryName(countryName)] = code;
});

const resolveCountryCode = (countryName) => {
  if (!countryName) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(countryCodeOverrides, countryName)) {
    return countryCodeOverrides[countryName];
  }

  return (
    isoCountries.getAlpha2Code(countryName, "en") ||
    normalizedCountryCodeMap[normalizeCountryName(countryName)] ||
    null
  );
};

const getCountryDefaults = (countryName) => {
  const countryCode = resolveCountryCode(countryName);

  if (!countryCode) {
    return {
      countryCode: null,
      timezone: null,
      currency: null,
    };
  }

  const timezoneData = ct.getCountry(countryCode);
  const timezone =
    countryTimezoneOverrides[countryName] || timezoneData?.timezones?.[0] || null;
  const currency = countryToCurrency[countryCode] || null;

  return {
    countryCode,
    timezone,
    currency,
  };
};

const onboardingTimezoneOptions = Array.from(
  new Set([
    ...timezonesList,
    ...onboardingCountries
      .map((countryName) => getCountryDefaults(countryName).timezone)
      .filter(Boolean),
  ]),
).sort((a, b) => a.localeCompare(b));

export { getCountryDefaults, onboardingTimezoneOptions, resolveCountryCode };
