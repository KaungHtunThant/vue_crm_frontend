import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _createComment = (formData) => {
  return axios.post("/comments", formData);
};

const _updateComments = async (id, formData) => {
  return await axios.patch(`/comments/${id}`, formData);
};

const _toggleCommentPin = async (id) => {
  return await axios.post(`/comments/${id}/toggle-pin`);
};

export const createComment = withErrorLogging(
  _createComment,
  "commentService/createComment"
);
export const updateComments = withErrorLogging(
  _updateComments,
  "commentService/updateComments"
);
export const toggleCommentPin = withErrorLogging(
  _toggleCommentPin,
  "commentService/toggleCommentPin"
);
