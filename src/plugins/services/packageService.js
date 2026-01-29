import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getAllPackagesBase = async () => {
  return await axios.get("/packages/all");
};

const getAllPackageCategoriesBase = async () => {
  return await axios.get("/package-categories/all");
};

export const getAllPackages = withErrorLogging(getAllPackagesBase, "getAllPackages");
export const getAllPackageCategories = withErrorLogging(getAllPackageCategoriesBase, "getAllPackageCategories");
