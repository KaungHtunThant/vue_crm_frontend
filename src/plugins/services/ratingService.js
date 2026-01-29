import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getRatingsBase = async () => {
  return await axios.get("/ratings");
};

const getAllRatingsBase = async () => {
  return await axios.get("/ratings/all");
};

export const getRatings = withErrorLogging(getRatingsBase, "getRatings");
export const getAllRatings = withErrorLogging(
  getAllRatingsBase,
  "getAllRatings"
);
