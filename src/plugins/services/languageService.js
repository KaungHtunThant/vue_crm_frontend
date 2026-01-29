import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

const getTranslationsBase = (locale) => {
  const token = Cookies.get("authToken");
  return axios.get(`/translations/all?locale=${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const saveUserLanguageBase = async (locale) => {
  const token = Cookies.get("authToken");
  return await axios.patch(`/translations/locale/${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTranslations = withErrorLogging(getTranslationsBase, "getTranslations");
export const saveUserLanguage = withErrorLogging(saveUserLanguageBase, "saveUserLanguage");
