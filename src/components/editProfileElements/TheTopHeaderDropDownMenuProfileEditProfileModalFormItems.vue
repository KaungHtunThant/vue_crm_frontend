<!-- <template> -->
<!-- <div class="mb-3"> -->
<!-- <label for="profileImage" class="form-label">الصورة الشخصية</label> -->
<!-- <div class="my-2 text-center">
      <img
        :src="localImage"
        class="img-fluid rounded"
        width="100"
        alt="Profile Image"
      />
    </div>
    <input
      type="file"
      class="form-control"
      id="profileImage"
      @change="updateImage"
    />
  </div>
  <div class="mb-3">
    <label for="name" class="form-label">{{
      t("header-user-menu-item-profile-modal-label-name")
    }}</label>
    <input
      type="text"
      class="form-control"
      placeholder="User Name"
      id="name"
      v-model="localName"
      readonly
    />
  </div> -->

<!-- <div class="mb-3">
    <label for="email" class="form-label">{{
      t("header-user-menu-item-profile-modal-label-email")
    }}</label>
    <input
      type="email"
      class="form-control"
      placeholder="Email"
      id="email"
      v-model="localEmail"
      readonly
    />
  </div> -->

<!-- <div v-if="errorMessage" class="alert alert-danger">
    {{ errorMessage }}
  </div>
  <div v-if="successMessage" class="alert alert-success">
    {{ successMessage }}
  </div> -->
<!-- </template> -->

<script>
// import { ref } from "vue";
// import { useI18n } from "vue-i18n";
// export default {
//   name: "TheTopHeaderDropDownMenuProfileEditProfileModalFormItems",
//   props: {
//     userData: {
//       type: Object,
//       required: true,
//     },
//   },
//   setup(props) {
//     const { t } = useI18n();
//     const localUserData = ref(props.userData);
//     return { t, localUserData };
//   },
//   data() {
//     return {
//       localName: "",
//       localEmail: "",
//       localImage: require("@/assets/default-avatar-profile.webp"),
//     };
//   },
//   methods: {
//     updateImage(event) {
//       const file = event.target.files[0];
//       if (file?.type?.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           this.localImage = e.target.result;
//           this.$forceUpdate();
//         };
//         reader.readAsDataURL(file);
//       }
//     },
//   },
//   mounted() {
//     // Set initial values from cookies
//     this.localName = this.localUserData?.name;
//     this.localEmail = this.localUserData?.email;
//     this.localImage =
//       this.localUserData?.image ||
//       require("@/assets/default-avatar-profile.webp");
//   },
//   watch: {
//     userData(newVal) {
//       this.localName = newVal.name;
//       this.localEmail = newVal.email;
//       this.localImage =
//         newVal.image || require("@/assets/default-avatar-profile.webp");
//     },
//   },
// };
</script>

<style scoped>
/* select:focus,
input:focus {
  box-shadow: none;
  outline: none;
} */
</style>
