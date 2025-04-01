import Echo from "laravel-echo";
import Pusher from "pusher-js"; // Import Pusher

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: process.env.VUE_APP_PUSHER_KEY,
  cluster: process.env.VUE_APP_PUSHER_CLUSTER,
  wsHost: process.env.VUE_APP_WEBSOCKET_HOST, // Explicitly set wsHost
  wsPort: process.env.VUE_APP_WEBSOCKET_PORT, // Explicitly set wsPort
  wssPort: process.env.VUE_APP_WEBSOCKET_PORT, // Explicitly set wssPort
  forceTLS: process.env.VUE_APP_WEBSOCKET_TLS === "true", // Ensure this matches your environment
  disableStats: true,
  encrypted: false,
  enabledTransports: ["ws", "wss"], // Ensure only WebSocket transports are used
  // client: Pusher, // Use the imported Pusher instance
});
