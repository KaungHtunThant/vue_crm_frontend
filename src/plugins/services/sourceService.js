import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getSourcesBase = () => axios.get("/sources");

export const getSources = withErrorLogging(getSourcesBase, "getSources");
