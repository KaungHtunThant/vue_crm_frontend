<template>
  <div class="print-area py-4" :dir="direction">
    <!-- Header with Logo and Clinic Info -->
    <div class="d-flex justify-content-between align-items-start pb-1 mb-2">
      <div>
        <img
          src="@/assets/new-nokta-logo.png"
          class="img-fluid"
          style="height: 80px"
          alt="Nokta Urology Logo"
        />
      </div>
      <div class="text-end">
        <div
          :class="[
            'fw-bold',
            direction === 'ltr' ? 'float-end' : 'float-start',
          ]"
        >
          {{ t("print-case-clinic-name") }}
        </div>
        <br />
        <div
          :class="[
            'small text-muted fw-bold',
            direction === 'ltr' ? 'float-end' : 'float-start',
          ]"
        >
          {{ t("print-case-clinic-address") }} <br />
        </div>
        <div class="small text-muted fw-bold">
          noktaclinic.com | info@noktaclinic.com
        </div>
        <div
          :class="[
            'small text-muted fw-bold phone-number',
            direction === 'ltr' ? 'float-end' : 'float-start',
          ]"
        >
          +90 535 717 61 33
        </div>
      </div>
    </div>

    <!-- Patient Information Section -->
    <section class="mb-4">
      <h6 class="fw-bold fs-7">{{ t("print-case-patient-information") }}</h6>
      <table class="table table-bordered fs-8">
        <tbody>
          <tr class="table-secondary">
            <td>
              {{ t("print-case-patient-name") }}
              {{ deal?.contact?.name ?? "-" }}
            </td>
            <td>
              {{ t("print-case-patient-dateofbirth") }}
              <span dir="ltr" class="d-inline-block">
                {{
                  deal?.contact?.dob
                    ? new Date(deal.contact.dob).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"
                }}
              </span>
            </td>
          </tr>
          <tr class="table-secondary">
            <td>
              {{ t("print-case-patient-address") }}
              {{ deal?.contact?.address ?? "-" }}
            </td>
            <td>
              {{ t("print-case-patient-marital-status") }}
              {{ deal?.contact?.marital_status ?? "-" }}
            </td>
          </tr>
          <tr class="table-secondary">
            <td>
              {{ t("print-case-patient-passport") }}
              {{ deal?.passport_number ?? "-" }}
            </td>
            <td>{{ t("print-case-patient-personal-companion") }} Yes / No</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Contact Information -->
    <section class="mb-4">
      <h6 class="fw-bold fs-7">
        {{ t("print-case-patient-contact-information") }}
      </h6>
      <table class="table table-bordered fs-8">
        <tbody>
          <tr class="table-secondary">
            <td>
              {{ t("print-case-patient-phone") }}
              <span dir="ltr" class="d-inline-block">
                {{ deal?.contact?.phones?.[0]?.phone ?? "-" }}
              </span>
            </td>
            <td>
              {{ t("print-case-patient-email") }}
              {{ deal?.contact?.email ?? "-" }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Initial Diagnosis -->
    <section class="mb-4">
      <h6 class="fw-bold fs-7">
        {{ t("print-case-patient-intial-diagnosis") }}
      </h6>
      <table class="table table-bordered fs-8">
        <tbody>
          <tr class="text-center surgical-border">
            <td colspan="3" class="bg-warning-subtle">
              {{ t("print-case-patient-surgical-nonsurgical") }}
            </td>
          </tr>
          <tr class="table-secondary">
            <td>Selection 1</td>
            <td>Selection 2</td>
            <td>Selection 3</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Treatment Package -->
    <section class="mb-5">
      <h6 class="fw-bold fs-7">
        {{ t("print-case-patient-treatment-package") }}
      </h6>
      <table class="table table-bordered fs-8 mb-1">
        <tbody>
          <tr
            v-for="pkg in deal?.kanban_packages"
            :key="pkg.id"
            class="table-success"
          >
            <td class="w-85">{{ pkg.name }}</td>
            <td class="text-center">{{ pkg.quantity }}</td>
          </tr>
        </tbody>
      </table>
      <div
        :class="[
          'bg-danger-subtle fw-bold mb-2 p-2 border border-dark w-25',
          direction === 'ltr' ? 'float-end' : 'float-start',
        ]"
      >
        $ {{ grandTotal }}
      </div>
    </section>

    <!-- Additional Services -->
    <section class="mb-5">
      <h6 class="fw-bold fs-7">
        {{ t("print-case-patient-additional-services") }}
      </h6>
      <table class="table table-bordered fs-8 mb-1">
        <tbody>
          <tr
            v-for="pkg in deal?.additional_services"
            :key="pkg.id"
            class="table-success"
          >
            <td class="w-85">{{ pkg.name }}</td>
            <td class="text-center">Days({{ pkg.days }})</td>
          </tr>
        </tbody>
      </table>
      <div
        :class="[
          'bg-danger-subtle fw-bold mb-2 p-2 border border-dark w-25',
          direction === 'ltr' ? 'float-end' : 'float-start',
        ]"
      >
        $ {{ deal?.add_on_total_cost || "0.00" }}
      </div>
    </section>

    <!-- Total -->
    <section class="mb-1">
      <div class="fw-bold fs-7 mt-4">
        {{ t("print-case-patient-total-vat") }}
        $
        {{
          (
            Number(deal?.add_on_total_cost ?? 0) + Number(grandTotal ?? 0)
          ).toFixed(2)
        }}
      </div>
    </section>

    <!-- Warranty -->
    <section class="">
      <table class="table table-bordered fs-8 mb-1">
        <tbody>
          <tr class="table-light text-center">
            <td class="w-50">
              {{ t("print-case-warranty") }} Provided / Not Provided
            </td>
            <td>{{ t("print-case-warranty-from") }} 00-00-0000</td>
            <td>{{ t("print-case-warranty-duedate") }} 00-00-0000</td>
          </tr>
        </tbody>
      </table>

      <div class="mt-0">
        <div class="text-danger fw-bold small mb-2">
          {{ t("print-case-warranty-notes-header") }}
        </div>
        <ul class="list-unstyled small mb-0 px-4 py-2">
          <li class="d-flex mb-1">
            <span class="me-2 px-2">{{ direction === "ltr" ? "→" : "←" }}</span>
            <span>{{ t("print-case-warranty-notes-1") }}</span>
          </li>
          <li class="d-flex mb-1">
            <span class="me-2 px-2">{{ direction === "ltr" ? "→" : "←" }}</span>
            <span>{{ t("print-case-warranty-notes-2") }}</span>
          </li>
          <li class="d-flex mb-1">
            <span class="me-2 px-2">{{ direction === "ltr" ? "→" : "←" }}</span>
            <span>{{ t("print-case-warranty-notes-3") }}</span>
          </li>
          <li class="d-flex mb-1">
            <span class="me-2 px-2">{{ direction === "ltr" ? "→" : "←" }}</span>
            <span>{{ t("print-case-warranty-notes-4") }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { showDeal } from "@/plugins/services/authService";

export default {
  data() {
    return {
      direction: "ltr",
      deal: null,
      loading: false,
      error: null,
    };
  },
  setup() {
    const { t } = useI18n();
    const route = useRoute();
    const dealId = ref(null);

    return {
      t,
      route,
      dealId,
    };
  },
  async mounted() {
    const locale = localStorage.getItem("locale") || "en";
    this.direction = ["ar", "ur"].includes(locale) ? "rtl" : "ltr";
    this.dealId = this.route.query.dealId || this.route.query.deal_id;

    if (this.dealId) {
      await this.fetchDealData(this.dealId);
    } else {
      console.error("No deal ID found in query params");
      console.log("Query params received:", this.route.query);
      this.error = "Deal ID not found";
    }
  },
  methods: {
    async fetchDealData(dealId) {
      try {
        this.loading = true;
        const response = await showDeal(dealId);
        this.deal = response.data.data;

        console.log("Fetched deal data:", this.deal);

        this.loading = false;
      } catch (error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);

        this.error = "Failed to fetch deal data: " + error.message;
        this.loading = false;
      }
    },
  },
  computed: {
    grandTotal() {
      if (!this.deal || !this.deal.kanban_packages) return 0;
      return this.deal.kanban_packages
        .reduce((sum, pkg) => sum + parseFloat(pkg.total_price), 0)
        .toFixed(2);
    },
  },
};
</script>
<style scoped>
@page {
  size: A4;
  margin: 5mm;
}

@media print {
  .print-area {
    padding: 15px !important;
  }
}
.fs-7 {
  font-size: 13px;
}
.fs-8 {
  font-size: 12px;
}
.fs-9 {
  font-size: 11px;
}
.w-85 {
  width: 85%;
}
.surgical-border td {
  border: 1px solid #63636386 !important;
}
.phone-number {
  text-align: left !important;
  direction: ltr !important;
  unicode-bidi: embed;
}
</style>
