<template>
  <div class="print-area py-4" :dir="direction">
    <!-- Header with Logo and Clinic Info -->
    <div class="d-flex justify-content-between align-items-start pb-1 mb-2">
      <div>
        <img
          :src="logo"
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
              <span>
                {{
                  deal?.contact?.marital_status in maritalStatusList
                    ? maritalStatusList[deal.contact.marital_status]
                    : "-"
                }}
              </span>
            </td>
          </tr>
          <tr class="table-secondary">
            <td>
              {{ t("print-case-patient-passport") }}
              {{ deal?.passport_number ?? "-" }}
            </td>
            <td>
              {{ t("print-case-patient-personal-companion") }}
              <span>
                {{
                  deal?.contact?.companion in personalCompanionList
                    ? personalCompanionList[deal.contact.companion]
                    : "-"
                }}
              </span>
            </td>
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
            <td
              v-for="pkg in deal?.diagnoses"
              :key="pkg.id"
              class="text-center"
            >
              {{ pkg.name }} - {{ pkg.severity }}
            </td>
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
        $ {{ deal?.kanban_total_cost || "0.00" }}
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
              {{ t("print-case-warranty") }}
              <span class="fw-bold">
                {{
                  deal?.warranty in warrantyList
                    ? warrantyList[deal.warranty]
                    : t("Not provided")
                }}
              </span>
            </td>
            <td>
              {{ t("print-case-warranty-from") }} {{ formatDate(new Date()) }}
            </td>
            <td>
              {{ t("print-case-warranty-duedate") }}
              {{ formatDate(addDays(new Date(), 30)) }}
            </td>
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
import { ref, computed } from "vue";
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
    const { locale } = useI18n();

    const logo = require("@/assets/" + process.env.VUE_APP_LOGO_NAME);
    const warrantyOptions = {
      0: {
        en: " Not provided",
        ar: "غير متوفر",
        fr: "Non fourni",
      },
      1: {
        en: "Provided",
        ar: "متوفر",
        fr: "Fournie",
      },
    };
    const warrantyList = computed(() => {
      return Object.fromEntries(
        Object.entries(warrantyOptions).map(([key, value]) => [
          key,
          locale.value === "ar"
            ? value.ar
            : locale.value === "fr"
            ? value.fr
            : value.en,
        ])
      );
    });
    const maritalStatusOptions = {
      single: {
        en: "Single",
        ar: "أعزب",
        fr: "Célibataire",
      },
      married: {
        en: "Married",
        ar: "متزوج",
        fr: "Marié(e)",
      },
    };
    const maritalStatusList = computed(() => {
      return Object.fromEntries(
        Object.entries(maritalStatusOptions).map(([key, value]) => [
          key,
          locale.value === "ar"
            ? value.ar
            : locale.value === "fr"
            ? value.fr
            : value.en,
        ])
      );
    });
    const personalCompanionList = computed(() => {
      return Object.fromEntries(
        Object.entries(personalCompanionOptions).map(([key, value]) => [
          key,
          locale.value === "ar"
            ? value.ar
            : locale.value === "fr"
            ? value.fr
            : value.en,
        ])
      );
    });
    const personalCompanionOptions = {
      1: {
        en: "Yes",
        ar: "موجود",
        fr: "Oui",
      },
      0: {
        en: "No",
        ar: "غير موجود",
        fr: "Non",
      },
    };

    return {
      logo,
      t,
      route,
      dealId,
      warrantyList,
      maritalStatusList,
      personalCompanionList,
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
    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
    addDays(date, days) {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
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
