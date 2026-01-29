import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/plugins/errorLogger";

const getContactsFn = async (params = {}) => {
  const token = Cookies.get("authToken");
  return axios.get("/contacts", {
    params: {
      page: params.page || 1,
      per_page: params.per_page || 10,
      sort_by: params.sort_by || "id",
      sort_type: params.sort_type || "asc",
      ...params,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getContacts = withErrorLogging(
  getContactsFn,
  "contactService.getContacts"
);

const createContactFn = (formData) => {
  return axios.post("/contacts", formData);
};
export const createContact = withErrorLogging(
  createContactFn,
  "contactService.createContact"
);

const updateContactFn = (contactId, formData) =>
  axios.put(`/contacts/${contactId}`, formData);
export const updateContact = withErrorLogging(
  updateContactFn,
  "contactService.updateContact"
);

const deleteContactFn = (contactId) => axios.delete(`/contacts/${contactId}`);
export const deleteContact = withErrorLogging(
  deleteContactFn,
  "contactService.deleteContact"
);

const showContactFn = async (id) => {
  return await axios.get(`/contacts/${id}`);
};
export const showContact = withErrorLogging(
  showContactFn,
  "contactService.showContact"
);
