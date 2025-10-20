import axios from "@/plugins/axios";

export const getAllPackages = async () => {
  return await axios.get("/packages");
};
