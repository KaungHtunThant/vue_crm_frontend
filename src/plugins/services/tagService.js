import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getTrashTagsBase = async () => {
  return await axios.get("/tags/trash");
};

export const getTrashTags = withErrorLogging(getTrashTagsBase, "getTrashTags");
