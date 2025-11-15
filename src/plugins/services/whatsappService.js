import axios from "@/plugins/axios";
import expressApi from "@/plugins/expressApi";
import Cookies from "js-cookie";

export const getUserId = () => {
  return Cookies.get("user_id") || "default_user";
};
export const getconversations = (search, rating, stage) =>
  axios.get("/whatsapp", {
    params: { search: search, filters: { rating: rating, stage: stage } },
  });

export const fetchConversationByDealId = (id) =>
  axios.get(`/whatsapp/conversation/${id}`);

export const createConversation = (deal_id) => {
  return axios.post("/whatsapp/conversation", {
    deal_id: deal_id,
  });
};

export const getMessageConv = async (id, params) => {
  return await axios.get(`/whatsapp/${id}`, {
    params: params,
  });
};

export const sendMessage = (messageData) => {
  const formData = new FormData();
  if (messageData.text_body) {
    formData.append("text_body", messageData.text_body);
  }
  if (messageData.file) {
    formData.append("file", messageData.file);
  }
  if (messageData.conversation_id) {
    formData.append("conversation_id", messageData.conversation_id);
  }

  return axios.post("/whatsapp/send", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const sendInitMessage = (deal_id, conversation_id, init_message_id) => {
  return axios.post("/whatsapp/send-init", {
    deal_id: deal_id,
    conversation_id: conversation_id,
    init_message_id: init_message_id,
  });
};

export const sendGreetingMessage = (deal_id, conversation_id) => {
  return axios.post("/whatsapp/send-greeting", {
    deal_id: deal_id,
    conversation_id: conversation_id,
  });
};

export const getInitMessages = (type = "marketing") => {
  return axios.get(`/whatsapp/init-messages/${type}`);
};

export const changePinStatus = (id) => {
  return axios.post(`/whatsapp/conversation/pin/${id}`);
};

export const getMoreConversations = (offset, limit, filters, search) => {
  return axios.get("/whatsapp/conversations/more", {
    params: {
      offset: offset,
      limit: limit,
      filters: filters,
      search: search,
    },
  });
};

export const webstart = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/start-client`,
    { userId }
  );
};

export const webqrcode = async () => {
  const userId = getUserId();
  return await axios.get(`/webwhatsapp/qr/${userId}`);
};

export const checkstatus = async () => {
  const userId = getUserId();
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/is-connected/${userId}`
  );
};

export const weblogout = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/stop-client/`,
    { userId }
  );
};

export const getActiveClients = async () => {
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/active-clients`
  );
};
