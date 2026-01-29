import axios from "@/plugins/axios";
import expressApi from "@/plugins/expressApi";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

export const getUserId = () => {
  return Cookies.get("user_id") || "default_user";
};

const getconversationsBase = (search, rating, stage) =>
  axios.get("/whatsapp", {
    params: { search: search, filters: { rating: rating, stage: stage } },
  });

const fetchConversationByDealIdBase = (id) =>
  axios.get(`/whatsapp/conversation/${id}`);

const createConversationBase = (deal_id) => {
  return axios.post("/whatsapp/conversation", {
    deal_id: deal_id,
  });
};

const getMessageConvBase = async (id, params) => {
  return await axios.get(`/whatsapp/${id}`, {
    params: params,
  });
};

const sendMessageBase = (messageData) => {
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

const sendInitMessageBase = (deal_id, conversation_id, init_message_id) => {
  return axios.post("/whatsapp/send-init", {
    deal_id: deal_id,
    conversation_id: conversation_id,
    init_message_id: init_message_id,
  });
};

const sendGreetingMessageBase = (deal_id, conversation_id) => {
  return axios.post("/whatsapp/send-greeting", {
    deal_id: deal_id,
    conversation_id: conversation_id,
  });
};

const getInitMessagesBase = (type = "marketing") => {
  return axios.get(`/whatsapp/init-messages/${type}`);
};

const changePinStatusBase = (id) => {
  return axios.post(`/whatsapp/conversation/pin/${id}`);
};

const getMoreConversationsBase = (offset, limit, filters, search) => {
  return axios.get("/whatsapp/conversations/more", {
    params: {
      offset: offset,
      limit: limit,
      filters: filters,
      search: search,
    },
  });
};

const webstartBase = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/start-client`,
    { userId }
  );
};

const webqrcodeBase = async () => {
  const userId = getUserId();
  return await axios.get(`/webwhatsapp/qr/${userId}`);
};

const checkstatusBase = async () => {
  const userId = getUserId();
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/is-connected/${userId}`
  );
};

const weblogoutBase = async () => {
  const userId = getUserId();
  return await expressApi.post(
    `${process.env.VUE_APP_EXPRESS_URL}/stop-client/`,
    { userId }
  );
};

const getActiveClientsBase = async () => {
  return await expressApi.get(
    `${process.env.VUE_APP_EXPRESS_URL}/active-clients`
  );
};

export const getconversations = withErrorLogging(getconversationsBase, "getconversations");
export const fetchConversationByDealId = withErrorLogging(fetchConversationByDealIdBase, "fetchConversationByDealId");
export const createConversation = withErrorLogging(createConversationBase, "createConversation");
export const getMessageConv = withErrorLogging(getMessageConvBase, "getMessageConv");
export const sendMessage = withErrorLogging(sendMessageBase, "sendMessage");
export const sendInitMessage = withErrorLogging(sendInitMessageBase, "sendInitMessage");
export const sendGreetingMessage = withErrorLogging(sendGreetingMessageBase, "sendGreetingMessage");
export const getInitMessages = withErrorLogging(getInitMessagesBase, "getInitMessages");
export const changePinStatus = withErrorLogging(changePinStatusBase, "changePinStatus");
export const getMoreConversations = withErrorLogging(getMoreConversationsBase, "getMoreConversations");
export const webstart = withErrorLogging(webstartBase, "webstart");
export const webqrcode = withErrorLogging(webqrcodeBase, "webqrcode");
export const checkstatus = withErrorLogging(checkstatusBase, "checkstatus");
export const weblogout = withErrorLogging(weblogoutBase, "weblogout");
export const getActiveClients = withErrorLogging(getActiveClientsBase, "getActiveClients");
