import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getRatings = async () => {
  return await axios.get("/ratings");
};

const _getAllRatings = async () => {
  return await axios.get("/ratings/all");
};

export const getRatings = withErrorLogging(_getRatings, "ratingService/getRatings");
export const getAllRatings = withErrorLogging(_getAllRatings, "ratingService/getAllRatings");
