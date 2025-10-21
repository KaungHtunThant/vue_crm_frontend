import axios from "@/plugins/axios";

export const getAllPackages = async () => {
  return await axios.get("/packages");
};
export const getAllPackageCategories = async () => {
  return await axios.get("/package-categories/all");
};
