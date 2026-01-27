<template>
  <div class="whatsapp-container">
    <h2>WhatsApp Login</h2>

    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <p>Initializing WhatsApp client...</p>
    </div>

    <!-- Start button - only show if not connected and no QR -->
    <button
      v-if="!isConnected && !qrCode && !isLoading"
      @click="startWhatsApp"
      class="start-btn"
    >
      Start WhatsApp Client
    </button>

    <!-- QR Code section -->
    <div v-if="qrCode && !isConnected" class="qr-section">
      <h3>Scan the QR Code with WhatsApp:</h3>
      <img :src="qrCodeImage" alt="WhatsApp QR Code" class="qr-image" />
      <p class="qr-instruction">
        Open WhatsApp → Settings → Linked Devices → Link a Device
      </p>
      <div class="qr-status">
        <p>Waiting for scan...</p>
        <div class="spinner"></div>
      </div>
    </div>

    <!-- Connection success -->
    <div v-if="isConnected" class="connected-section">
      <div class="success-message">
        <h3>✅ WhatsApp Connected Successfully!</h3>
        <p v-if="connectedUser">Connected as: {{ connectedUser }}</p>
        <button @click="logoutWhatsApp" class="logout-btn">
          Logout WhatsApp
        </button>
      </div>

      <!-- Message form -->
      <div class="message-form">
        <h3>Send a Message</h3>
        <div class="form-group">
          <label>Recipient Phone Number:</label>
          <input
            v-model="phoneNumber"
            placeholder="Enter phone number (e.g., +1234567890)"
            class="phone-input"
          />
        </div>
        <div class="form-group">
          <label>Message:</label>
          <textarea
            v-model="message"
            placeholder="Enter your message"
            class="message-input"
            rows="4"
          ></textarea>
        </div>
        <button
          @click="sendMessage"
          :disabled="!phoneNumber || !message"
          class="send-btn"
        >
          Send Message
        </button>
      </div>
    </div>

    <!-- Status messages -->
    <div v-if="statusMessage" class="status-message" :class="statusType">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script>
import axios from "@/plugins/axios";
import expressApi from "@/plugins/expressApi";
import {
  webstart,
  webqrcode,
  getUserId,
  checkstatus,
} from "@/plugins/services/whatsappService";

export default {
  data() {
    return {
      qrCode: null,
      qrCodeImage: null,
      isConnected: false,
      connectedUser: null,
      phoneNumber: "",
      message: "",
      isLoading: false,
      statusMessage: "",
      statusType: "",
      statusCheckInterval: null,
      qrCheckInterval: null,
    };
  },

  beforeUnmount() {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  },

  // Also cleanup when user navigates away
  beforeRouteLeave(to, from, next) {
    this.cleanup();
    next();
  },

  // Cleanup when window/tab is closed
  mounted() {
    window.addEventListener("beforeunload", this.cleanup);
  },

  methods: {
    showStatus(message, type = "info") {
      this.statusMessage = message;
      this.statusType = type;
      setTimeout(() => {
        this.statusMessage = "";
      }, 3000);
    },

    cleanup() {
      // Clean up intervals
      if (this.statusCheckInterval) {
        clearInterval(this.statusCheckInterval);
        this.statusCheckInterval = null;
      }
      if (this.qrCheckInterval) {
        clearInterval(this.qrCheckInterval);
        this.qrCheckInterval = null;
      }
    },

    async logoutWhatsApp() {
      try {
        this.showStatus("Logging out WhatsApp...", "info");

        const userId = getUserId();
        await expressApi.post(
          `${process.env.VUE_APP_EXPRESS_URL}/stop-client/`,
          { userId }
        );

        // Reset component state
        this.isConnected = false;
        this.connectedUser = null;
        this.qrCode = null;
        this.qrCodeImage = null;
        this.phoneNumber = "";
        this.message = "";
        this.isLoading = false;

        // Cleanup intervals
        this.cleanup();

        this.showStatus("WhatsApp logged out successfully!", "success");
      } catch (error) {
        this.showStatus("Failed to logout WhatsApp", "error");
      }
    },

    async startWhatsApp() {
      try {
        this.isLoading = true;
        this.showStatus("Starting WhatsApp client...", "info");

        // Start WhatsApp client
        await webstart();

        // Wait a moment for initialization
        setTimeout(() => {
          this.startQrCodeCheck();
          this.startStatusCheck();
        }, 5000);
      } catch (error) {
        this.showStatus("Failed to start WhatsApp client", "error");
        this.isLoading = false;
      }
    },

    startQrCodeCheck() {
      this.qrCheckInterval = setInterval(async () => {
        if (!this.isConnected) {
          await this.fetchQrCode();
        }
      }, 5000);

      // Initial QR code fetch
      this.fetchQrCode();
    },

    startStatusCheck() {
      this.statusCheckInterval = setInterval(async () => {
        await this.checkWhatsAppStatus();
      }, 5000);

      // Initial status check
      this.checkWhatsAppStatus();
    },

    async fetchQrCode() {
      try {
        const response = await webqrcode();

        if (response.data.status === "already_connected") {
          this.isConnected = true;
          this.qrCode = null;
          this.qrCodeImage = null;
          this.isLoading = false;
          this.showStatus("WhatsApp is already connected!", "success");
          return;
        }

        if (response.data && response.data.qr) {
          this.qrCode = response.data.qr;
          this.qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
            this.qrCode
          )}`;
          this.isLoading = false;
        }
      } catch (error) {
        // Error handled silently
      }
    },

    async checkWhatsAppStatus() {
      try {
        const response = await checkstatus();

        if (response.data.connected) {
          this.isConnected = true;
          this.connectedUser = response.data.user;
          this.qrCode = null;
          this.qrCodeImage = null;
          this.isLoading = false;

          // Clear intervals when connected
          if (this.statusCheckInterval) {
            clearInterval(this.statusCheckInterval);
            this.statusCheckInterval = null;
          }
          if (this.qrCheckInterval) {
            clearInterval(this.qrCheckInterval);
            this.qrCheckInterval = null;
          }

          this.showStatus("WhatsApp connected successfully!", "success");
        } else if (response.data.status === "initializing") {
          this.isLoading = true;
        }
      } catch (error) {
        // Error handled silently
      }
    },

    async sendMessage() {
      if (!this.phoneNumber || !this.message) {
        this.showStatus("Please enter both phone number and message!", "error");
        return;
      }

      try {
        this.showStatus("Sending message...", "info");

        const userId = getUserId();
        const response = await axios.post(
          `http://127.0.0.1:3000/send-message`,
          {
            userId,
            phoneNumber: this.phoneNumber,
            message: this.message,
          }
        );

        if (response.data.status === "message_sent") {
          this.showStatus("Message sent successfully!", "success");
          this.message = ""; // Clear message after sending
        }
      } catch (error) {
        this.showStatus("Failed to send message", "error");
      }
    },
  },
};
</script>

<style scoped>
.whatsapp-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.loading-state {
  text-align: center;
  padding: 20px;
}

.start-btn {
  display: block;
  margin: 0 auto;
  padding: 12px 24px;
  background-color: #25d366;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.start-btn:hover {
  background-color: #22c55e;
}

.qr-section {
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.qr-image {
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 300px;
  width: 100%;
}

.qr-instruction {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
}

.qr-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #25d366;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.connected-section {
  margin-top: 20px;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.logout-btn:hover {
  background-color: #c82333;
}

.success-message {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 25px;
  text-align: center;
}

.message-form {
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.phone-input,
.message-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.phone-input:focus,
.message-input:focus {
  outline: none;
  border-color: #25d366;
}

.send-btn {
  background-color: #25d366;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  width: 100%;
}

.send-btn:hover:not(:disabled) {
  background-color: #22c55e;
}

.send-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.status-message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}

.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-message.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
</style>
