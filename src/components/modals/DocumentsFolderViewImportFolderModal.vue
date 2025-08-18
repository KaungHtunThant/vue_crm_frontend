<template>
  <div class="modal fade" id="importFolderModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t("documents-modal-importdocument-heading") }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="upload-area p-4 text-center">
            <div
              class="dropzone"
              @dragover.prevent
              @drop.prevent="handleDrop"
              @click="$refs.fileInput.click()"
            >
              <i class="fas fa-folder-open mb-3" style="font-size: 48px"></i>
              <p class="text-muted mb-3">
                {{ t("documents-modal-importdocument-placeholder") }}
              </p>
              <input
                type="file"
                webkitdirectory
                directory
                multiple
                class="d-none"
                ref="fileInput"
                @change="handleFileSelect"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger text-white"
            data-bs-dismiss="modal"
          >
            {{ t("documents-modal-importdocument-button-close") }}
          </button>
          <button
            type="button"
            class="btn btn-success text-white"
            @click="handleImport"
            :disabled="!hasFiles"
          >
            {{ t("documents-modal-importdocument-button-submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
export default {
  name: "ImportFolderModal",
  emits: ["import"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const fileInput = ref(null);
    const selectedFiles = ref([]);

    const hasFiles = computed(() => selectedFiles.value.length > 0);

    const handleDrop = (event) => {
      const items = Array.from(event.dataTransfer.items);
      processItems(items);
    };

    const handleFileSelect = (event) => {
      selectedFiles.value = Array.from(event.target.files);
    };

    const handleImport = () => {
      if (!hasFiles.value) return;
      emit("import", selectedFiles.value);
      selectedFiles.value = [];
    };

    const processItems = async (items) => {
      selectedFiles.value = [];
      for (const item of items) {
        if (item.webkitGetAsEntry) {
          const entry = item.webkitGetAsEntry();
          if (entry.isDirectory) {
            await readDirectory(entry);
          }
        }
      }
    };

    const readDirectory = async (dirEntry) => {
      const reader = dirEntry.createReader();
      const entries = await new Promise((resolve) => {
        reader.readEntries(resolve);
      });

      for (const entry of entries) {
        if (entry.isFile) {
          const file = await new Promise((resolve) => {
            entry.file(resolve);
          });
          selectedFiles.value.push(file);
        } else if (entry.isDirectory) {
          await readDirectory(entry);
        }
      }
    };

    return {
      fileInput,
      hasFiles,
      handleDrop,
      handleFileSelect,
      handleImport,
      t,
    };
  },
};
</script>

<style scoped>
.dropzone {
  border: 2px dashed #ccc;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropzone:hover {
  border-color: #0d6efd;
  background: #f1f8ff;
}
</style>
