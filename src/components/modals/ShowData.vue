<template>
  <div
    class="modal fade"
    id="showDataModal"
    tabindex="-1"
    aria-labelledby="showDataModalLabel"
    aria-hidden="true"
    ref="showDataModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="showDataModalLabel">Show Deal Modal</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeShowDataModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <!-- Deal Information -->
              <h6 class="mb-3">Deal Information</h6>
              <div class="mb-3">
                <label class="form-label">Stage Name</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.stage_name"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Source Name</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.source_name || 'No source'"
                  disabled
                />
              </div>
              <!-- <div class="mb-3">
                <label class="form-label">owner</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.owner_id || 'No owner'"
                  disabled
                />
              </div> -->
              <div class="mb-3">
                <label class="form-label">Rating</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.rating || 'No rating'"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Note</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.note || 'No description'"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Create at</label>
                <input
                  type="text"
                  class="form-control"
                  :value="formatDate(dealData?.created_at)"
                  disabled
                />
              </div>

              <!-- Contact Information -->
              <h6 class="mb-3 mt-4">Contact Informations</h6>
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.name"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  :value="dealData?.email"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Country</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.country || 'No country'"
                  disabled
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input
                  type="text"
                  class="form-control"
                  :value="dealData?.phone"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
export default {
  name: "showDataModal",
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const toast = useToast();
    const { t } = useI18n();
    const showDataModalRef = ref(null);
    const dealData = ref(null);

    watch(
      () => props.formData,
      (newData) => {
        if (newData) {
          dealData.value = newData;
          toast.success(t("success.showData"), {
            timeout: 3000,
          });
        }
      },
      { deep: true, immediate: true }
    );

    const formatDate = (dateString) => {
      if (!dateString) return "No date";
      return new Date(dateString).toLocaleString();
    };

    const openShowData = () => {
      try {
        const modalElement = document.getElementById("showDataModal");
        const modal = new Modal(modalElement);
        modal.show();
      } catch (error) {
        toast.error(t("error.showData"), {
          timeout: 3000,
        });
        console.error("Error opening modal:", error);
      }
    };

    const closeShowDataModal = () => {
      try {
        const modalElement = document.getElementById("showDataModal");
        const modal = Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      } catch (error) {
        toast.error(t("error.closeModal"), {
          timeout: 3000,
        });
        console.error("Error closing modal:", error);
      }
    };

    return {
      openShowData,
      closeShowDataModal,
      showDataModalRef,
      dealData,
      formatDate,
      t,
    };
  },
};
</script>

<style scoped>
h6 {
  color: #666;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}
</style>
