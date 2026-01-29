import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getAllPackagesFn = async () => {
  return await axios.get("/packages/all");
};
export const getAllPackages = withErrorLogging(
  getAllPackagesFn,
  "packageService.getAllPackages"
);

const getAllPackageCategoriesFn = async () => {
  return await axios.get("/package-categories/all");
};
export const getAllPackageCategories = withErrorLogging(
  getAllPackageCategoriesFn,
  "packageService.getAllPackageCategories"
);
