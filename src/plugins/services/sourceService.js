import axios from "@/plugins/axios";

export const getSources = () => axios.get("/sources");
