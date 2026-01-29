import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/plugins/errorLogger";

const getTranslationsFn = (locale) => {
  const token = Cookies.get("authToken");
  return axios.get(`/translations/all?locale=${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getTranslations = withErrorLogging(getTranslationsFn, "languageService.getTranslations");

const saveUserLanguageFn = async (locale) => {
  const token = Cookies.get("authToken");
  return await axios.patch(`/translations/locale/${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const saveUserLanguage = withErrorLogging(saveUserLanguageFn, "languageService.saveUserLanguage");
