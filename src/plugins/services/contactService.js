import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

const getContactsBase = async (params = {}) => {
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

const createContactBase = (formData) => {
  return axios.post("/contacts", formData);
};

const updateContactBase = (contactId, formData) =>
  axios.put(`/contacts/${contactId}`, formData);

const deleteContactBase = (contactId) =>
  axios.delete(`/contacts/${contactId}`);

const showContactBase = async (id) => {
  return await axios.get(`/contacts/${id}`);
};

export const getContacts = withErrorLogging(getContactsBase, "getContacts");
export const createContact = withErrorLogging(createContactBase, "createContact");
export const updateContact = withErrorLogging(updateContactBase, "updateContact");
export const deleteContact = withErrorLogging(deleteContactBase, "deleteContact");
export const showContact = withErrorLogging(showContactBase, "showContact");
