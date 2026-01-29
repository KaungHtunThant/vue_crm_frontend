import axios from "@/plugins/axios";
import { withErrorLogging } from "@/plugins/errorLogger";

const getDocumentsFn = async () => {
  return await axios.get("/documents");
};
export const getDocuments = withErrorLogging(
  getDocumentsFn,
  "documentService.getDocuments"
);

const createDocumentsFn = async (formData) => {
  const response = await axios.post("/documents", formData);
  return response;
};
export const createDocuments = withErrorLogging(
  createDocumentsFn,
  "documentService.createDocuments"
);

const updateDocumentsFn = (documentsId, formData) =>
  axios.patch(`/documents/${documentsId}`, formData);
export const updateDocuments = withErrorLogging(
  updateDocumentsFn,
  "documentService.updateDocuments"
);

const deleteDocumentsFn = (documentsId) =>
  axios.delete(`/documents/${documentsId}`);
export const deleteDocuments = withErrorLogging(
  deleteDocumentsFn,
  "documentService.deleteDocuments"
);

const updateFilesFn = (filesId, formData) =>
  axios.put(`/documents/files/${filesId}`, formData);
export const updateFiles = withErrorLogging(
  updateFilesFn,
  "documentService.updateFiles"
);

const deleteFilesFn = (filesId) => axios.delete(`/documents/files/${filesId}`);
export const deleteFiles = withErrorLogging(
  deleteFilesFn,
  "documentService.deleteFiles"
);

const showDocumentsFn = async (folderName) => {
  return await axios.get(`/documents/${folderName}`);
};
export const showDocuments = withErrorLogging(
  showDocumentsFn,
  "documentService.showDocuments"
);

const uploadFilesFn = async (formData) => {
  return await axios.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const uploadFiles = withErrorLogging(
  uploadFilesFn,
  "documentService.uploadFiles"
);
