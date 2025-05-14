<template>
  <div class="modal-body">
    <div class="row">
      <div class="col-12">
        <div class="mb-3">
          <label for="file" class="form-label">{{
            t("kanban-modal-import-label-file")
          }}</label>
          <input
            type="file"
            class="form-control"
            id="file"
            @change="handleFileChange"
            accept=".xlsx,.xls,.csv"
          />
          <small class="text-muted"> Allowed file types: .xlsx </small>
          <div v-if="fileError" class="text-danger mt-1">
            {{ fileError }}
          </div>
        </div>
      </div>
      <div v-if="isFileValid" class="chooseHeader">
        <div class="col-12">
          <div class="mb-3">
            <label for="description" class="form-label">
              {{ t("kanban-modal-import-label-description") }}
            </label>
            <select v-model="description" class="text-secondary form-select">
              <option value="" disabled selected>
                {{ t("kanban-modal-import-placeholder-description") }}
              </option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="source" class="form-label">
              {{ t("kanban-modal-import-label-source") }}
            </label>
            <select v-model="source" class="text-secondary form-select">
              <option value="" disabled selected>
                {{ t("kanban-modal-import-placeholder-source") }}
              </option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="name" class="form-label">
              {{ t("kanban-modal-import-label-name") }}
            </label>
            <select v-model="name" class="text-secondary form-select">
              <option value="" disabled selected>
                {{ t("kanban-modal-import-placeholder-name") }}
              </option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="phone" class="form-label">
              {{ t("kanban-modal-import-label-phone") }}
            </label>
            <select v-model="phone" class="text-secondary form-select">
              <option value="" disabled selected>
                {{ t("kanban-modal-import-placeholder-phone") }}
              </option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-12">
          <div class="mb-3">
            <label for="comment" class="form-label">
              {{ t("kanban-modal-import-label-comment") }}
            </label>
            <select v-model="comment" class="text-secondary form-select">
              <option value="" disabled selected>
                {{ t("kanban-modal-import-placeholder-comment") }}
              </option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        <!-- <div class="col-12">
          <div class="mb-3">
            <label for="address" class="form-label">
              {{ t("modals.address") }}
            </label>
            <select v-model="address" class="text-secondary form-select">
              <option value="" disabled selected>
                {{ t("modals.select_header") }}
              </option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div> -->
        <div class="col-12">
          <div class="mb-3">
            <label for="email" class="form-label">
              {{ t("kanban-modal-import-label-email") }}
            </label>
            <select v-model="email" class="text-secondary form-select">
              <option value="" disabled selected>
                {{ t("kanban-modal-import-placeholder-email") }}
              </option>
              <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getSources } from "@/plugins/services/authService";
import * as XLSX from "xlsx";
import { useI18n } from "vue-i18n";
export default {
  name: "ImportForm",
  setup() {
    const { t } = useI18n();
    const fileError = ref("");
    const isFileValid = ref(false);
    const sources = ref([]);
    const source = ref("");
    const name = ref("");
    const description = ref("");
    const dateOfBirth = ref("");
    const phone = ref("");
    const comment = ref("");
    const address = ref("");
    const email = ref("");
    const options = ref([]);
    const fileInput = ref(null);
    // get sources api
    const fetchSources = async () => {
      try {
        const response = await getSources();
        if (response.status === 200) {
          sources.value = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching sources:", error);
      }
    };

    // handle file change
    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const allowedTypes = [
          // "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          // "text/csv",
        ];

        if (!allowedTypes.includes(file.type)) {
          fileError.value = "Please select only Excel or CSV files";
          event.target.value = "";
          isFileValid.value = false;
          return;
        }

        const fileName = file.name.toLowerCase();
        if (
          !fileName.endsWith(".xlsx") &&
          !fileName.endsWith(".xls") &&
          !fileName.endsWith(".csv")
        ) {
          fileError.value = "Please select only Excel or CSV files";
          event.target.value = "";
          isFileValid.value = false;
          return;
        }

        try {
          fileInput.value = file;
          const headers = await getFileHeaders(file);
          options.value = headers;
          fileError.value = "";
          isFileValid.value = true;
        } catch (error) {
          console.error("Error reading file headers:", error);
          fileError.value = "Error reading file headers";
          isFileValid.value = false;
        }
      }
    };

    // get file headers
    const getFileHeaders = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const headers = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
            })[0];

            const headerOptions = headers.map((header) => ({
              value: header,
              label: header,
            }));

            resolve(headerOptions);
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = (error) => reject(error);

        if (file.type === "text/csv") {
          reader.readAsText(file);
        } else {
          reader.readAsBinaryString(file);
        }
      });
    };

    onMounted(() => {
      fetchSources();
    });

    return {
      fileInput,
      fileError,
      isFileValid,
      sources,
      options,
      source,
      name,
      description,
      dateOfBirth,
      phone,
      comment,
      address,
      email,
      handleFileChange,
      t,
    };
  },
};
</script>

<style scoped>
.chooseHeader {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
