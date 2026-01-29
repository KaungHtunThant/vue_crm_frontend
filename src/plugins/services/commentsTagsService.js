import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getcommentstagsFn = () => axios.get("/commentstags");
export const getcommentstags = withErrorLogging(
  getcommentstagsFn,
  "commentsTagsService.getcommentstags"
);
