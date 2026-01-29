import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getTaskEventsBase = () => axios.get("/taskevents");

export const getTaskEvents = withErrorLogging(getTaskEventsBase, "getTaskEvents");
