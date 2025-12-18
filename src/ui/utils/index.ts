import countries from "i18n-iso-countries";
import ruLocale from "i18n-iso-countries/langs/ru.json";

countries.registerLocale(ruLocale);

export const countryNames: Record<string, string> = countries.getNames("ru");

export function getCountryName(code: string) {
   const countryName = countryNames[code] ?? code;
    return countryName === "Казахстан" ? "Республика Казахстан" : countryName
}



export function getBirthDateFromIIN(iin: string): Date | null {
  if (!/^\d{12}$/.test(iin)) {
    return null;
  }

  const yy = parseInt(iin.slice(0, 2), 10);
  const mm = parseInt(iin.slice(2, 4), 10);
  const dd = parseInt(iin.slice(4, 6), 10);
  const centuryCode = parseInt(iin[6], 10);

  let century: number;

  if (centuryCode === 1 || centuryCode === 2) century = 1800;
  else if (centuryCode === 3 || centuryCode === 4) century = 1900;
  else if (centuryCode === 5 || centuryCode === 6 || centuryCode === 0) century = 2000;
  else return null;

  const year = century + yy;

  const date = new Date(year, mm - 1, dd);

  // проверка корректности даты
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  ) {
    return null;
  }

  return date;
}


export function getBirthDateStringFromIIN(iin: string): string {
  const date = getBirthDateFromIIN(iin);
  if (!date) return "";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
}
