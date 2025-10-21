import axios from "@/plugins/axios";
import Cookies from "js-cookie";

import expressApi from "@/plugins/expressApi";

export const getUserId = () => {
  return Cookies.get("user_id") || "default_user";
};

// Web client start
export const webstart = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/start-client`,
    { userId }
  );
};

// Web client logout
export const weblogout = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/stop-client/`,
    { userId }
  );
};

// Web client check status
export const checkstatus = async () => {
  const userId = getUserId();
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/is-connected/${userId}`
  );
};

export const webqrcode = async () => {
  const userId = getUserId();
  return await axios.get(`/webwhatsapp/qr/${userId}`);
  //return await axios.get(`http://127.0.0.1:3000/get-qr/${userId}`);
};

// Add this function to get active clients (for debugging)
export const getActiveClients = async () => {
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/active-clients`
  );
};
