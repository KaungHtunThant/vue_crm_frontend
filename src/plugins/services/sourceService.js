import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getSourcesFn = () => axios.get("/sources");
export const getSources = withErrorLogging(getSourcesFn, "sourceService.getSources");
