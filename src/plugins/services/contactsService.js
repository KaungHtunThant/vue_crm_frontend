import axios from "@/plugins/axios";
import Cookies from "js-cookie";

// get all contacts
export const getContacts = async (params = {}) => {
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

// create new contact
export const createContact = (formData) => {
  return axios.post("/contacts", formData);
};

// update contact
export const updateContact = (contactId, formData) =>
  axios.put(`/contacts/${contactId}`, formData);
// delete contact
export const deleteContact = (contactId) =>
  axios.delete(`/contacts/${contactId}`);

export const showContact = async (id) => {
  return await axios.get(`/contacts/${id}`);
};
