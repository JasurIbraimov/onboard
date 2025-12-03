import countries from "i18n-iso-countries";
import ruLocale from "i18n-iso-countries/langs/ru.json";

countries.registerLocale(ruLocale);

export const countryNames: Record<string, string> = countries.getNames("ru");

export function getCountryName(code: string) {
    return countryNames[code] ?? code;
}



