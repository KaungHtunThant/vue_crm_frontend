import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getSources = () => axios.get("/sources");

export const getSources = withErrorLogging(
  _getSources,
  "sourceService/getSources"
);
