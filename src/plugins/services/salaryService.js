import axios from "@/plugins/axios";

export const getSalary = () => axios.get("/salary");
export const createSalary = (data) => axios.post("/salary", data);
