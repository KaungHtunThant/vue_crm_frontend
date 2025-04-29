<template>
  <div class="imgBx position-relative overflow-hidden h-25 me-2 mb-4">
    <img
      v-if="flagUrl"
      :src="flagUrl"
      :alt="countryCode ? `${countryCode} flag` : 'user image'"
      class="rounded w-100 h-100"
    />
    <img
      v-else
      :src="defaultImage"
      alt="user image"
      class="rounded-circle w-100 h-100"
    />
  </div>
</template>

<script>
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";

export default {
  name: "CountryFlagAvatar",
  props: {
    phone: {
      type: String,
      default: "",
    },
    defaultImage: {
      type: String,
      default: require("@/assets/whatsappImage/default-userImage.jpg"),
    },
  },
  data() {
    return {
      countryCode: null,
    };
  },
  computed: {
    flagUrl() {
      if (!this.countryCode) return null;
      return `https://flagcdn.com/w160/${this.countryCode.toLowerCase()}.png`;
    },
  },
  methods: {
    parseNumber() {
      try {
        if (this.phone && this.phone.trim()) {
          const formattedNumber = this.formatPhoneNumber(this.phone);
          if (isValidPhoneNumber(formattedNumber)) {
            const parsedNumber = parsePhoneNumber(formattedNumber);
            this.countryCode = parsedNumber.country;
          } else {
            this.countryCode = null;
          }
        } else {
          this.countryCode = null;
        }
      } catch (error) {
        console.error("Error parsing phone number:", error);
        this.countryCode = null;
      }
    },
    formatPhoneNumber(phone) {
      if (phone && !phone.startsWith("+")) {
        return "+" + phone.replace(/\D/g, "");
      }
      return phone;
    },
  },
  watch: {
    phone: {
      immediate: true,
      handler() {
        this.parseNumber();
      },
    },
  },
  mounted() {
    this.parseNumber();
  },
};
</script>
