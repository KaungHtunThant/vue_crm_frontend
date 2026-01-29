import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getTaskEventsFn = () => axios.get("/taskevents");
export const getTaskEvents = withErrorLogging(getTaskEventsFn, "taskEventService.getTaskEvents");
