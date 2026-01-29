import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getAllPackages = async () => {
  return await axios.get("/packages/all");
};

const _getAllPackageCategories = async () => {
  return await axios.get("/package-categories/all");
};

export const getAllPackages = withErrorLogging(
  _getAllPackages,
  "packageService/getAllPackages"
);
export const getAllPackageCategories = withErrorLogging(
  _getAllPackageCategories,
  "packageService/getAllPackageCategories"
);
