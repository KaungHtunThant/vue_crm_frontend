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
      // Join the channel
      // window.Echo.join("testing")
      //   .here((users) => {
      //     console.log("Users in the channel:", users);
      //   })
      //   .joining((user) => {
      //     console.log("User joined:", user);
      //   })
      //   .leaving((user) => {
      //     console.log("User left:", user);
      //   })
      //   .error((error) => {
      //     console.error("Error joining channel:", error);
      //   });
      // Listen for events
      // window.Echo.private("super-admin").notification((notification) => {
      //   console.log("Notification received:", notification);
      // });
      window.Echo.channel("testing").listen("Testing", (data) => {
        console.log(data.message);
      });
    });

    onUnmounted(() => {
      // Clean up if necessary
      if (window.Echo) {
        window.Echo.leave("super-admin");
      }
    });

    return {};
  },
};
</script>
<style lang="scss"></style>
