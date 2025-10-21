import axios from "@/plugins/axios";
import Cookies from "js-cookie";
// login
export const login = (credentials) => {
  return axios.post("/login", credentials);
};
// logout
export const logout = () => {
  const token = Cookies.get("authToken");
  axios.post("/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getRatings = async () => {
  return await axios.get("/ratings");
};
export const getAllRatings = async () => {
  return await axios.get("/ratings/all");
};
export const updateUserRating = async (userId, ratingId) => {
  return await axios.patch(`/users/${userId}/rating`, { rating_id: ratingId });
};
