import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const createCommentBase = (formData) => {
  return axios.post("/comments", formData);
};

const updateCommentsBase = async (id, formData) => {
  return await axios.patch(`/comments/${id}`, formData);
};

const toggleCommentPinBase = async (id) => {
  return await axios.post(`/comments/${id}/toggle-pin`);
};

export const createComment = withErrorLogging(createCommentBase, "createComment");
export const updateComments = withErrorLogging(updateCommentsBase, "updateComments");
export const toggleCommentPin = withErrorLogging(toggleCommentPinBase, "toggleCommentPin");
