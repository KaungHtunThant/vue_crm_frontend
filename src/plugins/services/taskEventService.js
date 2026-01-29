import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getTaskEvents = () => axios.get("/taskevents");

export const getTaskEvents = withErrorLogging(
  _getTaskEvents,
  "taskEventService/getTaskEvents"
);
