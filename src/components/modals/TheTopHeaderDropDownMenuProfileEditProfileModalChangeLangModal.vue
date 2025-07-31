<template>
  <div
    class="modal fade"
    id="changeLangModal"
    tabindex="-1"
    aria-labelledby="changeLangModalLabel"
    aria-hidden="true"
    ref="changeLangModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("changeLanguage") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <form @submit.prevent="submitForm">
          <div class="modal-body">
            <select v-model="selectedLang" class="form-select">
              <option value="ar">🇸🇦 العربية</option>
              <option value="en">🇺🇸 English</option>
              <option value="ur">🇵🇰 اردو</option>
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="ru">🇷🇺 Русский</option>
            </select>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="changeLang"
            >
              {{ $t("save") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ref, onMounted } from "vue";
import { changeLanguage } from "@/i18n";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { useLoadingStore } from "@/plugins/loadingStore";
import { saveUserLanguage } from "@/plugins/services/authService";

export default {
  name: "TheTopHeaderDropDownMenuProfileEditProfileModalChangeLangModal",
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const loadingStore = useLoadingStore();
    const selectedLang = ref(localStorage.getItem("locale") || "en");
    const modalInstance = ref(null);

    onMounted(() => {
      const modal = document.getElementById("changeLangModal");
      modalInstance.value = new Modal(modal);
    });

    const openChangeLang = () => {
      try {
        modalInstance.value.show();
      } catch (error) {
        toast.error(t("error.openModal"), {
          timeout: 3000,
          id: "change-lang-open-error",
          singleton: true,
        });
      }
    };

    const handleLanguageChange = async () => {
      try {
        loadingStore.startLoading();

        await changeLanguage(selectedLang.value);

        const response = await saveUserLanguage(selectedLang.value);
        if (response.status === 200) {
          localStorage.setItem("locale", selectedLang.value);
          toast.success(t("languageChanged"), { timeout: 3000 });
        } else {
          throw new Error("Failed to save language in API");
        }
      } catch (error) {
        console.error("Error changing language:", error);
        toast.error(t("error.savingLanguage"), { timeout: 3000 });
      } finally {
        loadingStore.stopLoading();
      }
    };

    const changeLang = () => {
      handleLanguageChange();
    };

    return {
      selectedLang,
      openChangeLang,
      changeLang,
      t,
    };
  },
};
</script>
