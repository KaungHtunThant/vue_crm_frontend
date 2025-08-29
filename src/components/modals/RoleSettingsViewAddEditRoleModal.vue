<template>
  <div class="modal fade" id="roleModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{
              isEditing
                ? $t("settings-role-modal-edit-heading")
                : $t("settings-role-modal-add-heading")
            }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label required">{{
              $t("settings-role-modal-add-label-name")
            }}</label>
            <input
              type="text"
              class="form-control"
              v-model="role.name"
              :placeholder="$t('settings-role-modal-add-placeholder-name')"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">{{
              $t("settings-role-table-header-created-at")
            }}</label>
            <input
              type="date"
              lang="en"
              class="form-control"
              v-model="role.create_at"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">{{
              $t("settings-role-modal-add-label-permissions")
            }}</label>
            <div class="row">
              <div
                class="col-md-4 mb-2"
                v-for="perm in availablePermissions"
                :key="perm"
              >
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="perm"
                    v-model="role.permissions"
                  />
                  <label class="form-check-label">{{ perm }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger text-white"
            @click="$emit('close')"
          >
            {{ $t("settings-role-modal-add-button-cancel") }}
          </button>
          <button
            type="button"
            class="btn btn-success text-white"
            @click="save"
            :disabled="!role.name"
          >
            {{ $t("settings-role-modal-add-button-submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { Modal } from "bootstrap";
import { useI18n } from "vue-i18n";

export default {
  name: "RoleSettingsViewAddEditRoleModal",
  props: {
    isEditing: {
      type: Boolean,
      default: false,
    },
    currentRole: {
      type: Object,
      default: () => ({
        name: "",
        permissions: [],
        create_at: new Date().toISOString().split("T")[0],
      }),
    },
    availablePermissions: {
      type: Array,
      required: true,
      default: () => [
        this.t("modals.usersManagement"),
        this.t("modals.rolesManagement"),
        this.t("modals.contentManagement"),
        this.t("modals.settingsManagement"),
        this.t("modals.reportsView"),
        this.t("modals.contentView"),
      ],
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const modal = ref(null);
    const role = ref({ ...props.currentRole });

    watch(
      () => props.currentRole,
      (newValue) => {
        role.value = {
          ...newValue,
          permissions: newValue.permissions || [],
        };
      },
      { deep: true }
    );

    const save = () => {
      if (!role.value.name.trim()) return;

      if (!role.value.create_at) {
        role.value.create_at = new Date().toISOString().split("T")[0];
      }

      emit("save", { ...role.value });
      emit("close");
    };

    onMounted(() => {
      const modalElement = document.getElementById("roleModal");
      if (modalElement) {
        modal.value = new Modal(modalElement);
      }
    });

    return {
      role,
      save,
      t,
    };
  },

  emits: ["save", "close"],
};
</script>

<style scoped></style>
