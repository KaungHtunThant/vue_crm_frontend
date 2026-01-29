import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const createCommentFn = (formData) => {
  return axios.post("/comments", formData);
};
export const createComment = withErrorLogging(createCommentFn, "commentService.createComment");

const updateCommentsFn = async (id, formData) => {
  return await axios.patch(`/comments/${id}`, formData);
};
export const updateComments = withErrorLogging(updateCommentsFn, "commentService.updateComments");

const toggleCommentPinFn = async (id) => {
  return await axios.post(`/comments/${id}/toggle-pin`);
};
export const toggleCommentPin = withErrorLogging(toggleCommentPinFn, "commentService.toggleCommentPin");
