<template>
  <div>
    <DataTable
      :value="rows"
      :paginator="true"
      :rows="rowsPerPage"
      :rowsPerPageOptions="[10, 25, 50]"
      :total-records="totalRows"
      :lazy="true"
      :onLazyLoad="loadCarsLazy"
      :loading="loading"
      @page="onPageChange"
    >
      <Column
        v-for="col of columns"
        :key="col.data"
        :field="col.data"
        :header="col.title"
      ></Column>
    </DataTable>
  </div>
</template>

<script>
import { getContacts } from "@/plugins/services/authService";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default {
  name: "PrimeVueTest",
  components: { DataTable, Column },
  setup() {
    // Reactive variables
    const { t } = useI18n();
    const loading = ref(false);
    const rows = ref([]);
    const totalRows = ref(0);
    const currentPage = ref(0);
    const rowsPerPage = ref(10);
    const columns = [
      {
        title: t("contacts-table-header-fullname"),
        data: "name",
      },
      {
        title: t("contacts-table-header-nickname"),
        data: "nickname",
      },
      {
        title: t("contacts-table-header-email"),
        data: "email",
      },
      {
        title: t("contacts-table-header-address"),
        data: "address",
      },
      {
        title: t("contacts-table-header-country"),
        data: "country",
      },
      { title: t("contacts-table-header-phone"), data: "phones" },
    ];

    // Handle page change event
    const onPageChange = (event) => {
      currentPage.value = event.page;
      rowsPerPage.value = event.rows;
      fetchData(currentPage.value, rowsPerPage.value);
    };

    // Fetch data from the server
    const fetchData = async (page, perPage) => {
      try {
        loading.value = true;
        const response = await getContacts({
          page: page + 1,
          per_page: perPage,
        });
        const data = response.data;
        console.log(data);
        // Update reactive variables with server data
        rows.value = data.data;
        totalRows.value = data.meta.total;
        loading.value = false;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    onMounted(() => {
      fetchData(currentPage.value, rowsPerPage.value);
    });

    return {
      rows,
      totalRows,
      currentPage,
      rowsPerPage,
      columns,
      onPageChange,
      loading,
    };
  },
};
</script>
