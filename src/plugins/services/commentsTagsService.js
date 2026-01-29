import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getcommentstagsBase = () => axios.get("/commentstags");

export const getcommentstags = withErrorLogging(
  getcommentstagsBase,
  "getcommentstags"
);
