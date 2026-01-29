import axios from "@/plugins/axios";
import { withErrorLogging } from "@/utils/errorLogger";

const _getDocuments = async () => {
  return await axios.get("/documents");
};

const _createDocuments = async (formData) => {
  try {
    const response = await axios.post("/documents", formData);
    return response;
  } catch (error) {
    console.error("❌ خطأ أثناء إنشاء المجلد:", error);
    throw error;
  }
};

const _updateDocuments = (documentsId, formData) =>
  axios.patch(`/documents/${documentsId}`, formData);

const _deleteDocuments = (documentsId) =>
  axios.delete(`/documents/${documentsId}`);

const _updateFiles = (filesId, formData) =>
  axios.put(`/documents/files/${filesId}`, formData);

const _deleteFiles = (filesId) => axios.delete(`/documents/files/${filesId}`);

const _showDocuments = async (folderName) => {
  return await axios.get(`/documents/${folderName}`);
};

const _uploadFiles = async (formData) => {
  return await axios.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getDocuments = withErrorLogging(
  _getDocuments,
  "documentService/getDocuments"
);
export const createDocuments = withErrorLogging(
  _createDocuments,
  "documentService/createDocuments"
);
export const updateDocuments = withErrorLogging(
  _updateDocuments,
  "documentService/updateDocuments"
);
export const deleteDocuments = withErrorLogging(
  _deleteDocuments,
  "documentService/deleteDocuments"
);
export const updateFiles = withErrorLogging(
  _updateFiles,
  "documentService/updateFiles"
);
export const deleteFiles = withErrorLogging(
  _deleteFiles,
  "documentService/deleteFiles"
);
export const showDocuments = withErrorLogging(
  _showDocuments,
  "documentService/showDocuments"
);
export const uploadFiles = withErrorLogging(
  _uploadFiles,
  "documentService/uploadFiles"
);
