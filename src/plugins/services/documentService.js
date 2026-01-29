import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const getDocumentsBase = async () => {
  return await axios.get("/documents");
};

const createDocumentsBase = async (formData) => {
  const response = await axios.post("/documents", formData);
  return response;
};

const updateDocumentsBase = (documentsId, formData) =>
  axios.patch(`/documents/${documentsId}`, formData);

const deleteDocumentsBase = (documentsId) =>
  axios.delete(`/documents/${documentsId}`);

const updateFilesBase = (filesId, formData) =>
  axios.put(`/documents/files/${filesId}`, formData);

const deleteFilesBase = (filesId) =>
  axios.delete(`/documents/files/${filesId}`);

const showDocumentsBase = async (folderName) => {
  return await axios.get(`/documents/${folderName}`);
};

const uploadFilesBase = async (formData) => {
  return await axios.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getDocuments = withErrorLogging(getDocumentsBase, "getDocuments");
export const createDocuments = withErrorLogging(
  createDocumentsBase,
  "createDocuments"
);
export const updateDocuments = withErrorLogging(
  updateDocumentsBase,
  "updateDocuments"
);
export const deleteDocuments = withErrorLogging(
  deleteDocumentsBase,
  "deleteDocuments"
);
export const updateFiles = withErrorLogging(updateFilesBase, "updateFiles");
export const deleteFiles = withErrorLogging(deleteFilesBase, "deleteFiles");
export const showDocuments = withErrorLogging(
  showDocumentsBase,
  "showDocuments"
);
export const uploadFiles = withErrorLogging(uploadFilesBase, "uploadFiles");
