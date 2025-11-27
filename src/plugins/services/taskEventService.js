import axios from "@/plugins/axios";
export const getTaskEvents = () => axios.get("/taskevents");
