<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div class="d-flex align-items-center pt-3">
        <!-- Breadcrumbs -->
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li
              class="breadcrumb-item"
              v-for="(crumb, index) in breadcrumbs"
              :key="index"
            >
              <a
                v-if="index < breadcrumbs.length - 1"
                @click="navigateToCrumb(crumb.path)"
                class="text-info text-decoration-none cursor-pointer fs-7"
              >
                {{ crumb.name }}
              </a>
              <span v-else class="fs-7">{{ crumb.name }}</span>
            </li>
          </ol>
        </nav>
        <!-- <i class="fas fa-folder text-warning me-2"></i>
        <p class="fs-5 pt-1 mb-0">{{ folderName }}</p> -->
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="openNewFolderModal">
          <i class="fas fa-folder-plus me-1"></i>
          {{ t("documents-button-createfolder") }}
        </button>
        <button
          class="btn btn-primary d-flex justify-content-center align-items-center gap-2"
          @click="$router.back()"
        >
          <i class="fas fa-arrow-right pt-1"></i>
          <span>{{ t("documents-button-back") }}</span>
        </button>
      </div>
    </div>

    <!-- Upload Area -->
    <div class="upload-area mb-4 border rounded-3 p-4 text-center">
      <div
        class="dropzone"
        @dragover.prevent
        @drop.prevent="handleDrop"
        @click="handleClick"
      >
        <i
          class="fas fa-cloud-upload-alt mb-3 text-primary"
          style="font-size: 48px"
        ></i>
        <p class="text-muted mb-3">
          {{ t("documents-modal-importdocument-placeholder") }}
        </p>
        <input
          type="file"
          multiple
          class="d-none"
          ref="fileInput"
          @change="handleFileSelect"
        />
      </div>
    </div>

    <!-- Files and Folders List -->
    <div class="files-list">
      <!-- Folders Section -->
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="file-item p-3 border-bottom"
      >
        <div
          class="d-flex justify-content-between align-items-center cursor-pointer"
          @click="navigateToFolder(folder.id)"
        >
          <div class="d-flex align-items-center">
            <i class="fas fa-folder text-warning me-2"></i>
            <span>{{ folder.name }}</span>
          </div>
          <div class="actions">
            <button
              v-if="permissionStore.hasPermission(PERMISSIONS.UPDATE_FOLDER)"
              class="btn btn-sm btn-primary me-2"
              @click.stop="editFolder(folder)"
              title="Edit"
            >
              <i class="fas fa-edit"></i>
            </button>
            <!-- <button
              class="btn btn-sm btn-success me-2"
              @click="downloadFolder(folder.id)"
              title="Download"
            >
              <i class="fas fa-download"></i>
            </button> -->
            <button
              v-if="permissionStore.hasPermission(PERMISSIONS.DELETE_FOLDER)"
              class="btn btn-sm btn-danger"
              @click.stop="deleteFolder(folder.id)"
              title="Delete"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Files Section -->
      <div
        v-for="file in files"
        :key="file.id"
        class="file-item p-3 border-bottom"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <i :class="getFileIcon(file.type)" class="me-2"></i>
            <span>{{ file.name }}</span>
          </div>
          <div class="actions">
            <button
              v-if="permissionStore.hasPermission(PERMISSIONS.VIEW_FILE)"
              class="btn btn-sm text-bg-primary me-2"
              @click="viewFile(file)"
              title="View"
            >
              <i class="fas fa-eye"></i>
            </button>
            <a
              v-if="permissionStore.hasPermission(PERMISSIONS.VIEW_FILE)"
              class="btn btn-sm btn-success me-2"
              title="Download"
              :href="file.download_url"
              download
            >
              <i class="fas fa-download"></i>
            </a>
            <button
              v-if="permissionStore.hasPermission(PERMISSIONS.DELETE_FILE)"
              class="btn btn-sm btn-danger"
              @click="deleteFile(file.id)"
              title="Delete"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="folders.length === 0 && files.length === 0"
        class="text-center py-5 text-muted"
      >
        <i class="fas fa-folder-open mb-3" style="font-size: 48px"></i>
        <p>{{ t("documents-table-no-files") }}</p>
      </div>
    </div>
  </div>
  <documents-folder-view-add-edit-folder-modal
    :folder="selectedFolder"
    @submit="handleFolderSubmit"
  />
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import DocumentsFolderViewAddEditFolderModal from "@/components/modals/DocumentsFolderViewAddEditFolderModal.vue";
import Modal from "bootstrap/js/dist/modal";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
import {
  createDocuments,
  deleteFiles,
  showDocuments,
  uploadFiles,
  deleteDocuments,
} from "@/plugins/services/authService";
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";

export default {
  name: "FolderFilesView",

  components: {
    DocumentsFolderViewAddEditFolderModal,
  },

  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const route = useRoute();
    const router = useRouter();
    const files = ref([]);
    const folders = ref([]);
    const folderName = ref("");
    const fileInput = ref(null);
    const selectedFolder = ref(null);
    const folderFormModal = ref(null);
    const permissionStore = usePermissionStore();
    const parentFolder = ref(null);

    const getFileIcon = (type) => {
      const icons = {
        pdf: "fas fa-file-pdf text-danger",
        image: "fas fa-file-image text-primary",
        excel: "fas fa-file-excel text-success",
        powerpoint: "fas fa-file-powerpoint text-warning",
        default: "fas fa-file text-secondary",
      };
      return icons[type] || icons.default;
    };

    const fetchFiles = async () => {
      try {
        console.log(
          "Fetching folder contents...",
          route.params.folderName || route.params.fullPath
        );
        var folderPath = route.params.folderName || route.params.fullPath;
        if (!folderPath) {
          router.push({ path: "/documents" });
          return;
        }
        if (Array.isArray(folderPath) && folderPath.length > 1) {
          folderPath = folderPath.join("/");
        }

        const response = await showDocuments(folderPath);
        if (response.data) {
          folderName.value = response.data.parent.name;
          folders.value = response.data.folders || [];
          files.value = response.data.files || [];
          parentFolder.value = response.data.parent;
        }
      } catch (error) {
        console.error("Error fetching folder contents:", error);
        toast.error(t("error.fetchFailed"), { timeout: 3000 });
      }
    };

    const handleClick = (event) => {
      if (event.target.tagName !== "BUTTON") {
        fileInput.value.click();
      }
    };

    const uploadFile = async (file) => {
      const folderPath = route.params.folderName || route.params.fullPath;
      const response = await showDocuments(folderPath);
      const parentId = response.data.parent.id;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("parent_id", parentId);

      try {
        console.log("Sending form data:", formData);
        const response = await uploadFiles(formData);

        console.log("API response:", response);

        if (response.data && response.data.result) {
          fetchFiles();
        } else {
          throw new Error("❌ استجابة غير صالحة من السيرفر");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(t("error.uploadFailed"), {
          timeout: 3000,
        });
      }
    };

    const handleDrop = (event) => {
      const droppedFiles = Array.from(event.dataTransfer.files);
      droppedFiles.forEach((file) => {
        uploadFile(file);
      });
    };

    const handleFileSelect = (event) => {
      const selectedFiles = Array.from(event.target.files);
      selectedFiles.forEach((file) => {
        uploadFile(file);
      });
    };

    const viewFile = (file) => {
      window.open(file.url, "_blank");
    };

    const downloadFile = async (file) => {
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(t("success.downloadStarted"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error downloading file:", error);
        toast.error(t("error.downloadFailed"), {
          timeout: 3000,
        });
      }
    };

    const editFolder = (folder) => {
      selectedFolder.value = { ...folder };
      folderFormModal.value = new Modal(
        document.getElementById("folderFormModal")
      );
      folderFormModal.value.show();
    };

    const deleteFile = async (fileId) => {
      try {
        const result = await Swal.fire({
          title: t("documents-alert-delete-file-title"),
          text: t("documents-alert-delete-file-description"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: t("success.deleteConfirm"),
          cancelButtonText: t("error.deleteCancel"),
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          await deleteFiles(fileId);
          files.value = files.value.filter((file) => file.id !== fileId);
          toast.success(t("success.deleteSuccess"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"), {
          timeout: 3000,
        });
        console.error("Error deleting file:", error);
      }
    };

    const handleFolderSubmit = async (folderData) => {
      if (!folderData.name?.trim()) {
        toast.error(t("error.required"), { timeout: 3000 });
        return;
      }

      try {
        const parentId = parentFolder.value.id;

        const createResponse = await createDocuments({
          name: folderData.name,
          parent_id: parentId,
        });

        if (createResponse.data && createResponse.data.result) {
          fetchFiles();
          toast.success(createResponse.data.message, { timeout: 3000 });
        } else {
          throw new Error(createResponse.data.message);
        }

        folderFormModal.value.hide();
        selectedFolder.value = null;
      } catch (error) {
        console.error("Error creating folder:", error);
        toast.error(t("error.saveFailed"), { timeout: 3000 });
      }
    };

    const openNewFolderModal = () => {
      selectedFolder.value = null;
      folderFormModal.value = new Modal(
        document.getElementById("folderFormModal")
      );
      folderFormModal.value.show();
    };

    const downloadFolder = async (folderId) => {
      try {
        console.log("Downloading folder:", folderId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(t("success.downloadStarted"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error downloading folder:", error);
        toast.error(t("error.downloadFailed"), {
          timeout: 3000,
        });
      }
    };

    const deleteFolder = async (folderId) => {
      try {
        const result = await Swal.fire({
          title: t("documents-alert-delete-folder-title"),
          text: t("documents-alert-delete-folder-description"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: t("success.deleteConfirm"),
          cancelButtonText: t("error.deleteCancel"),
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          await deleteDocuments(folderId);
          folders.value = folders.value.filter(
            (folder) => folder.id !== folderId
          );
          toast.success(t("success.deleteSuccess"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"), {
          timeout: 3000,
        });
        console.error("Error deleting file:", error);
      }
    };

    const navigateToFolder = async (folderId, event) => {
      if (event?.target?.closest("button")) {
        return;
      }
      try {
        const foldersData = folders.value;
        const currentFolder = foldersData.find(
          (folder) => folder.id === folderId
        );
        if (currentFolder && currentFolder.full_path) {
          // console.log(`/documents${currentFolder.full_path}`);
          router
            .push({
              path: `/documents${currentFolder.full_path}`,
            })
            .then(() => {
              fetchFiles();
            });
        } else {
          toast.warning(t("error.invalidFolderPath"));
        }
      } catch (error) {
        toast.error(t("error.fetchFailed"));
        console.error("❌ Error navigating to folder:", error);
      }
    };

    const breadcrumbs = computed(() => {
      const paths = route.path.split("/").filter(Boolean);
      return paths.map((path, index) => ({
        name: decodeURI(path.charAt(0).toUpperCase() + path.slice(1)),
        path: "/" + paths.slice(0, index + 1).join("/"),
      }));
    });

    const navigateToCrumb = (path) => {
      router.push(path).then(() => {
        fetchFiles();
      });
    };

    const handleRightClick = (event) => {
      event.preventDefault();
      const modalElements = document.querySelectorAll(".modal");
      modalElements.forEach((modal) => {
        if (modal.classList.contains("show")) {
          const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            closeButton.click();
          }
        }
      });
    };

    // upload data
    onMounted(async () => {
      fetchFiles();
      window.addEventListener("contextmenu", handleRightClick);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    return {
      files,
      folders,
      folderName,
      fileInput,
      selectedFolder,
      openNewFolderModal,
      handleFolderSubmit,
      deleteFolder,
      getFileIcon,
      viewFile,
      downloadFile,
      handleFileSelect,
      handleDrop,
      handleClick,
      deleteFile,
      editFolder,
      navigateToFolder,
      downloadFolder,
      breadcrumbs,
      navigateToCrumb,
      t,
      fetchFiles,
      permissionStore,
      PERMISSIONS,
    };
  },
};
</script>

<style scoped>
.dropzone {
  border: 2px dashed #ccc;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dropzone:hover {
  border-color: #0d6efd;
  background: #f1f8ff;
}

.dropzone * {
  pointer-events: none;
}

.file-item {
  transition: background-color 0.2s ease;
}

.file-item:hover {
  background-color: #f8f9fa;
}

.actions button {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.actions button:hover {
  opacity: 1;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  text-decoration: underline;
}

.fs-7 {
  font-size: 0.875rem;
}
</style>
