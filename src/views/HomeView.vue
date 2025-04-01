<template>
  <h1>Dashboard</h1>
</template>
<script>
import { onMounted, onUnmounted } from "vue";
import "@/plugins/websocket"; // Ensure this is the correct path to your echo plugin

export default {
  name: "HomePage",

  setup() {
    onMounted(() => {
      console.log("Echo initialized", window.Echo);
      window.Echo.channel("testing").listen("Testing", (data) => {
        console.log(data.message);
      });
    });

    onUnmounted(() => {
      // Clean up if necessary
      if (window.Echo) {
        window.Echo.leave("testing");
      }
    });

    return {};
  },
};
</script>
<style lang="scss"></style>
