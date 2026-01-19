import axios from "@/plugins/axios";

export const index = () => {
  return axios.get("/import-labels");
};

export const all = () => {
  return axios.get("/import-labels/all");
};

export const show = (import_label_id) => {
  return axios.get(`/import-labels/${import_label_id}`);
};

export const create = (data) => {
  return axios.post("/import-labels", data);
};

export const update = (import_label_id, data) => {
  return axios.put(`/import-labels/${import_label_id}`, data);
};

export const destroy = (import_label_id) => {
  return axios.delete(`/import-labels/${import_label_id}`);
};
