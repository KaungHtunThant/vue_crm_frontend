<template>
  <div
    class="modal fade"
    id="dealModal"
    tabindex="-1"
    aria-labelledby="dealModalLabel"
    aria-hidden="true"
    ref="dealModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dealModalLabel">
            {{ t("kanban-button-add-deal") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeDealModal"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <deal-form v-model:formData="formData" />
          <deal-buttons @close-modal="closeDealModal" @submit="submitForm" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import DealForm from "@/components/CreateDealElements/CrmListViewCreateDealModalFormItems.vue";
import DealButtons from "@/components/CreateDealElements/CrmListViewCreateDealModalButtonsItems.vue";
import { createDeal } from "@/plugins/services/dealService";
// import { useToast } from "vue-toastification";
import { showSuccess, showError } from "@/plugins/services/toastService";

import { useI18n } from "vue-i18n";
export default {
  name: "CrmListViewCreateDealModal",
  components: { DealForm, DealButtons },
  emits: ["add-deal"],
  setup() {
    const { t } = useI18n();
    // const toast = useToast();
    return { t };
  },
  data() {
    return {
      formData: {
        note: null,
        stage_id: null,
        source_id: null,
        responsible_user_id: null,
        rating: null,
        contact: {
          name: "",
          email: "",
          phone1: "",
          phone2: "",
        },
      },
    };
  },
  methods: {
    openModal() {
      const modal = new Modal(document.getElementById("dealModal"));
      modal.show();
    },
    async submitForm() {
      try {
        if (!this.formData.contact.name || !this.formData.contact.phone1) {
          showError(this.t("error.requiredFields"), {
            timeout: 3000,
          });
          return;
        }

        const phones = [];
        if (this.formData.contact.phone1) {
          phones.push(this.formData.contact.phone1);
        }
        if (this.formData.contact.phone2) {
          phones.push(this.formData.contact.phone2);
        }

        const dealData = {
          note: this.formData.note,
          stage_id: this.formData.stage_id,
          source_id: this.formData.source_id,
          responsible_user_id: this.formData.responsible_user_id,
          rating: this.formData.rating,
          name: this.formData.contact.name,
          email: this.formData.contact.email,
          phones: this.formData.contact.phones,
        };

        const response = await createDeal(dealData);

        if (response.data) {
          showSuccess(this.t("success.createDeal"), {
            timeout: 3000,
          });
          this.$emit("add-deal", response.data);
          this.clearForm();
          this.closeDealModal();
        }
      } catch (error) {
        showError(error.response?.data?.message || this.t("error.createDeal"), {
          timeout: 3000,
        });
        console.error("Error:", error);
      }
    },
    clearForm() {
      this.formData = {
        note: null,
        stage_id: null,
        source_id: null,
        responsible_user_id: null,
        rating: null,
        contact: {
          name: "",
          email: "",
          phone1: "",
          phone2: "",
        },
      };
    },
    closeDealModal() {
      const modal = new Modal(document.getElementById("dealModal"));
      if (modal) {
        modal.hide();
      }
    },
  },
};
</script>
