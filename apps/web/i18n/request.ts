import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const locales = ["es", "en"] as const;
const defaultLocale = "es";

function getPreferredLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang?.split("-")[0] ?? "", q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    if (locales.includes(lang as (typeof locales)[number])) {
      return lang;
    }
  }

  return defaultLocale;
}

export default getRequestConfig(async () => {
  const reqHeaders = await headers();
  const acceptLanguage = reqHeaders.get("accept-language");
  const locale = getPreferredLocale(acceptLanguage);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
