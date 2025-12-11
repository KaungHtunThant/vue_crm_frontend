<template>
  <div class="modal fade" id="contactCreateModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              isEditing
                ? t("contacts-modal-edit-heading")
                : t("contacts-modal-add-heading")
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
            <!-- Name Input -->
            <div class="mb-3">
              <label for="name" class="form-label">{{
                t("contacts-modal-add-label-fullname")
              }}</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="formData.name"
                :placeholder="t('contacts-modal-add-placeholder-fullname')"
                required
              />
            </div>
            <!-- nickname Input -->
            <div class="mb-3">
              <label for="nickname" class="form-label">{{
                t("contacts-modal-add-label-nickname")
              }}</label>
              <input
                type="text"
                class="form-control"
                id="nickname"
                v-model="formData.nickname"
                :placeholder="t('contacts-modal-add-placeholder-nickname')"
                required
              />
            </div>

            <!-- Email Input -->
            <div class="mb-3">
              <label for="email" class="form-label">{{
                t("contacts-modal-add-label-email")
              }}</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="formData.email"
                :placeholder="t('contacts-modal-add-placeholder-email')"
                required
              />
            </div>
            <!-- Address Input -->
            <div class="mb-3">
              <label for="address" class="form-label">{{
                t("contacts-modal-add-label-address")
              }}</label>
              <input
                type="text"
                class="form-control"
                id="address"
                v-model="formData.address"
                :placeholder="t('contacts-modal-add-placeholder-address')"
                required
              />
            </div>
            <!-- country Input -->
            <div class="mb-3">
              <label for="country" class="form-label">{{
                t("contacts-modal-add-label-country")
              }}</label>
              <input
                type="text"
                class="form-control"
                id="country"
                v-model="formData.country"
                :placeholder="t('contacts-modal-add-placeholder-country')"
                required
              />
            </div>

            <!-- Phone Input -->
            <!-- <div
              class="mb-3"
              v-for="(phone, index) in formData.phones"
              :key="index"
            >
              <div class="d-flex align-items-center gap-2">
                <div class="flex-grow-1">
                  <label for="phone" class="form-label">
                    {{ t("contacts-modal-add-label-phone") }} {{ index + 1 }}
                  </label>
                  <div class="mb-3 d-flex align-items-center gap-2">
                    <input
                      type="text"
                      class="form-control"
                      :id="`phone${index}`"
                      v-model="phone.phone"
                      :placeholder="t('contacts-modal-add-placeholder-phone')"
                    />
                    <button
                      type="button"
                      class="btn btn-primary"
                      @click="addPhone"
                      v-if="formData.phones.length < 2"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-danger mt-3"
                  @click="removePhone(index)"
                  v-if="formData.phones.length > 1"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div> -->
            <!-- Phone 1 Input -->
            <div class="mb-3">
              <label for="phone1" class="form-label">
                {{ t("contacts-modal-add-label-phone") }} 1
              </label>
              <div class="d-flex align-items-center gap-2">
                <div class="flex-grow-1">
                  <input
                    type="text"
                    class="form-control"
                    id="phone1"
                    v-model="formData.phone1"
                    :placeholder="t('contacts-modal-add-placeholder-phone')"
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="togglePhone2"
                >
                  <i
                    class="fas"
                    :class="showPhone2 ? 'fa-minus' : 'fa-plus'"
                  ></i>
                </button>
              </div>
            </div>

            <div class="mb-3" v-if="showPhone2">
              <label for="phone2" class="form-label">
                {{ t("contacts-modal-add-label-phone") }} 2
              </label>
              <input
                type="text"
                class="form-control"
                id="phone2"
                v-model="formData.phone2"
                :placeholder="t('contacts-modal-add-placeholder-phone')"
              />
            </div>
          </div>
          <div
            class="modal-footer d-flex justify-content-between align-items-center"
          >
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              {{
                isSubmitting
                  ? t("contacts-modal-edit-button-submit")
                  : t("contacts-modal-edit-button-submit")
              }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {{ t("contacts-modal-edit-button-cancel") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import {
  createContact,
  updateContact,
} from "@/plugins/services/contactService";
// import { useToast } from "vue-toastification";
// import { showError } from "@/plugins/services/toastService";
import { useNotificationStore } from "@/stores/notificationStore";

import { useI18n } from "vue-i18n";
export default {
  name: "ContactsViewCreateModal",
  props: {
    rows: {
      type: Array,
      required: true,
    },
  },
  emits: ["contact-updated"],
  setup(props, { emit }) {
    const notificationStore = useNotificationStore();
    const { t } = useI18n();
    // const toast = useToast();
    const modalInstance = ref(null);
    const isEditing = ref(false);
    const isSubmitting = ref(false);
    const errors = ref([]);
    const showPhone2 = ref(false);

    const formData = ref({
      name: "",
      nickname: "",
      email: "",
      address: "",
      country: "",
      phone1: "",
      phone2: "",
    });

    const resetForm = () => {
      formData.value = {
        name: "",
        nickname: "",
        email: "",
        address: "",
        country: "",
        phones: [{ phone: "" }],
      };
      isEditing.value = false;
    };

    const openModal = (contact = null) => {
      try {
        if (contact) {
          formData.value = {
            id: contact.id,
            name: contact.name,
            nickname: contact.nickname,
            email: contact.email,
            address: contact.address || "",
            country: contact.country || "",
            phone1: contact.phone1 || "",
            phone2: contact.phone2 || "",
          };
          showPhone2.value = !!contact.phone2;
          isEditing.value = true;
        } else {
          resetForm();
        }
        modalInstance.value.show();
      } catch (error) {
        notificationStore.error(error.message, {
          timeout: 3000,
        });
        console.error("Error opening modal:", error);
      }
    };

    // const addPhone = () => {
    //   if (formData.value.phones.length < 2) {
    //     formData.value.phones.push({ phone: "" });
    //   } else {
    //     toast.error(t("error.maxPhonesReached"), {
    //       timeout: 3000,
    //     });
    //   }
    // };

    // const removePhone = (index) => {
    //   if (formData.value.phones.length > 1) {
    //     formData.value.phones.splice(index, 1);
    //   } else {
    //     toast.error(t("error.atLeastOnePhone"), {
    //       timeout: 3000,
    //     });
    //   }
    // };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        isSubmitting.value = true;
        let response;

        const phones = [];
        if (formData.value.phone1) {
          phones.push(formData.value.phone1);
        }
        if (formData.value.phone2) {
          phones.push(formData.value.phone2);
        }

        const submitData = {
          name: formData.value.name,
          nickname: formData.value.nickname,
          email: formData.value.email,
          address: formData.value.address,
          country: formData.value.country,
          phones: phones,
        };

        if (isEditing.value) {
          response = await updateContact(formData.value.id, submitData);
          emit("contact-updated", response.data.data);
        } else {
          response = await createContact(submitData);
          emit("contact-updated", response.data.data);
        }

        if (response.status === 200 || response.status === 201) {
          modalInstance.value.hide();
          resetForm();
        }
      } catch (error) {
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors;
        }
        notificationStore.error(error.message || t("error.saveContact"), {
          timeout: 3000,
        });
      } finally {
        isSubmitting.value = false;
      }
    };

    const validateForm = () => {
      return true;
    };

    onMounted(() => {
      try {
        modalInstance.value = new Modal(
          document.getElementById("contactCreateModal")
        );
      } catch (error) {
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    });
    const togglePhone2 = () => {
      showPhone2.value = !showPhone2.value;
      if (!showPhone2.value) {
        formData.value.phone2 = "";
      }
    };

    return {
      formData,
      isEditing,
      isSubmitting,
      openModal,
      handleSubmit,
      togglePhone2,
      showPhone2,
      t,
      errors,
    };
  },
};
</script>

<style scoped>
.form-control:focus {
  border-color: #333;
  box-shadow: 0 0 0 0.01rem #333;
}
</style>
