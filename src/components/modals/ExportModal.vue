<template>
  <div
    class="modal fade"
    id="exportModal"
    tabindex="-1"
    aria-labelledby="exportModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exportModalLabel">تصدير البيانات</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleExport">
            <div class="mb-3">
              <label class="form-label">صيغة التصدير</label>
              <select class="form-select" v-model="exportFormat" required>
                <option value="" disabled selected>اختر صيغة التصدير</option>
                <option value="excel">Excel</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!exportFormat"
              >
                تصدير
                <i class="fa-solid fa-download ms-1"></i>
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";

export default {
  name: "ExportModal",
  setup() {
    const toast = useToast();
    const exportFormat = ref("");

    const handleExport = () => {
      try {
        if (!exportFormat.value) {
          toast.error("الرجاء اختيار صيغة التصدير", {
            timeout: 3000,
          });
          return;
        }

        toast.info("جاري تصدير البيانات...", {
          timeout: 2000,
        });

        console.log("Exporting as:", exportFormat.value);

        const modal = Modal.getInstance(document.getElementById("exportModal"));
        modal?.hide();

        toast.success("تم تصدير البيانات بنجاح", {
          timeout: 3000,
        });

        exportFormat.value = "";
      } catch (error) {
        console.error("Error during export:", error);
        toast.error("حدث خطأ أثناء تصدير البيانات", {
          timeout: 3000,
        });
      }
    };

    return {
      exportFormat,
      handleExport,
    };
  },
};
</script>
