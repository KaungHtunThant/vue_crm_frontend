import axios from "@/plugins/axios";

export const index = () => {
  return axios.get("/hospitals");
};

export const all = () => {
  return axios.get("/hospitals/all");
};

export const show = (hospitalId) => {
  return axios.get(`/hospitals/${hospitalId}`);
};

export const create = (formData) => {
  return axios.post("/hospitals", formData);
};

export const update = (hospitalId, formData) => {
  return axios.put(`/hospitals/${hospitalId}`, formData);
};

export const destroy = (hospitalId) => {
  return axios.delete(`/hospitals/${hospitalId}`);
};
