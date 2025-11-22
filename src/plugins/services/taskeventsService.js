import axios from "@/plugins/axios";
import Cookies from "js-cookie";

export const getTaskEvents = async () => {
  const $token = Cookies.get("authToken");
  return await axios.get(`/taskevents/`, {
    headers: { Authorization: `Bearer ${$token}` },
  });
};
