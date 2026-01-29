import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getTrashTags = async () => {
  return await axios.get("/tags/trash");
};

export const getTrashTags = withErrorLogging(_getTrashTags, "tagService/getTrashTags");
