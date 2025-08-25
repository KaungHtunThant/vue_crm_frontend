<template>
  <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
    <!-- Buttons Section -->
    <div class="row mb-3">
      <div class="col-12 text-end">
        <!-- <button
          class="btn btn-primary me-2"
          @click="openImportModal"
          v-if="permissionStore.hasPermission(PERMISSIONS.CREATE_FILE)"
        >
          {{ t("documents-modal-importdocument-heading") }}
          <i class="fas fa-file-import me-1"></i>
        </button> -->
        <button
          class="btn btn-primary me-2"
          @click="openNewFolderModal"
          v-if="permissionStore.hasPermission(PERMISSIONS.EDIT_STAGE)"
        >
          {{ t("documents-button-createfolder") }}
          <i class="fas fa-folder-plus me-1"></i>
        </button>
        <button class="btn btn-primary" @click="$router.back()">
          <i class="fas fa-arrow-right pt-1 me-1"></i>
          <span>{{ t("documents-button-back") }}</span>
        </button>
      </div>
    </div>

    <!-- Folders Table -->
    <!--  -->

    <EasyDataTable
      :headers="headers"
      :items="filteredItems"
      @click-row="handleRowClick"
      table-class-name="custom-table"
      :loading="tableLoading"
      :per-page="10"
    >
      <!-- Folder Name Column -->
      <template #item-name="item">
        <div class="d-flex align-items-center">
          <i class="fas fa-folder text-warning me-2"></i>
          <span class="text-decoration-none text-dark">
            {{ item.name }}
          </span>
        </div>
      </template>

      <!-- Created Date Column -->
      <template #item-created_at="item">
        <div class="text-muted">{{ item.created_at }}</div>
      </template>
      <template #item-files_count="item">
        <div class="text-muted fs-6 ps-3">{{ item.count }}</div>
      </template>

      <!-- Actions Column -->
      <template #item-actions="item">
        <div class="d-flex gap-2">
          <button
            v-if="permissionStore.hasPermission(PERMISSIONS.UPDATE_FOLDER)"
            class="btn btn-sm btn-primary"
            @click="editFolder(item)"
            title="Edit"
          >
            <i class="fas fa-edit"></i>
          </button>
          <!-- <a
            class="btn btn-sm btn-success"
            title="Download"
            href="item.download_url"
            target="_blank"
          >
            <i class="fas fa-download"></i>
          </a> -->
          <button
            v-if="permissionStore.hasPermission(PERMISSIONS.DELETE_FOLDER)"
            class="btn btn-sm btn-danger"
            @click="deleteFolder(item.id)"
            title="Delete"
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </template>

      <!-- Loading Template -->
      <template #loading>
        <div class="text-center loading-container py-5">
          <div class="position-relative d-inline-block">
            <img
              src="@/assets/new-nokta-logo.png"
              class="loading-logo"
              style="width: 50px; height: 50px"
            />
          </div>
          <div class="mt-2 text-primary">{{ t("tables-loading") }}</div>
        </div>
      </template>

      <!-- Empty State -->
      <template #empty>
        <div class="text-center py-5 text-muted">
          <i class="fas fa-folder-open mb-3" style="font-size: 48px"></i>
          <p>{{ t("documents-table-no-files") }}</p>
        </div>
      </template>
    </EasyDataTable>
  </div>
  <!-- Add Modals -->
  <documents-folder-view-add-edit-folder-modal
    :folder="selectedFolder"
    @submit="handleFolderSubmit"
  />

  <!-- <ImportFolder @import="handleFolderImport" /> -->
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import EasyDataTable from "vue3-easy-data-table";
import DocumentsFolderViewAddEditFolderModal from "@/components/modals/DocumentsFolderViewAddEditFolderModal.vue";
// import ImportFolder from "@/components/modals/ImportFolder.vue";
import Modal from "bootstrap/js/dist/modal";
import { useToast } from "vue-toastification";
import Swal from "sweetalert2";
import { useI18n } from "vue-i18n";
import {
  getDocuments,
  createDocuments,
  updateDocuments,
  deleteDocuments,
} from "@/plugins/services/authService";
import { usePermissionStore, PERMISSIONS } from "@/stores/permissionStore";
export default {
  name: "DocumentsFolderView",

  components: {
    EasyDataTable,
    DocumentsFolderViewAddEditFolderModal,
    // ImportFolder,
  },

  setup() {
    const toast = useToast();
    const router = useRouter();
    const tableLoading = ref(false);
    const items = ref([]);
    const permissionStore = usePermissionStore();
    const folderFormModal = ref(null);
    // const importFolderModal = ref(null);
    const selectedFolder = ref(null);
    const { t } = useI18n();

    const headers = [
      { text: t("documents-table-header-name"), value: "name" },
      { text: t("documents-table-header-date"), value: "created_at" },
      { text: t("documents-table-header-count"), value: "files_count" },
      { text: t("documents-table-header-actions"), value: "actions" },
    ];

    const filteredItems = computed(() => {
      return items.value.map((item) => {
        const formattedDate = new Date(item.created_at).toLocaleDateString(
          "ar-EG"
        );
        return { ...item, created_at: formattedDate };
      });
    });

    const openNewFolderModal = () => {
      selectedFolder.value = null;
      folderFormModal.value.show();
    };

    // const openImportModal = () => {
    //   importFolderModal.value.show();
    // };

    const editFolder = (folder) => {
      selectedFolder.value = { ...folder };
      folderFormModal.value.show();
    };

    const handleFolderSubmit = async (folderData) => {
      try {
        // console.log("📤 بيانات المجلد المرسلة:", folderData);

        let response;
        if (folderData.id) {
          response = await updateDocuments(folderData.id, {
            name: folderData.name,
            parent_id: folderData.parent_id || 1,
          });
          fetchFolders();
        } else {
          response = await createDocuments({
            name: folderData.name,
            parent_id: folderData.parent_id || 1,
          });

          if (response && response.data.result) {
            items.value.push(response.data.result);
            toast.success(response.data.message, { timeout: 3000 });
          } else {
            throw new Error("❌ استجابة غير صالحة من السيرفر");
          }
        }

        folderFormModal.value.hide();
      } catch (error) {
        // console.error("❌ خطأ أثناء تعديل المجلد:", error);
        toast.error(t("error.saveFailed"), { timeout: 3000 });
      }
    };

    // const handleFolderImport = async (files) => {
    //   try {
    //     console.log("Importing files:", files);
    //     importFolderModal.value.hide();
    //     toast.success(t("success.imported"), {
    //       timeout: 3000,
    //     });
    //   } catch (error) {
    //     toast.error(t("error.importFailed"), {
    //       timeout: 3000,
    //     });
    //     console.error("Error importing files:", error);
    //   }
    // };

    const deleteFolder = async (id) => {
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
          await deleteDocuments(id);
          items.value = items.value.filter((folder) => folder.id !== id);
          toast.success(t("success.deleteSuccess"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.deleteFailed"), {
          timeout: 3000,
        });
        console.error("Error deleting folder:", error);
      }
    };

    const downloadFolder = async (folderId) => {
      try {
        console.log("Downloading folder:", folderId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success(t("success.downloadStarted"), {
          timeout: 3000,
        });
      } catch (error) {
        toast.error(t("error.downloadFailed"), {
          timeout: 3000,
        });
        console.error("Error downloading folder:", error);
      }
    };

    const fetchFolders = async () => {
      try {
        tableLoading.value = true;
        const response = await getDocuments();
        items.value = response.data.folders;
      } catch (error) {
        toast.error(t("error.fetchFailed"), {
          timeout: 3000,
        });
        console.error("Error fetching folders:", error);
      } finally {
        tableLoading.value = false;
      }
    };

    const handleRowClick = async (item, event) => {
      if (event?.target?.closest("button")) {
        return;
      }

      try {
        console.log("Row clicked:", item);
        const folders = items.value;
        const currentFolder = folders.find((folder) => folder.id === item.id);
        if (currentFolder && currentFolder.full_path) {
          const cleanPath = currentFolder.full_path.startsWith("/")
            ? currentFolder.full_path.substring(1)
            : currentFolder.full_path;

          router.push({
            path: `/documents/${cleanPath}`,
            state: {
              folderId: currentFolder.id,
              folderName: currentFolder.name,
              folderPath: currentFolder.full_path,
            },
          });
        } else {
          toast.warning("invalidFolderPath");
        }
      } catch (error) {
        toast.error("Error navigating to folder");
      }
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

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    onMounted(async () => {
      await fetchFolders();
      folderFormModal.value = new Modal(
        document.getElementById("folderFormModal")
      );
      // importFolderModal.value = new Modal(
      //   document.getElementById("importFolderModal")
      // );
      window.addEventListener("contextmenu", handleRightClick);
    });

    return {
      headers,
      filteredItems,
      tableLoading,
      selectedFolder,
      openNewFolderModal,
      // openImportModal,
      editFolder,
      deleteFolder,
      handleFolderSubmit,
      // handleFolderImport,
      handleRowClick,
      downloadFolder,
      t,
      permissionStore,
      PERMISSIONS,
    };
  },
};
</script>

<style scoped>
.loading-logo {
  animation: smooth-spin 2s infinite linear;
}

@keyframes smooth-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.custom-table) {
  --easy-table-border: 1px solid #eff2f7;
  --easy-table-row-border: 1px solid #eff2f7;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.custom-table tbody tr) {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

:deep(.custom-table tbody tr:hover) {
  background-color: #f8f9fa;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
}

.actions button {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.actions button:hover {
  opacity: 1;
}
</style>
