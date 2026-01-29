import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

const _getTranslations = (locale) => {
  const token = Cookies.get("authToken");
  return axios.get(`/translations/all?locale=${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const _saveUserLanguage = async (locale) => {
  const token = Cookies.get("authToken");
  return await axios.patch(`/translations/locale/${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTranslations = withErrorLogging(
  _getTranslations,
  "languageService/getTranslations"
);
export const saveUserLanguage = withErrorLogging(
  _saveUserLanguage,
  "languageService/saveUserLanguage"
);
