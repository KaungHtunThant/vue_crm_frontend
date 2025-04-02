<template>
  <div class="modal fade" id="folderFormModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              isEdit
                ? t("documents-modal-edit-heading")
                : t("documents-modal-createfolder-heading")
            }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Folder Name Input -->
            <div class="mb-3">
              <label for="folderName" class="form-label">
                {{ t("documents-modal-createfolder-label-name") }}
              </label>
              <input
                type="text"
                class="form-control"
                id="folderName"
                v-model="folderData.name"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {{ t("documents-modal-createfolder-button-close") }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting
                  ? t("loading")
                  : t("documents-modal-createfolder-button-submit")
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

export default {
  name: "FolderFormModal",
  props: {
    folder: {
      type: Object,
      default: null,
    },
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const toast = useToast();
    const folderData = ref({ name: "", parent_id: 1 });
    const isEdit = ref(false);
    const isSubmitting = ref(false);

    watch(
      () => props.folder,
      (newFolder) => {
        folderData.value = newFolder
          ? { ...newFolder, parent_id: newFolder.parent_id || 1 }
          : { name: "", parent_id: 1 };
        isEdit.value = !!newFolder;
      },
      { immediate: true }
    );

    const handleSubmit = async () => {
      if (!folderData.value.name.trim()) {
        toast.error(t("error.emptyFolderName"), { timeout: 3000 });
        return;
      }

      isSubmitting.value = true;
      try {
        emit("submit", folderData.value);
        toast.success(
          isEdit.value ? t("success.updated") : t("success.saved"),
          { timeout: 3000 }
        );
      } catch (error) {
        toast.error(t("error.saveFailed"), { timeout: 3000 });
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      folderData,
      isEdit,
      isSubmitting,
      handleSubmit,
      t,
    };
  },
};
</script>
