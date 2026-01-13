<template>
  <div
    class="modal fade"
    id="customBackgroundModal"
    tabindex="-1"
    aria-labelledby="exportModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exportModalLabel">
            {{ t("header-user-menu-item-background") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div v-show="loading" class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-show="!loading" class="row overflow-auto background-container">
            <div
              class="col-4 mb-3"
              v-for="(image, index) in images"
              :key="index"
            >
              <div
                class="background-thumbnail position-relative"
                :style="{ backgroundImage: `url(${image.url})` }"
                @click="selectBackground(image.id)"
              >
                <div class="selected-overlay" v-if="isSelected(image.url)">
                  <i class="fas fa-check"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
            @click="closeModal"
          >
            {{ t("kanban-modal-import-button-close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { Modal } from "bootstrap";
// import { useToast } from "vue-toastification";
// import { showSuccess, showError } from "@/plugins/services/toastService";
import { useNotificationStore } from "@/stores/notificationStore";

import { useI18n } from "vue-i18n";
import {
  getBackgroundImages,
  saveBackgroundId,
} from "@/plugins/services/backgroundService";

export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalCustmBackgroundModal",
  setup() {
    const notificationStore = useNotificationStore();
    const { t } = useI18n();
    // const toast = useToast();
    const images = ref([]);
    const loading = ref(false);

    const currentBackground = computed(() => {
      return localStorage.getItem("backgroundImage") || "";
    });

    const isSelected = (url) => {
      return currentBackground.value === url;
    };

    const fetchImages = async () => {
      try {
        loading.value = true;
        const response = await getBackgroundImages();
        images.value = [...response.data.data]; // Ensure reactivity by spreading the array
      } catch (error) {
        console.error(error);
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      const modal = Modal.getInstance(
        document.getElementById("customBackgroundModal")
      );
      modal?.hide();
      document.querySelector(".modal-backdrop")?.remove();
      document.body.classList.remove("modal-open");
    };

    const selectBackground = async (imageId) => {
      try {
        const response = await saveBackgroundId(imageId);
        let imageUrl = response.data.data.url;
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";

        localStorage.setItem("backgroundImage", imageUrl);
        localStorage.setItem("backgroundImage_id", response.data.data.id);

        if (response.status === 200 || response.status === 201) {
          notificationStore.success(response.data.message, {
            timeout: 3000,
          });
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        notificationStore.error(error.message, {
          timeout: 3000,
        });
      }
    };

    const openModal = async () => {
      await fetchImages();
      const modal = new Modal(document.getElementById("customBackgroundModal"));
      modal.show();
    };

    onMounted(() => {
      fetchImages();
    });

    return {
      images,
      loading,
      selectBackground,
      isSelected,
      closeModal,
      openModal,
      t,
    };
  },
};
</script>
<style scoped>
.background-thumbnail {
  width: 100%;
  height: 100px;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.background-thumbnail:hover {
  border-color: #0d6efd;
  transform: scale(1.05);
}

.selected-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}
.background-container {
  max-height: 75vh;
}
</style>
