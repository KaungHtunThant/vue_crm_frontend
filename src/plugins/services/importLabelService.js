import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const indexFn = () => {
  return axios.get("/import-labels");
};
export const index = withErrorLogging(indexFn, "importLabelService.index");

const allFn = () => {
  return axios.get("/import-labels/all");
};
export const all = withErrorLogging(allFn, "importLabelService.all");

const showFn = (import_label_id) => {
  return axios.get(`/import-labels/${import_label_id}`);
};
export const show = withErrorLogging(showFn, "importLabelService.show");

const createFn = (data) => {
  return axios.post("/import-labels", data);
};
export const create = withErrorLogging(createFn, "importLabelService.create");

const updateFn = (import_label_id, data) => {
  return axios.put(`/import-labels/${import_label_id}`, data);
};
export const update = withErrorLogging(updateFn, "importLabelService.update");

const destroyFn = (import_label_id) => {
  return axios.delete(`/import-labels/${import_label_id}`);
};
export const destroy = withErrorLogging(
  destroyFn,
  "importLabelService.destroy"
);
