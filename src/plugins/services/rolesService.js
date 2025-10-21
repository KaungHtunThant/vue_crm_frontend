import axios from "@/plugins/axios";
// Get All Roles
export const getRoles = () => axios.get("/roles");
