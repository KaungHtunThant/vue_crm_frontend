import Echo from "laravel-echo";
import Pusher from "pusher-js";
import Cookies from "js-cookie";

console.log("WebSocket configuration:", {
  VUE_APP_WEBSOCKET_BROADCASTER: process.env.VUE_APP_WEBSOCKET_BROADCASTER,
  VUE_APP_WEBSOCKET_KEY: process.env.VUE_APP_WEBSOCKET_KEY,
  VUE_APP_WEBSOCKET_CLUSTER: process.env.VUE_APP_WEBSOCKET_CLUSTER,
  VUE_APP_WEBSOCKET_HOST: process.env.VUE_APP_WEBSOCKET_HOST,
  VUE_APP_WEBSOCKET_PORT: process.env.VUE_APP_WEBSOCKET_PORT,
  VUE_APP_WEBSOCKET_TLS: process.env.VUE_APP_WEBSOCKET_TLS,
});

// Initialize Pusher
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: process.env.VUE_APP_WEBSOCKET_BROADCASTER,
  host: `ws://${process.env.VUE_APP_WEBSOCKET_HOST}:${process.env.VUE_APP_WEBSOCKET_PORT}`,
  key: process.env.VUE_APP_WEBSOCKET_KEY,
  cluster: process.env.VUE_APP_WEBSOCKET_CLUSTER,
  wsHost: process.env.VUE_APP_WEBSOCKET_HOST, // Explicitly set wsHost
  wsPort: process.env.VUE_APP_WEBSOCKET_PORT, // Explicitly set wsPort
  // wssPort: process.env.VUE_APP_WEBSOCKET_PORT, // Explicitly set wssPort
  forceTLS: process.env.VUE_APP_WEBSOCKET_TLS === "true", // Ensure this matches your environment
  disableStats: true,
  encrypted: false,
  enabledTransports: ["ws"], // Ensure only WebSocket transports are used
  authEndpoint: `${process.env.VUE_APP_BACKEND_URL}/broadcasting/auth`, // Set the correct backend URL
  auth: {
    headers: {
      Authorization: `Bearer ${Cookies.get("authToken")}`,
    },
  },
});
