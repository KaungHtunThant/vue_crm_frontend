import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getcommentstags = () => axios.get("/commentstags");

export const getcommentstags = withErrorLogging(
  _getcommentstags,
  "commentsTagsService/getcommentstags"
);
