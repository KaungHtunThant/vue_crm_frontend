import axios from "@/plugins/axios";
import Cookies from "js-cookie";

export const getcommentstags = async () => {
  const $token = Cookies.get("authToken");
  return await axios.get(`/commentstags/`, {
    headers: { Authorization: `Bearer ${$token}` },
  });
};
