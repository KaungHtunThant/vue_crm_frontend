<template>
  <div
    class="modal fade"
    id="searchIpadModal"
    tabindex="-1"
    aria-labelledby="searchIpadModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="searchIpadModalLabel">Search</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSearch">
            <input type="search" class="form-control" />
            <div class="modal-footer d-flex justify-content-between px-0">
              <button type="submit" class="btn btn-success text-white">
                Search
              </button>
              <button
                type="button"
                class="btn btn-danger text-white"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
export default {
  name: "CrmKanbanTopHeaderSearchModalIpad",
  setup() {
    const { t } = useI18n();

    return {
      t,
    };
  },
};
</script>
