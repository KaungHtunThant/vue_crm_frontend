<template>
  <div class="mt-4 me-2 bg-white p-4 rounded-3 allSetting">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis active"
          id="general-tab"
          data-bs-toggle="tab"
          data-bs-target="#general"
          type="button"
          role="tab"
          aria-controls="general"
          aria-selected="true"
        >
          {{ t("settings-general-settings") }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis"
          id="roles-tab"
          data-bs-toggle="tab"
          data-bs-target="#roles"
          type="button"
          role="tab"
          aria-controls="roles"
          aria-selected="false"
        >
          {{ t("settings-role-settings") }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis"
          id="broadcast-tab"
          data-bs-toggle="tab"
          data-bs-target="#broadcast"
          type="button"
          role="tab"
          aria-controls="broadcast"
          aria-selected="false"
        >
          {{ t("settings-broadcast-messages") }}
        </button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="myTabContent">
      <div
        class="tab-pane fade show active"
        id="general"
        role="tabpanel"
        aria-labelledby="general-tab"
      >
        <form>
          <div class="row g-4">
            <!-- App Name -->
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings-label-name")
                  }}<span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="settings.appName"
                  placeholder="CRM Staging"
                />
              </div>
            </div>

            <!-- Plan Expire Notification -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings-planExpireNotification") }}
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  lang="en"
                  class="form-control"
                  v-model="settings.planExpireDays"
                  placeholder="6"
                />
              </div>
            </div>
            <!-- Default Country Code -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings-label-countrycode") }}
                  <span class="text-danger">*</span>
                </label>
                <div
                  class="input-group d-flex align-items-stretch position-relative"
                >
                  <div class="country-flag-container">
                    <Multiselect
                      v-model="settings.defaultCountry"
                      :options="countries"
                      :searchable="false"
                      placeholder="Select Country"
                      label="label"
                      valueProp="value"
                      class="country-select"
                    >
                      <template #option="{ option }">
                        <div class="d-flex align-items-center country-option">
                          <img :src="option.flag" class="country-flag me-2" />
                          <span>{{ option.label }}</span>
                          <span class="ms-1 text-muted"
                            >+{{ option.dialCode }}</span
                          >
                        </div>
                      </template>
                      <template #singleLabel="{ option }">
                        <div class="d-flex align-items-center selected-country">
                          <img :src="option.flag" class="country-flag me-2" />
                          <span>+{{ option.dialCode }}</span>
                        </div>
                      </template>
                    </Multiselect>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    :value="selectedCountryText"
                    style="font-size: 14px !important"
                  />
                </div>
              </div>
            </div>

            <!-- Current Currency -->
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings-label-currency") }}
                  <span class="text-danger">*</span>
                </label>
                <Multiselect
                  v-model="settings.currency"
                  :options="currencies"
                  :searchable="true"
                  placeholder="Select Currency"
                  label="label"
                  valueProp="value"
                  class="form-control p-0"
                >
                  <template #option="{ option }">
                    {{ option.symbol }} {{ option.label }}
                  </template>
                </Multiselect>
              </div>
            </div>

            <!-- Enable Google reCAPTCHA -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="form-group">
                <label class="form-label d-block">
                  {{ t("settings-enableGoogleRecaptcha") }}
                </label>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input shadow-none custom-switch"
                    type="checkbox"
                    v-model="settings.enableRecaptcha"
                  />
                </div>
              </div>
            </div>

            <!-- Language -->
            <div class="col-12 col-md-6 col-lg-3">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings-label-language") }}
                </label>
                <Multiselect
                  v-model="settings.language"
                  :options="languages"
                  :searchable="true"
                  placeholder="Select Language"
                  label="label"
                  valueProp="value"
                  class="form-control p-0"
                >
                  <template #option="{ option }">
                    {{ option.label }}
                  </template>
                </Multiselect>
              </div>
            </div>

            <div class="googleCaptcha" v-if="settings.enableRecaptcha">
              <div class="row">
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">
                      {{ t("settings-googleCaptchaKey") }}
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="settings.googleCaptchaKey"
                      placeholder="Google Captcha key"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <label class="form-label">
                      {{ t("settings-googleCaptchaSecret") }}
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="settings.googleCaptchaSecret"
                      placeholder="Google Captcha Secret"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- Manual Instruction -->
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings-manualInstruction") }}
                </label>
                <textarea
                  class="form-control"
                  v-model="settings.manualInstruction"
                  rows="4"
                  :placeholder="$t('settings-manual-instructions-placeholder')"
                ></textarea>
              </div>
            </div>
            <!-- App Logo -->
            <div class="col-6 col-md-3">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings-label-applogo") }}
                  <i
                    class="fa-solid fa-pen"
                    title="Upload your app logo here"
                  ></i>
                </label>
                <div class="image-upload-container">
                  <div class="current-image">
                    <img
                      :src="settings.appLogo || defaultImage"
                      alt="App Logo"
                      class="preview-image"
                    />
                    <label class="edit-icon">
                      <i class="bi bi-pencil-fill"></i>
                      <input
                        type="file"
                        class="d-none"
                        @change="handleLogoUpload"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Favicon -->
            <div class="col-6 col-md-3">
              <div class="form-group">
                <label class="form-label">
                  {{ t("settings-label-favicon") }}
                  <span class="text-danger">*</span>
                  <i
                    class="fa-solid fa-pen"
                    title="Upload your favicon here"
                  ></i>
                </label>
                <div class="image-upload-container position-relative">
                  <div class="current-image">
                    <img
                      :src="settings.favicon || defaultImage"
                      alt="Favicon"
                      class="preview-image"
                    />
                    <label class="edit-icon">
                      <i class="bi bi-pencil-fill"></i>
                      <input
                        type="file"
                        class="d-none"
                        @change="handleFaviconUpload"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="col-12">
              <button
                type="submit"
                class="btn btn-primary"
                @click.prevent="saveSettings"
              >
                {{ t("settings-button-save") }}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div
        class="tab-pane fade"
        id="roles"
        role="tabpanel"
        aria-labelledby="roles-tab"
      >
        <div class="mt-2 bg-white rounded-3">
          <!-- Search and Add Role Section -->
          <div class="row mb-3">
            <div class="col-6 col-lg-4">
              <div class="position-relative inputSearch d-flex">
                <input
                  type="text"
                  class="form-control ps-5"
                  :placeholder="$t('settings-role-placeholder-search')"
                  v-model="search"
                />
                <i
                  class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3"
                ></i>
              </div>
            </div>
            <div class="col-6 col-lg-8">
              <div class="text-end">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="openModal()"
                >
                  <span>{{ $t("settings-role-button-add-role") }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Roles Table -->
          <!-- :loading="tableLoading" -->

          <EasyDataTable
            :headers="headers"
            :items="filteredItems"
            :rows-per-page="10"
            table-class-name="role-table"
          >
            <!-- Id Column -->
            <template #item-id="item">
              <div class="text-muted fs-6 my-3">{{ item.id }}</div>
            </template>
            <!-- Role Name Column -->
            <template #item-name="item">
              <div class="fs-6">{{ item.name }}</div>
            </template>

            <!--  Create At Column -->
            <template #item-create_at="item">
              <div class="">
                <div class="fs-6">{{ item.create_at }}</div>
              </div>
            </template>

            <!-- Actions Column -->
            <template #item-actions="item">
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-primary" @click="editRole(item)">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteRole(item.id)"
                  :disabled="item.name === 'Admin'"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </template>
            <!-- Loading -->
            <template #loading>
              <div class="text-center loading-container">
                <div class="position-relative d-inline-block">
                  <img
                    :src="logo"
                    class="loading-logo"
                    style="width: 50px; height: 50px"
                  />
                </div>
                <div class="mt-2 text-primary">{{ $t("tables-loading") }}</div>
              </div>
            </template>
          </EasyDataTable>

          <role-settings-view-add-edit-role-modal
            ref="roleModal"
            :is-editing="isEditing"
            :current-role="currentRole"
            :available-permissions="availablePermissions"
            @save="saveRole"
            @close="closeModal"
          />
        </div>
      </div>
      <div
        class="tab-pane fade"
        id="broadcast"
        role="tabpanel"
        aria-labelledby="broadcast-tab"
      >
        <div class="mt-4 pe-3 bg-white rounded-3 p-3 me-2">
          <button class="btn btn-primary mb-3" @click="OpenCreateModal">
            {{ $t("settings-broadcast-button-add") }}
          </button>
          <EasyDataTable
            :headers="headersBroadcast"
            :items="itemsBroadcast"
            :rows-per-page="10"
            table-class-name="custom-table"
          >
            <!-- Id Column -->
            <template #item-id="item">
              <div class="text-muted fs-6">{{ item.id }}</div>
            </template>
            <!-- Role Name Column -->
            <template #item-description="item">
              <div class="fs-6">
                {{
                  item.description.length > 50
                    ? item.description.substring(0, 40) + "..."
                    : item.description
                }}
              </div>
            </template>

            <!--  Create At Column -->
            <template #item-created_at="item">
              <div class="">
                <div class="fs-6">
                  {{ new Date(item.created_at).toLocaleDateString() }}
                </div>
              </div>
            </template>

            <!-- Important -->
            <template #item-important="item">
              <div class="d-flex gap-2 my-1 form-check form-switch">
                <input
                  class="form-check-input shadow-none custom-switch"
                  type="checkbox"
                  :checked="item.important"
                  @change="updateImportant(item.id)"
                />
              </div>
            </template>

            <!-- Status -->
            <template #item-status="item">
              <div class="d-flex gap-2 my-1 form-check form-switch">
                <input
                  class="form-check-input shadow-none custom-switch"
                  type="checkbox"
                  :checked="item.status"
                  @change="changeStatus(item.id)"
                />
              </div>
            </template>

            <!-- Positions Column -->
            <template #item-positions="item">
              <div class="d-flex gap-2 my-1">
                <button
                  :class="`btn btn-sm btn-${
                    item.is_first ? 'secondary' : 'success'
                  }`"
                  @click="updatePosition(item.id, -1)"
                  :disabled="item.is_first"
                >
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button
                  :class="`btn btn-sm btn-${
                    item.is_last ? 'secondary' : 'warning'
                  }`"
                  @click="updatePosition(item.id, 1)"
                  :disabled="item.is_last"
                >
                  <i class="fas fa-arrow-down"></i>
                </button>
              </div>
            </template>

            <!-- Actions Column -->
            <template #item-actions="item">
              <div class="d-flex gap-2 my-1">
                <button class="btn btn-sm btn-primary">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  :disabled="item.name === 'Admin'"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </template>
            <!-- Loading -->
            <template #loading>
              <div class="text-center loading-container">
                <div class="position-relative d-inline-block">
                  <img
                    :src="logo"
                    class="loading-logo"
                    style="width: 50px; height: 50px"
                  />
                </div>
                <div class="mt-2 text-primary">{{ $t("tables-loading") }}</div>
              </div>
            </template>
          </EasyDataTable>
        </div>
        <broadcast-message-create-modal
          @submit="submit"
          @close-modal="closeCreateModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
// import { useToast } from "vue-toastification";
import { showSuccess, showError } from "@/plugins/services/toastService";

import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import defaultImage from "@/assets/new-nokta-logo.png";
import { useI18n } from "vue-i18n";
import { ref, computed, onMounted, onUnmounted } from "vue";
import EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import { Modal } from "bootstrap";
import RoleSettingsViewAddEditRoleModal from "@/components/modals/RoleSettingsViewAddEditRoleModal.vue";
import Swal from "sweetalert2";
import {
  createBroadcast,
  getBroadcasts,
  updateBroadcast,
  updateBroadcastPosition,
} from "@/plugins/services/broadcastService";
import BroadcastMessageCreateModal from "@/components/modals/BroadcastSettingsViewMessageCreateModal.vue";
export default {
  name: "GeneralSettingView",
  components: {
    Multiselect,
    EasyDataTable,
    RoleSettingsViewAddEditRoleModal,
    BroadcastMessageCreateModal,
  },

  setup() {
    const { t } = useI18n();
    // const toast = useToast();
    const search = ref("");
    // const tableLoading = ref(false);
    const items = ref([]);
    const staticRoles = [
      {
        id: 1,
        name: "Admin",
        permissions: [
          "dashboard",
          "deals-kanban",
          "deals-list",
          "users",
          "contacts",
          "documents",
          "general-settings",
          "tasks-kanban",
          "roles-settings",
        ],
        create_at: "2024-03-20",
      },
      {
        id: 2,
        name: "User",
        permissions: [
          "dashboard",
          "deals-kanban",
          "deals-list",
          "users",
          "contacts",
          "documents",
          "general-settings",
          "tasks-kanban",
          "roles-settings",
        ],
        create_at: "2024-03-20",
      },
      {
        id: 3,
        name: "Sales",
        permissions: [
          "dashboard",
          "deals-kanban",
          "deals-list",
          "users",
          "contacts",
          "documents",
          "general-settings",
          "tasks-kanban",
          "roles-settings",
        ],
        create_at: "2024-03-20",
      },
    ];

    const headers = [
      { text: "#", value: "id" },
      { text: t("settings-role-table-header-name"), value: "name" },
      { text: t("settings-role-table-header-created-at"), value: "create_at" },
      { text: t("settings-role-table-header-actions"), value: "actions" },
    ];

    const availablePermissions = [
      "dashboard",
      "deals-kanban",
      "deals-list",
      "users",
      "contacts",
      "documents",
      "general-settings",
      "tasks-kanban",
      "roles-settings",
    ];

    const currentRole = ref({
      name: "",
      permissions: [],
      create_at: new Date().toISOString().split("T")[0],
    });

    const loadData = async () => {
      // tableLoading.value = true;
      try {
        // const response = await getRoles()
        // items.value = response.data

        items.value = staticRoles;
        // toast.success("تم تحميل الأدوار بنجاح", {
        //   timeout: 3000,
        // });
      } catch (error) {
        console.error("Error loading roles:", error);
        showError(t("error.loadFailedRoles"), {
          timeout: 3000,
        });
        items.value = [];
      } finally {
        // tableLoading.value = false;
      }
    };

    const filteredItems = computed(() => {
      return items.value.filter((role) =>
        role.name.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const isEditing = ref(false);
    const roleModal = ref(null);
    const modal = ref(null);

    const handleRightClick = (event) => {
      event.preventDefault();
      modal.value?.hide();
    };

    onMounted(async () => {
      // loadingStore.startLoading();
      await loadData();
      modal.value = new Modal(document.getElementById("roleModal"));
      // loadingStore.stopLoading();

      window.addEventListener("contextmenu", handleRightClick);
    });

    onUnmounted(() => {
      window.removeEventListener("contextmenu", handleRightClick);
    });

    const openModal = (role = null) => {
      try {
        if (role) {
          currentRole.value = {
            ...role,
            permissions: [...role.permissions],
          };
          isEditing.value = true;
        } else {
          currentRole.value = {
            name: "",
            permissions: [],
            create_at: new Date().toISOString().split("T")[0],
          };
          isEditing.value = false;
        }
        modal.value?.show();
      } catch (error) {
        console.error("Error opening modal:", error);
        showError(t("error.openModal"), {
          timeout: 3000,
        });
      }
    };

    const saveRole = async (role) => {
      try {
        if (!role.name?.trim()) {
          showError(t("roleSettings.requiredRoleName"), {
            timeout: 3000,
          });
          return;
        }

        if (role.permissions.length === 0) {
          showError(t("roleSettings.requiredPermission"), {
            timeout: 3000,
          });
          return;
        }

        if (isEditing.value) {
          const index = items.value.findIndex((r) => r.id === role.id);
          if (index !== -1) {
            items.value[index] = {
              ...items.value[index],
              ...role,
              permissions: [...role.permissions],
            };
            showSuccess(t("success.updated"), {
              timeout: 3000,
            });
          }
        } else {
          const newId = Math.max(...items.value.map((r) => r.id), 0) + 1;
          items.value.push({
            id: newId,
            ...role,
            permissions: [...role.permissions],
          });
          showSuccess(t("success.saved"), {
            timeout: 3000,
          });
        }
        modal.value?.hide();
      } catch (error) {
        console.error("Error saving role:", error);
        showError(t("error.saveFailed"), {
          timeout: 3000,
        });
      }
    };

    const deleteRole = async (id) => {
      try {
        const result = await Swal.fire({
          title: t("error.deleteTitle"),
          text: t("error.deleteText"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: t("success.deleteConfirm"),
          cancelButtonText: t("error.deleteCancel"),
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          const index = items.value.findIndex((r) => r.id === id);
          if (index !== -1) {
            items.value.splice(index, 1);
            showSuccess(t("success.deleted"), {
              timeout: 3000,
            });
          }
        }
      } catch (error) {
        console.error("Error deleting role:", error);
        showError(t("error.deleteFailed"), {
          timeout: 3000,
        });
      }
    };

    const editRole = (role) => {
      if (role.name === "Admin") {
        showError(t("roleSettings.cannotEditAdmin"), {
          timeout: 3000,
        });
        return;
      }
      openModal(role);
    };

    const closeModal = () => {
      modal.value?.hide();
    };
    // broadcast
    const itemsBroadcast = ref([]);
    const headersBroadcast = ref([
      { text: `#`, value: "id" },
      { text: t("settings-broadcast-table-description"), value: "description" },
      { text: t("settings-broadcast-table-createdat"), value: "created_at" },
      {
        text: t("settings-broadcast-table-important"),
        value: "important",
      },
      {
        text: t("settings-broadcast-table-status"),
        value: "status",
      },
      {
        text: t("settings-broadcast-table-positions"),
        value: "positions",
        sortable: false,
      },
      {
        text: t("settings-broadcast-table-actions"),
        value: "actions",
        sortable: false,
      },
    ]);

    const fetchBroadcasts = async () => {
      const response = await getBroadcasts();
      if (response.status === 200) {
        itemsBroadcast.value = response.data.data.map((item, index) => ({
          ...item,
          is_first: index === 0,
          is_last: index === response.data.data.length - 1,
        }));
        showSuccess(response.data.message);
      } else {
        // Handle error response
        showError("Failed to fetch broadcasts");
      }
    };

    const updatePosition = async (id, direction) => {
      // Logic to update position
      const response = await updateBroadcastPosition(id, direction);
      if (response.status === 200) {
        showSuccess(response.data.message);
        fetchBroadcasts();
      } else {
        showError("Failed to update position");
      }
    };

    const changeStatus = async (id) => {
      // Logic to change status
      const broadcast = itemsBroadcast.value.find((item) => item.id === id);
      if (broadcast) {
        broadcast.status = broadcast.status ? 0 : 1;
        const response = await updateBroadcast(id, null, broadcast.status);
        if (response.status === 200) {
          showSuccess(response.data.message);
        } else {
          showError("Failed to update status");
        }
      }
    };

    const updateImportant = async (id) => {
      // Logic to update important status
      const broadcast = itemsBroadcast.value.find((item) => item.id === id);
      if (broadcast) {
        broadcast.important = broadcast.important ? 0 : 1;
        const response = await updateBroadcast(
          id,
          null,
          null,
          broadcast.important
        );
        if (response.status === 200) {
          showSuccess(response.data.message);
        } else {
          showError("Failed to update important status");
        }
      }
    };

    const OpenCreateModal = () => {
      const item = document.getElementById("broadcastMessageCreateModal");
      if (!item) {
        console.error("Modal element not found");
        return;
      }
      const modal = new Modal(item);
      modal.show();
    };

    const closeCreateModal = () => {
      const item = document.getElementById("broadcastMessageCreateModal");
      if (!item) {
        console.error("Modal element not found");
        return;
      }
      try {
        const modal = Modal.getInstance(item) || new Modal(item);
        modal.hide();
      } catch (error) {
        console.error("Failed to close modal:", error);
      }
    };

    const submit = async (description) => {
      // Logic to submit the form
      const response = await createBroadcast(description);
      if (response.status === 200) {
        showSuccess(response.data.message);
        fetchBroadcasts();
      } else {
        showError("Failed to create broadcast");
      }
      closeCreateModal();
    };
    onMounted(() => {
      fetchBroadcasts();
    });
    const logo = require("@/assets/" + process.env.VUE_APP_LOGO_NAME);
    return {
      logo,
      search,
      headers,
      filteredItems,
      // tableLoading,
      currentRole,
      isEditing,
      availablePermissions,
      roleModal,
      openModal,
      saveRole,
      deleteRole,
      editRole,
      closeModal,
      loadData,
      t,
      // toast,
      itemsBroadcast,
      fetchBroadcasts,
      headersBroadcast,
      updatePosition,
      changeStatus,
      updateImportant,
      OpenCreateModal,
      closeCreateModal,
      submit,
    };
  },

  data() {
    return {
      settings: {
        appName: "CRM Staging",
        planExpireDays: 6,
        defaultCountry: {
          label: "Turkey (Türkiye)",
          value: "TR",
          flag: "https://flagcdn.com/w20/tr.png",
          dialCode: "90",
        },

        currency: { label: "United States Dollar", value: "USD", symbol: "$" },
        enableRecaptcha: false,
        googleCaptchaKey: "",
        googleCaptchaSecret: "",
        language: { label: "English", value: "en" },
        manualInstruction: "manual instruction",
        appLogo: defaultImage,
        favicon: defaultImage,
      },

      currencies: [
        { label: "United States Dollar", value: "USD", symbol: "$" },
        { label: "Euro", value: "EUR", symbol: "€" },
        { label: "British Pound", value: "GBP", symbol: "£" },
        { label: "Japanese Yen", value: "JPY", symbol: "¥" },
        { label: "Turkish Lira", value: "TRY", symbol: "₺" },
        { label: "Indian Rupee", value: "INR", symbol: "₹" },
        { label: "Chinese Yuan", value: "CNY", symbol: "¥" },
      ],

      languages: [
        { label: "English", value: "en" },
        { label: "Turkish", value: "tr" },
        { label: "Arabic", value: "ar" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Spanish", value: "es" },
        { label: "Chinese", value: "zh" },
      ],

      countries: [
        {
          value: "TR",
          label: "Turkey (Türkiye)",
          flag: "https://flagcdn.com/w20/tr.png",
          dialCode: "90",
        },

        {
          value: "TO",
          label: "Tonga",
          flag: "https://flagcdn.com/w20/to.png",
          dialCode: "676",
        },

        {
          value: "TT",
          label: "Trinidad and Tobago",
          flag: "https://flagcdn.com/w20/tt.png",
          dialCode: "1",
        },

        {
          value: "TN",
          label: "Tunisia (تونس)",
          flag: "https://flagcdn.com/w20/tn.png",
          dialCode: "216",
        },
      ],
    };
  },

  methods: {
    saveSettings() {
      try {
        if (!this.settings.appName?.trim()) {
          showError(this.$t("error.required"), {
            timeout: 3000,
          });
          return;
        }

        if (!this.settings.planExpireDays) {
          showError(this.$t("error.requiredplanExpireDays"), {
            timeout: 3000,
          });
          return;
        }

        if (!this.settings.defaultCountry) {
          showError(this.$t("error.requiredDefaultCountry"), {
            timeout: 3000,
          });
          return;
        }

        if (!this.settings.currency) {
          showError(this.$t("error.requiredCurrency"), {
            timeout: 3000,
          });
          return;
        }

        if (this.settings.enableRecaptcha) {
          if (!this.settings.googleCaptchaKey?.trim()) {
            showError(this.$t("error.requiredGoogleCaptchaKey"), {
              timeout: 3000,
            });
            return;
          }
          if (!this.settings.googleCaptchaSecret?.trim()) {
            showError(this.$t("error.requiredGoogleCaptchaSecret"), {
              timeout: 3000,
            });
            return;
          }
        }
        showSuccess(this.$t("success.saved"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error saving settings:", error);
        showError(this.$t("error.saveFailed"), {
          timeout: 3000,
        });
      }
    },

    handleLogoUpload(event) {
      try {
        const file = event.target.files[0];
        if (file) {
          if (!file.type.startsWith("image/")) {
            showError(this.$t("error.invalidFile"), {
              timeout: 3000,
            });
            return;
          }
          this.settings.appLogo = URL.createObjectURL(file);
          showSuccess(this.$t("success.updatedAppLogo"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        showError(this.$t("error.uploadFailed"), {
          timeout: 3000,
        });
      }
    },

    handleFaviconUpload(event) {
      try {
        const file = event.target.files[0];
        if (file) {
          if (!file.type.startsWith("image/")) {
            showError(this.$t("error.invalidFile"), {
              timeout: 3000,
            });
            return;
          }
          this.settings.favicon = URL.createObjectURL(file);
          showSuccess(this.$t("success.updatedFavicon"), {
            timeout: 3000,
          });
        }
      } catch (error) {
        console.error("Error uploading favicon:", error);
        showError(this.$t("error.uploadFaviconFailed"), {
          timeout: 3000,
        });
      }
    },
  },

  watch: {
    "settings.enableRecaptcha"(newValue) {
      if (!newValue) {
        this.settings.googleCaptchaKey = "";
        this.settings.googleCaptchaSecret = "";
      }
    },
  },

  computed: {
    selectedCountryText() {
      if (!this.settings.defaultCountry) return "";

      if (typeof this.settings.defaultCountry === "object") {
        return `${this.settings.defaultCountry.label} +${this.settings.defaultCountry.dialCode}`;
      }

      const country = this.countries.find(
        (c) => c.value === this.settings.defaultCountry
      );
      if (!country) return "";
      return `${country.label} +${country.dialCode}`;
    },
  },
};
</script>

<style scoped>
.allSetting {
  max-height: 90vh;
  overflow-y: auto;
}
.form-check-input:checked {
  background-color: #a23737 !important;
  border-color: #a23737 !important;
  box-shadow: none !important;
}
input:focus {
  box-shadow: none !important;
  border-color: #eee !important;
}

.country-flag {
  width: 20px;
  height: 15px;
  object-fit: cover;
}
.custom-switch {
  width: 2.5rem !important;
  height: 1.4rem !important;
}
.image-upload-container {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.current-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #f8f9fa;
}

.edit-icon {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.current-image:hover .edit-icon {
  opacity: 1;
}

.country-flag-container {
  position: static;
  width: 100px;
  cursor: pointer;
}

.country-select {
  width: 100px !important;
  min-width: 100px !important;
}

.country-select:deep(.multiselect) {
  position: static !important;
}

.country-select:deep(.multiselect__tags) {
  border-right: 1px solid #ced4da !important;
  min-height: 38px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background-color: #eee !important;
}

.country-select:deep(.multiselect__content-wrapper) {
  position: absolute;
  width: calc(100% + 200px) !important;
  left: 0;
  margin-top: 4px;
  z-index: 1000;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.country-select:deep(.multiselect__single) {
  background-color: #eee !important;
}
.selected-country {
  padding-right: 20px;
  font-size: 14px;
  height: 24px !important;
  max-height: 24px !important;
}

.country-select:deep(.multiselect__select) {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 0 8px;
}

.custom-table {
  border-radius: 10px;
  overflow: hidden;
}

.loading-logo {
  animation: pulse-and-spin 2s infinite linear;
  z-index: 2;
}

@keyframes pulse-and-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
button.active {
  color: #a55656db !important;
}
.nav-link.active {
  border-top: 1px solid #a55656db !important;
  border-right: 1px solid #a55656db !important;
  border-left: 1px solid #a55656db !important;
}
</style>
