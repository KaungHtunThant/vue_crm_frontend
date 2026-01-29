import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getRatingsFn = async () => {
  return await axios.get("/ratings");
};
export const getRatings = withErrorLogging(getRatingsFn, "ratingService.getRatings");

const getAllRatingsFn = async () => {
  return await axios.get("/ratings/all");
};
export const getAllRatings = withErrorLogging(getAllRatingsFn, "ratingService.getAllRatings");
