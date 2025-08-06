<template>
  <div
    class="modal fade"
    id="suggestUserModal"
    tabindex="-1"
    aria-labelledby="SuggestUserModalLabel"
    aria-hidden="true"
    v-on:="{'hidden.bs.modal': resetModal}"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content pt-3 bg-warning">
        <div class="modal-body text-center text-white">
          <div class="modal1" v-if="!showModal2">
            <i
              class="fa-solid fa-triangle-exclamation pb-4"
              style="font-size: 60px"
            ></i>
            <h4>{{ $t("kanban-suggest-user-heading") }}</h4>
            <span style="font-size: 14px">{{
              $t("kanban-suggest-user-sub-heading")
            }}</span>
          </div>
          <div class="modal2" v-else>
            <i
              class="fa-solid fa-triangle-exclamation pb-4"
              style="font-size: 60px"
            ></i>
            <h4>
              {{ $t("kanban-suggest-user-modal2-heading") }}
            </h4>
            <textarea
              class="form-control"
              :placeholder="$t('kanban-suggest-user-comments-placeholder')"
              rows="4"
              v-model="comment"
            ></textarea>
            <h4 class="mt-5">
              {{ $t("kanban-suggest-user-modal2-select-heading") }}
            </h4>
            <select
              name="user_id"
              class="form-select mt-2"
              v-model="selected_user_id"
            >
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="modal-footer border-top-0 mt-5">
          <button
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="closeSuggestUserModal"
          >
            {{ $t("kanban-suggest-user-cancel-button") }}
          </button>
          <button
            v-if="!showModal2"
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="showModal2 = true"
          >
            {{ $t("kanban-suggest-user-next-button") }}
          </button>
          <button
            v-else
            type="button"
            class="btn bg-white py-2 px-4"
            style="color: red; font-size: 14px"
            @click="handleSuggestUserSubmit"
            :disabled="!selected_user_id || !comment"
          >
            {{ $t("kanban-suggest-user-confirm-button") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import { useToast } from "vue-toastification";
import { createApproval, createComment } from "@/plugins/services/authService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
export default {
  name: "SuggestUserModal",
  props: {
    dealId: {
      type: Number,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const toast = useToast();
    const showModal2 = ref(false);
    const comment = ref("");
    const selected_user_id = ref(null);
    const local_dealId = ref(props.dealId);
    const local_phone = ref(props.phone);
    const { t } = useI18n();

    const closeSuggestUserModal = () => {
      const suggestUserModal = Modal.getInstance(
        document.getElementById("suggestUserModal")
      );
      if (suggestUserModal) {
        suggestUserModal.hide();
      }
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
      resetModal();
    };

    const handleSuggestUserSubmit = async () => {
      if (selected_user_id.value && comment.value) {
        try {
          if (!selected_user_id.value || !comment.value) {
            toast.error(t("error.requiredFields"), {
              timeout: 3000,
            });
            return;
          }

          const commentResponse = await createComment({
            text_body: comment.value,
            deal_id: local_dealId.value,
          });
          if (commentResponse.data) {
            const approvalResponsive = await createApproval(
              local_phone.value,
              selected_user_id.value
            );
            if (approvalResponsive.data) {
              toast.success(approvalResponsive.data.message, {
                timeout: 3000,
              });
            } else {
              toast.error(approvalResponsive.data.message, {
                timeout: 3000,
              });
            }
            emit("suggest-user", selected_user_id.value);
          } else {
            toast.error(commentResponse.data.message, {
              timeout: 3000,
            });
          }
          closeSuggestUserModal();
        } catch (error) {
          console.error("Error updating deal:", error);
          toast.error(error.message, {
            timeout: 3000,
          });
        }
      }
    };

    const resetModal = () => {
      showModal2.value = false;
      selected_user_id.value = null;
      comment.value = "";
    };

    return {
      showModal2,
      comment,
      selected_user_id,
      closeSuggestUserModal,
      handleSuggestUserSubmit,
      resetModal,
      toast,
      local_dealId,
    };
  },
};
</script>
