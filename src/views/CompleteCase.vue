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
            <td>{{ t("print-case-patient-name") }}</td>
            <td>{{ t("print-case-patient-dateofbirth") }} 00-00-0000</td>
          </tr>
          <tr class="table-secondary">
            <td>{{ t("print-case-patient-address") }}</td>
            <td>
              {{ t("print-case-patient-marital-status") }} Married / Single
            </td>
          </tr>
          <tr class="table-secondary">
            <td>{{ t("print-case-patient-passport") }} XXXXXXX</td>
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
            <td>{{ t("print-case-patient-phone") }}</td>
            <td>{{ t("print-case-patient-email") }}</td>
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
          <tr class="table-success">
            <td class="w-85">Treatment 1</td>
            <td class="text-center">Qty</td>
          </tr>
          <tr class="table-success">
            <td class="w-85">Treatment 2</td>
            <td class="text-center">Qty</td>
          </tr>
        </tbody>
      </table>
      <div
        :class="[
          'bg-danger-subtle fw-bold mb-2 p-2 border border-dark w-25',
          direction === 'ltr' ? 'float-end' : 'float-start',
        ]"
      >
        $ xxxxx
      </div>
    </section>

    <!-- Additional Services -->
    <section class="mb-5">
      <h6 class="fw-bold fs-7">
        {{ t("print-case-patient-additional-services") }}
      </h6>
      <table class="table table-bordered fs-8 mb-1">
        <tbody>
          <tr class="table-success">
            <td class="w-75">Service 1</td>
            <td class="text-center">Days (x)</td>
            <td class="text-center">Yes / No</td>
          </tr>
          <tr class="table-success">
            <td>Service 2</td>
            <td class="text-center">Days (x)</td>
            <td class="text-center">Yes / No</td>
          </tr>
          <tr class="table-success">
            <td>Service 3</td>
            <td class="text-center">Days (x)</td>
            <td class="text-center">Yes / No</td>
          </tr>
          <tr class="table-success">
            <td>Service 4</td>
            <td class="text-center">Days (x)</td>
            <td class="text-center">Yes / No</td>
          </tr>
        </tbody>
      </table>
      <div
        :class="[
          'bg-danger-subtle fw-bold mb-2 p-2 border border-dark w-25',
          direction === 'ltr' ? 'float-end' : 'float-start',
        ]"
      >
        $ xxxxx
      </div>
    </section>

    <!-- Total -->
    <section class="mb-1">
      <div class="fw-bold fs-7 mt-4">
        {{ t("print-case-patient-total-vat") }} XXXX
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
export default {
  data() {
    return {
      direction: "ltr",
    };
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
  mounted() {
    const locale = localStorage.getItem("locale") || "en";
    this.direction = ["ar", "ur"].includes(locale) ? "rtl" : "ltr";
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
