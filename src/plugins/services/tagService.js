import axios from "@/plugins/axios";
export const getTrashTags = async () => {
  return await axios.get("/tags/trash");
};
