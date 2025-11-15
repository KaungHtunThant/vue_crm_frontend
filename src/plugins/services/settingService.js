import axios from "@/plugins/axios";

export const generateOTP = () => axios.get("/settings/otp/generate");
