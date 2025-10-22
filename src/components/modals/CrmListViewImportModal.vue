<template>
  <div
    class="modal fade"
    id="importModal"
    tabindex="-1"
    aria-labelledby="importModalLabel"
    aria-hidden="true"
    ref="importModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="importModalLabel">
            {{ $t("kanban-modal-import-heading") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeImportModal"
          ></button>
        </div>
        <form @submit.prevent="submitImports">
          <import-form ref="importFormRef" />
          <import-buttons
            @close-modal="closeImportModal"
            @submit="submitImports"
            :loading="loading"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Modal } from "bootstrap";

import ImportForm from "@/components/importElements/CrmListViewImportModalFormItems.vue";
import ImportButtons from "@/components/importElements/CrmListViewImportModalButtonsItems.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { importDeals } from "@/plugins/services/dealService";

export default {
  name: "CrmListViewImportModal",
  components: { ImportButtons, ImportForm },
  props: ["modelValue"],
  setup(props, { emit }) {
    const toast = useToast();
    const { t } = useI18n();
    const importModalRef = ref(null);
    const importFormRef = ref(null);
    const loading = ref(false);
    let modalInstance = null;

    const openImportModal = () => {
      try {
        if (importModalRef.value) {
          modalInstance = new Modal(importModalRef.value);
          modalInstance.show();
          toast.info(t("modals.importModalInfo"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        toast.error(t("error.importModalError"), {
          timeout: 3000,
        });
        console.error("Error opening modal:", error);
      }
    };

    const closeImportModal = () => {
      try {
        importFormRef.value.$emit("import-complete");
        if (modalInstance) {
          modalInstance.hide();
        }
      } catch (error) {
        toast.error(t("error.closeModal"), {
          timeout: 3000,
        });
        console.error("Error closing modal:", error);
      }
    };

    const submitImports = async () => {
      try {
        loading.value = true;
        if (importFormRef.value) {
          // Access fields from ImportForm
          const fields = {
            file: importFormRef.value.fileInput,
            source: importFormRef.value.source,
            name: importFormRef.value.name,
            description: importFormRef.value.description,
            phone: importFormRef.value.phone,
            comment: importFormRef.value.comment,
            email: importFormRef.value.email,
          };
          const response = await importDeals(fields);
          if (response.status === 200) {
            toast.success(t("success.importModalSuccess"), {
              timeout: 3000,
            });
            emit("import-complete");
          }
        }
        toast.success(t("success.importModalSuccess"), {
          timeout: 3000,
        });
        closeImportModal();
      } catch (error) {
        toast.error(
          error.response?.data?.message || t("error.importModalError"),
          {
            timeout: 3000,
          }
        );
        console.error("Import Error:", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      importModalRef,
      importFormRef,
      openImportModal,
      closeImportModal,
      submitImports,
      loading,
      t,
    };
  },
};
</script>
