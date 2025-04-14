import { createI18n } from "vue-i18n";
import { getTranslations } from "@/plugins/services/authService";
import Cookies from "js-cookie";
import { saveUserLanguage } from "@/plugins/services/authService";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("locale") || "en",
  fallbackLocale: "en",
  messages: {
    en: {},
    ar: {},
  },
  globalInjection: true,
});

async function loadTranslationsFromAPI(locale) {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      console.log("Not authenticated.");
      return null;
    }
    const response = await getTranslations(locale);

    if (response.data && response.data.translations) {
      const translations = response.data.translations;

      localStorage.setItem(
        `translations_${locale}`,
        JSON.stringify(translations)
      );

      i18n.global.setLocaleMessage(locale, translations);
      return translations;
    }
  } catch (error) {
    console.error("Error loading translations:", error);
    return null;
  }
}

export async function changeLanguage(locale) {
  try {
    const storedTranslations = localStorage.getItem(`translations_${locale}`);
    if (storedTranslations) {
      i18n.global.setLocaleMessage(locale, JSON.parse(storedTranslations));
    } else {
      await loadTranslationsFromAPI(locale);
    }

    i18n.global.locale.value = locale;
    localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
    await saveUserLanguage(locale).then(() => {
      window.location.reload();
    });
  } catch (error) {
    console.error("Error changing language:", error);
  }
}

export const initializeTranslations = loadTranslationsFromAPI;

export default i18n;
