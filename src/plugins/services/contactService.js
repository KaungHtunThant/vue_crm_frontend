import axios from "@/plugins/axios";
import Cookies from "js-cookie";
import { withErrorLogging } from "@/utils/errorLogger";

const _getContacts = async (params = {}) => {
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

const _createContact = (formData) => {
  return axios.post("/contacts", formData);
};

const _updateContact = (contactId, formData) =>
  axios.put(`/contacts/${contactId}`, formData);

const _deleteContact = (contactId) =>
  axios.delete(`/contacts/${contactId}`);

const _showContact = async (id) => {
  return await axios.get(`/contacts/${id}`);
};

export const getContacts = withErrorLogging(_getContacts, "contactService/getContacts");
export const createContact = withErrorLogging(_createContact, "contactService/createContact");
export const updateContact = withErrorLogging(_updateContact, "contactService/updateContact");
export const deleteContact = withErrorLogging(_deleteContact, "contactService/deleteContact");
export const showContact = withErrorLogging(_showContact, "contactService/showContact");
