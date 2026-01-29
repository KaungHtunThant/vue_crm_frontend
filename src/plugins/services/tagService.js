import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getTrashTagsFn = async () => {
  return await axios.get("/tags/trash");
};
export const getTrashTags = withErrorLogging(getTrashTagsFn, "tagService.getTrashTags");
