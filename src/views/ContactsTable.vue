<template>
  <div class="container">
    <h1>Test</h1>
    <DataTable :options="options" class="table table-light" />
  </div>
</template>

<script>
import { getContacts } from "@/plugins/services/authService";
import { ref, onMounted } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from "datatables.net-bs5";
import { useI18n } from "vue-i18n";

DataTable.use(DataTablesCore);

export default {
  name: "ContactsTable",
  components: { DataTable },
  setup() {
    // Reactive variables
    const { t } = useI18n();
    const rows = ref([]);
    const totalRows = ref(0);
    const currentPage = ref(1);
    const rowsPerPage = ref(10);
    const options = ref({
      serverSide: true,
      processing: true,
      ajax: (data, callback) => {
        // Fetch data from the server
        console.log(data);
        fetchData(data.start / data.length + 1, data.length)
          .then(() => {
            callback({
              draw: data.draw,
              recordsTotal: totalRows.value,
              recordsFiltered: totalRows.value,
              data: rows.value,
            });
          })
          .catch((error) => console.error("Error fetching data:", error));
      },
      columns: [
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
      ],
    });

    // Fetch data from the server
    const fetchData = async (page, perPage) => {
      try {
        const response = await getContacts({
          page: page,
          per_page: perPage,
        });
        const data = response.data;
        console.log(data);
        // Update reactive variables with server data
        rows.value = data.data;
        totalRows.value = data.meta.total;
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
      options,
    };
  },
};
</script>
