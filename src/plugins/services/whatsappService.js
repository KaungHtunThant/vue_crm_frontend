import axios from "@/plugins/axios";
import expressApi from "@/plugins/expressApi";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/plugins/errorLogger";

const getUserIdFn = () => {
  return Cookies.get("user_id") || "default_user";
};
export const getUserId = withErrorLogging(getUserIdFn, "whatsappService.getUserId");

const getconversationsFn = (search, rating, stage) =>
  axios.get("/whatsapp", {
    params: { search: search, filters: { rating: rating, stage: stage } },
  });
export const getconversations = withErrorLogging(getconversationsFn, "whatsappService.getconversations");

const fetchConversationByDealIdFn = (id) =>
  axios.get(`/whatsapp/conversation/${id}`);
export const fetchConversationByDealId = withErrorLogging(fetchConversationByDealIdFn, "whatsappService.fetchConversationByDealId");

const createConversationFn = (deal_id) => {
  return axios.post("/whatsapp/conversation", {
    deal_id: deal_id,
  });
};
export const createConversation = withErrorLogging(createConversationFn, "whatsappService.createConversation");

const getMessageConvFn = async (id, params) => {
  return await axios.get(`/whatsapp/${id}`, {
    params: params,
  });
};
export const getMessageConv = withErrorLogging(getMessageConvFn, "whatsappService.getMessageConv");

const sendMessageFn = (messageData) => {
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
export const sendMessage = withErrorLogging(sendMessageFn, "whatsappService.sendMessage");

const sendInitMessageFn = (deal_id, conversation_id, init_message_id) => {
  return axios.post("/whatsapp/send-init", {
    deal_id: deal_id,
    conversation_id: conversation_id,
    init_message_id: init_message_id,
  });
};
export const sendInitMessage = withErrorLogging(sendInitMessageFn, "whatsappService.sendInitMessage");

const sendGreetingMessageFn = (deal_id, conversation_id) => {
  return axios.post("/whatsapp/send-greeting", {
    deal_id: deal_id,
    conversation_id: conversation_id,
  });
};
export const sendGreetingMessage = withErrorLogging(sendGreetingMessageFn, "whatsappService.sendGreetingMessage");

const getInitMessagesFn = (type = "marketing") => {
  return axios.get(`/whatsapp/init-messages/${type}`);
};
export const getInitMessages = withErrorLogging(getInitMessagesFn, "whatsappService.getInitMessages");

const changePinStatusFn = (id) => {
  return axios.post(`/whatsapp/conversation/pin/${id}`);
};
export const changePinStatus = withErrorLogging(changePinStatusFn, "whatsappService.changePinStatus");

const getMoreConversationsFn = (offset, limit, filters, search) => {
  return axios.get("/whatsapp/conversations/more", {
    params: {
      offset: offset,
      limit: limit,
      filters: filters,
      search: search,
    },
  });
};
export const getMoreConversations = withErrorLogging(getMoreConversationsFn, "whatsappService.getMoreConversations");

const webstartFn = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/start-client`,
    { userId }
  );
};
export const webstart = withErrorLogging(webstartFn, "whatsappService.webstart");

const webqrcodeFn = async () => {
  const userId = getUserId();
  return await axios.get(`/webwhatsapp/qr/${userId}`);
};
export const webqrcode = withErrorLogging(webqrcodeFn, "whatsappService.webqrcode");

const checkstatusFn = async () => {
  const userId = getUserId();
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/is-connected/${userId}`
  );
};
export const checkstatus = withErrorLogging(checkstatusFn, "whatsappService.checkstatus");

const weblogoutFn = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/stop-client/`,
    { userId }
  );
};
export const weblogout = withErrorLogging(weblogoutFn, "whatsappService.weblogout");

const getActiveClientsFn = async () => {
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/active-clients`
  );
};
export const getActiveClients = withErrorLogging(getActiveClientsFn, "whatsappService.getActiveClients");
