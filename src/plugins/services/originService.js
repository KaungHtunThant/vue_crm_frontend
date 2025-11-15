import axios from "@/plugins/axios";

export const getIndex = async () => {
  return await axios.get("/origins");
};

export const getAll = async () => {
  return await axios.get("/origins/all");
};

export const getById = async (id) => {
  return await axios.get(`/origins/${id}`);
};

export const create = async (data) => {
  return await axios.post("/origins", data);
};

export const update = async (id, data) => {
  return await axios.put(`/origins/${id}`, data);
};

export const remove = async (id) => {
  return await axios.delete(`/origins/${id}`);
};
