import axios from "@/plugins/axios";

export const createComment = (formData) => {
  return axios.post("/comments", formData);
};

export const updateComments = async (id, formData) => {
  return await axios.patch(`/comments/${id}`, formData);
};

export const toggleCommentPin = async (id) => {
  return await axios.post(`/comments/${id}/toggle-pin`);
};
