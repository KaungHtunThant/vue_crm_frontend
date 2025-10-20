import axios from "@/plugins/axios";

export const getDocuments = async () => {
  return await axios.get("/documents");
};

export const createDocuments = async (formData) => {
  try {
    const response = await axios.post("/documents", formData);
    return response;
  } catch (error) {
    console.error("❌ خطأ أثناء إنشاء المجلد:", error);
    throw error;
  }
};

// update Documents
export const updateDocuments = (documentsId, formData) =>
  axios.patch(`/documents/${documentsId}`, formData);

// Delete documents
export const deleteDocuments = (documentsId) =>
  axios.delete(`/documents/${documentsId}`);

export const showDocuments = async (folderName) => {
  return await axios.get(`/documents/${folderName}`);
};
export const uploadFiles = async (formData) => {
  return await axios.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// update Files
export const updateFiles = (filesId, formData) =>
  axios.put(`/documents/files/${filesId}`, formData);

// Delete Files
export const deleteFiles = (filesId) =>
  axios.delete(`/documents/files/${filesId}`);
