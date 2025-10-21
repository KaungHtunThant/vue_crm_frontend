import axios from "@/plugins/axios";

// Get Conversations
export const getconversations = (search, rating, stage) =>
  axios.get("/whatsapp", {
    params: { search: search, filters: { rating: rating, stage: stage } },
  });

// Get Conversation by contact id
export const fetchConversationByDealId = (id) =>
  axios.get(`/whatsapp/conversation/${id}`);

// Create Conversation by contact id
export const createConversation = (deal_id) => {
  return axios.post("/whatsapp/conversation", {
    deal_id: deal_id,
  });
};

// Get message by Conversation id
export const getMessageConv = async (id, params) => {
  return await axios.get(`/whatsapp/${id}`, {
    params: params,
  });
};

// send message
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
