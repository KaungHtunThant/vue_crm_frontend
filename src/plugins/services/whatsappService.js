import axios from "@/plugins/axios";
import expressApi from "@/plugins/expressApi";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

export const getUserId = () => {
  return Cookies.get("user_id") || "default_user";
};

const _getconversations = (search, rating, stage) =>
  axios.get("/whatsapp", {
    params: { search: search, filters: { rating: rating, stage: stage } },
  });

const _fetchConversationByDealId = (id) =>
  axios.get(`/whatsapp/conversation/${id}`);

const _createConversation = (deal_id) => {
  return axios.post("/whatsapp/conversation", {
    deal_id: deal_id,
  });
};

const _getMessageConv = async (id, params) => {
  return await axios.get(`/whatsapp/${id}`, {
    params: params,
  });
};

const _sendMessage = (messageData) => {
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

const _sendInitMessage = (deal_id, conversation_id, init_message_id) => {
  return axios.post("/whatsapp/send-init", {
    deal_id: deal_id,
    conversation_id: conversation_id,
    init_message_id: init_message_id,
  });
};

const _sendGreetingMessage = (deal_id, conversation_id) => {
  return axios.post("/whatsapp/send-greeting", {
    deal_id: deal_id,
    conversation_id: conversation_id,
  });
};

const _getInitMessages = (type = "marketing") => {
  return axios.get(`/whatsapp/init-messages/${type}`);
};

const _changePinStatus = (id) => {
  return axios.post(`/whatsapp/conversation/pin/${id}`);
};

const _getMoreConversations = (offset, limit, filters, search) => {
  return axios.get("/whatsapp/conversations/more", {
    params: {
      offset: offset,
      limit: limit,
      filters: filters,
      search: search,
    },
  });
};

const _webstart = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/start-client`,
    { userId }
  );
};

const _webqrcode = async () => {
  const userId = getUserId();
  return await axios.get(`/webwhatsapp/qr/${userId}`);
};

const _checkstatus = async () => {
  const userId = getUserId();
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/is-connected/${userId}`
  );
};

const _weblogout = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/stop-client/`,
    { userId }
  );
};

const _getActiveClients = async () => {
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/active-clients`
  );
};

export const getconversations = withErrorLogging(
  _getconversations,
  "whatsappService/getconversations"
);
export const fetchConversationByDealId = withErrorLogging(
  _fetchConversationByDealId,
  "whatsappService/fetchConversationByDealId"
);
export const createConversation = withErrorLogging(
  _createConversation,
  "whatsappService/createConversation"
);
export const getMessageConv = withErrorLogging(
  _getMessageConv,
  "whatsappService/getMessageConv"
);
export const sendMessage = withErrorLogging(
  _sendMessage,
  "whatsappService/sendMessage"
);
export const sendInitMessage = withErrorLogging(
  _sendInitMessage,
  "whatsappService/sendInitMessage"
);
export const sendGreetingMessage = withErrorLogging(
  _sendGreetingMessage,
  "whatsappService/sendGreetingMessage"
);
export const getInitMessages = withErrorLogging(
  _getInitMessages,
  "whatsappService/getInitMessages"
);
export const changePinStatus = withErrorLogging(
  _changePinStatus,
  "whatsappService/changePinStatus"
);
export const getMoreConversations = withErrorLogging(
  _getMoreConversations,
  "whatsappService/getMoreConversations"
);
export const webstart = withErrorLogging(_webstart, "whatsappService/webstart");
export const webqrcode = withErrorLogging(
  _webqrcode,
  "whatsappService/webqrcode"
);
export const checkstatus = withErrorLogging(
  _checkstatus,
  "whatsappService/checkstatus"
);
export const weblogout = withErrorLogging(
  _weblogout,
  "whatsappService/weblogout"
);
export const getActiveClients = withErrorLogging(
  _getActiveClients,
  "whatsappService/getActiveClients"
);
