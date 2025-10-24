<!-- <template>
  <div class="mb-3">
    <label for="oldPassword" class="form-label">{{
      t("modals.oldPassword")
    }}</label>
    <input
      type="password"
      class="form-control"
      placeholder="Old Password"
      id="oldPassword"
      v-model="localPassword.old"
    />
  </div>

  <div class="mb-3">
    <label for="newPassword" class="form-label">{{
      t("modals.newPassword")
    }}</label>
    <input
      type="password"
      class="form-control"
      placeholder="New Password"
      id="newPassword"
      v-model="localPassword.new"
    />
  </div>

  <div class="mb-3">
    <label for="confirmPassword" class="form-label">{{
      t("modals.confirmPassword")
    }}</label>
    <input
      type="password"
      class="form-control"
      placeholder="Confirm Password"
      id="confirmPassword"
      v-model="localPassword.confirm"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "ChangePasswordForm",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { t } = useI18n();

    // نسخة محلية من الباسوردات
    const localPassword = ref({ ...props.modelValue });

    // نراقب التغييرات على النسخة المحلية ونرسلها للأب
    watch(
      localPassword,
      (newVal) => {
        emit("update:modelValue", newVal);
      },
      { deep: true }
    );

    // إذا تغيرت قيمة prop من الأب، نحدث النسخة المحلية
    watch(
      () => props.modelValue,
      (newVal) => {
        localPassword.value = { ...newVal };
      },
      { deep: true }
    );

    return {
      t,
      localPassword,
    };
  },
};
</script>

<style scoped>
input:focus {
  box-shadow: none;
  outline: none;
}
</style> -->
