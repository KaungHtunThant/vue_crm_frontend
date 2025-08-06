<template>
  <div class="mt-4 me-2 bg-white p-4 rounded-3 allSetting">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis active"
          id="deal-reassignment-tab"
          data-bs-toggle="tab"
          data-bs-target="#deal_reassignment"
          type="button"
          role="tab"
          aria-controls="deal_reassignment"
          aria-selected="true"
        >
          {{ t("approvals-tab-label-deal-reassignment") }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis"
          id="idle-deal-assignment-tab"
          data-bs-toggle="tab"
          data-bs-target="#idle_deal_assignment"
          type="button"
          role="tab"
          aria-controls="idle_deal_assignment"
        >
          {{ t("approvals-tab-label-idle-deal-assignment") }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis"
          id="new-deal-creation-tab"
          data-bs-toggle="tab"
          data-bs-target="#new_deal_creation"
          type="button"
          role="tab"
          aria-controls="new_deal_creation"
        >
          {{ t("approvals-tab-label-new-deal-creation") }}
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link text-secondary-emphasis"
          id="suggest-user-tab"
          data-bs-toggle="tab"
          data-bs-target="#suggest_user"
          type="button"
          role="tab"
          aria-controls="suggest_user"
        >
          {{ t("approvals-tab-label-suggest-user") }}
        </button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="myTabContent">
      <div
        class="tab-pane fade show active"
        id="deal_reassignment"
        role="tabpanel"
        aria-labelledby="deal-reassignment-tab"
      >
        <approval-deal-reassignment-table />
      </div>
      <div
        class="tab-pane fade"
        id="idle_deal_assignment"
        role="tabpanel"
        aria-labelledby="idle_deal_assignment_tab"
      >
        <approval-idle-deal-assign-table />
      </div>
      <div
        class="tab-pane fade"
        id="new_deal_creation"
        role="tabpanel"
        aria-labelledby="new_deal_creation_tab"
      >
        <approval-new-deal-creation-table />
      </div>
      <div
        class="tab-pane fade"
        id="suggest_user"
        role="tabpanel"
        aria-labelledby="suggest_user_tab"
      >
        <approval-suggest-user-table />
      </div>
    </div>
  </div>
  <deal-data-card
    :key="selectedDeal?.id"
    :deal="selectedDeal"
    :logs="logs"
    :comments="comments"
    :tasks="tasks"
    @open-whatsapp-modal="openWhatsappModal"
    @stage-change="changeDealStage"
  />
</template>
<script>
import { useI18n } from "vue-i18n";
import ApprovalDealReassignmentTable from "@/components/ApprovalDealReassignmentTable.vue";
import ApprovalIdleDealAssignTable from "@/components/ApprovalIdleDealAssignTable.vue";
import ApprovalNewDealCreationTable from "@/components/ApprovalNewDealCreationTable.vue";
import ApprovalSuggestUserTable from "@/components/ApprovalSuggestUserTable.vue";
import DealDataCard from "@/components/modals/CrmDealKanbanDealDataModal.vue";
import { useApprovalStore } from "@/stores/approvalStore";
import { onMounted } from "vue";
export default {
  name: "ApprovalsView",
  components: {
    ApprovalDealReassignmentTable,
    ApprovalIdleDealAssignTable,
    ApprovalNewDealCreationTable,
    ApprovalSuggestUserTable,
    DealDataCard,
  },
  setup() {
    const { t } = useI18n();
    const approvalStore = useApprovalStore();
    const fetchApprovals = async () => {
      try {
        await approvalStore.fetchApprovals("", 1, 10);
      } catch (error) {
        console.error("Error fetching approvals:", error);
      }
    };

    onMounted(() => {
      fetchApprovals();
    });
    return {
      t,
      fetchApprovals,
    };
  },
};
</script>
