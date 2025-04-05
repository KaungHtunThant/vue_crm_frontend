<template>
  <div class="mt-4">
    <TopHeader2
      :initial-filters="filters"
      @filter-applied="applyFilters"
      @reset-filter="resetFilter"
    />
  </div>
  <div class="watsappIcon position-absolute z-3">
    <button class="position-relative fs-5 rounded-2" @click="openWhatsappModal">
      <p class="position-absolute">{{ $t("kanban-modal-edit-whatsapp") }}</p>
      <div class="text-white"><i class="fa-brands fa-whatsapp"></i></div>
    </button>
  </div>
  <KanbanBoard :stages="stages" defaultColor="#333" />
  <WhatsappModal ref="whatsappModalRef" />
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import TopHeader2 from "@/components/headers/TopHeader2.vue";
import KanbanBoard from "@/components/kanban/KanbanBoard.vue";
import { kanbanStages } from "@/plugins/stages";
import { Modal } from "bootstrap";
import WhatsappModal from "@/components/modals/WhatsappModal.vue";
import { useToast } from "vue-toastification";
import { useI18n } from "vue-i18n";
import { initializeWebSocket, closeWebSocket } from "@/plugins/websocket";

export default {
  name: "CrmKanban",
  components: {
    TopHeader2,
    KanbanBoard,
    WhatsappModal,
  },
  setup() {
    const { t } = useI18n();
    const toast = useToast();
    const stages = ref(kanbanStages);
    const whatsappModalRef = ref(null);

    const filters = ref({
      source: "",
      stage: "",
      supervisor: "",
      representative: "",
      package: "",
      createdStart: "",
      createdEnd: "",
      modifiedStart: "",
      modifiedEnd: "",
      status: [],
    });

    const applyFilters = async (newFilters) => {
      try {
        filters.value = { ...newFilters };
        // toast.success("تم تطبيق الفلتر بنجاح", {
        //   timeout: 3000,
        // });
      } catch (error) {
        console.error("Error applying filters:", error);
        toast.error(t("error.applyFilters"), {
          timeout: 3000,
        });
      }
    };

    const resetFilter = async () => {
      try {
        filters.value = {
          source: "",
          stage: "",
          supervisor: "",
          representative: "",
          package: "",
          createdStart: "",
          createdEnd: "",
          modifiedStart: "",
          modifiedEnd: "",
          status: [],
        };
        toast.success(t("success.resetFilters"), {
          timeout: 3000,
        });
      } catch (error) {
        console.error("Error resetting filters:", error);
        toast.error(t("error.resetFilters"), {
          timeout: 3000,
        });
      }
    };

    const handleRightClick = (event) => {
      event.preventDefault();
      const modalElements = document.querySelectorAll(".modal");
      modalElements.forEach((modal) => {
        if (modal.classList.contains("show")) {
          const closeButton = modal.querySelector('[data-bs-dismiss="modal"]');
          if (closeButton) {
            closeButton.click();
          }
        }
      });
    };

    const openWhatsappModal = () => {
      try {
        const modal = new Modal(document.getElementById("whatsappModal"));
        modal.show();
        // toast.info("يمكنك إرسال رسالة واتساب", {
        //   timeout: 3000,
        // });
      } catch (error) {
        console.error("Error opening WhatsApp modal:", error);
        toast.error(t("error.openWhatsappModal"), {
          timeout: 3000,
        });
      }
    };

    onMounted(async () => {
      try {
        window.addEventListener("contextmenu", handleRightClick);
        // toast.success("تم تحميل لوحة كانبان بنجاح", {
        //   timeout: 3000,
        // });
        // Initialize WebSocket connection
        await initializeWebSocket();
        // Listen for WebSocket events
        window.Echo.channel("super-admin").listen("DealEvent", (data) => {
          console.log(data.message);
        });
      } catch (error) {
        console.error("Error mounting component:", error);
        toast.error(t("error.loadKanban"), {
          timeout: 3000,
        });
      }
    });

    onUnmounted(() => {
      // Unsubscribe from WebSocket events
      window.removeEventListener("contextmenu", handleRightClick);
      // Close WebSocket connection
      window.Echo.leave("super-admin");
      closeWebSocket();
    });

    return {
      stages,
      filters,
      applyFilters,
      resetFilter,
      openWhatsappModal,
      whatsappModalRef,
    };
  },
};
</script>

<style scoped>
.watsappIcon {
  bottom: 4%;
  right: 3%;
}

button {
  border: 2px solid #25d366;
  width: 6.8em;
  height: 2em;
  transition: 0.5s;
  background: #f6f5f5;
}

button p {
  top: 0.2em;
  left: 1.15em;
  transition: 0.5s;
  color: #25d366;
}

button i {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  opacity: 0;
  transition: 0.5s;
  height: 1em;
}

button:hover p {
  left: 0.5em;
  color: #fff;
}

button:hover i {
  opacity: 1;
}

button:hover {
  background-color: #25d366;
}
</style>
