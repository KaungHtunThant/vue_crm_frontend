import axios from "@/plugins/axios";
import Cookies from "js-cookie";

// Get All Translations
export const getTranslations = (locale) => {
  const token = Cookies.get("authToken");
  return axios.get(`/translations/all?locale=${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
