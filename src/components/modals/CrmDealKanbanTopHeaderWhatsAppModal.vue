<template>
  <div
    class="modal fade"
    id="whatsappModal"
    tabindex="-1"
    aria-labelledby="whatsappModalLabel"
    aria-hidden="true"
    data-bs-backdrop="false"
  >
    <div class="modal-dialog modal-fullscreen">
      <div
        class="modal-content"
        style="
          background-image: url('@/assets/whatsappImage/backgroundWA.png') !important ;
          background-size: contain;
          font-family: 'Alexandria', sans-serif !important;
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-color: #eee;
          background-position: right;
          height: 100%;
          width: 100%;
          z-index: 9999;
        "
      >
        <!-- b75f3f2c -->
        <div class="modal-body p-0 overflow-hidden">
          <div class="backgroundImage position-absolute">
            <div v-if="!isConnected && !qrCode && !isLoading">
              <img src="@/assets/whatsappImage/Art_WA.png" alt="" /><br />
              <span>
                Always start with conversations that have today's tasks or
                overdue ones.
              </span>
              <h1 class="text-center fw-bolder">GOOD LUCK!</h1>
            </div>
            <button
              v-if="!isConnected && !qrCode && !isLoading"
              @click="startWhatsApp"
              class="btn btn-sm btn-success align-center"
            >
              Start Whatsapp
            </button>
            <div v-if="isLoading" class="loading-state">
              <p>Initializing WhatsApp client...</p>
            </div>
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
            <div v-if="isConnected">
              <h1 class="text-center fw-bolder">Connected</h1>
            </div>
          </div>
          <button
            class="btnCloseWhatsapp text-white border-0 position-absolute rounded-2"
            type="button"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="fa fa-close fs-5 py-1"></i>
          </button>
          <div class="row mx-0">
            <sidebar-left @select-chat="setSelectedChat" ref="leftSidebar" />
            <sidebar-right
              :selectedChat="selectedChat"
              v-if="selectedChat"
              @mark-as-unread="handleMarkAsUnread"
              @pin-chat="pinActiveChat"
              @open-label="handleOpenLabel"
              @delete-chat="handleDeleteChat"
              @new-message="handleNewMessage"
              @get-more-messages="getMoreMessages"
              :scrollToBot="scrollToBot"
              ref="SidebarRight"
              @close-rightSidebar="closeRightSidebarChat"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <chat-name-modal
    ref="labelModal"
    :chat-name="selectedChat?.name"
    @save-label="handleSaveLabel"
  />
</template>
<script>
import SidebarLeft from "@/components/whatsapp/WhatsAppModalSidebarLeft.vue";
import SidebarRight from "@/components/whatsapp/WhatsAppModalSidebarRight.vue";
import expressApi from "@/plugins/expressApi";
import {
  changePinStatus,
  getMessageConv,
  webstart,
  webqrcode,
  getUserId,
  checkstatus,
} from "@/plugins/services/whatsappService";
import ChatNameModal from "@/components/whatsapp/WhatsAppModalChatNameModal.vue";
import Cookies from "js-cookie";

export default {
  name: "WhatsappModal",
  components: {
    SidebarLeft,
    SidebarRight,
    ChatNameModal,
  },
  props: {
    conversation: {
      type: Object,
      required: true,
      default: null,
    },
    new_message: {
      type: Object,
      required: true,
      default: null,
    },
    updated_message: {
      type: Object,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      selectedChat: null,
      offset: 0,
      total: 0,
      scrollToBot: false,
      isFetching: false,
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
  mounted() {
    window.addEventListener("beforeunload", this.cleanup);
  },

  unmounted() {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  },

  beforeRouteLeave(to, from, next) {
    this.cleanup();
    next();
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
        await expressApi.post(`stop-client`, {
          userId,
        });

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
        }, 2000);
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
      }, 3000);

      // Initial QR code fetch
      this.fetchQrCode();
    },

    startStatusCheck() {
      this.statusCheckInterval = setInterval(async () => {
        await this.checkWhatsAppStatus();
      }, 2000);

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
        if (error.response?.status === 404) {
        }
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
      } catch (error) {}
    },

    loadConversations(conversations) {
      if (this.$refs.leftSidebar) {
        this.$refs.leftSidebar.chats = conversations;
      } else {
      }
    },
    handleNewMessage(newMessage) {
      if (this.selectedChat) {
        this.selectedChat = {
          ...this.selectedChat,
          messages: [...(this.selectedChat.messages || []), newMessage],
        };
      }
    },
    async setSelectedChat(chat) {
      try {
        this.isFetching = true;
        this.offset = 0;
        const chatId = chat.id || chat.conversation_id;
        if (!chatId) {
          return;
        }
        this.selectedChat = chat;
        const messages = await this.fetchMessages(chatId);
        this.selectedChat = {
          ...chat,
          id: chatId,
          messages,
          created_at_last_message:
            chat.created_at_last_message ?? chat.updated_at,
        };
        this.scrollToBot = false;
        this.scrollToBot = true;
        this.$nextTick(() => {
          this.isFetching = false;
        });
      } catch (error) {
        this.selectedChat = chat;
      }
    },

    async getMoreMessages() {
      if (!this.isFetching) {
        this.isFetching = true;
        this.offset = this.selectedChat.messages.length;
        const messages = await this.fetchMessages(this.selectedChat.id);
        this.selectedChat.messages = [
          ...messages,
          ...this.selectedChat.messages,
        ];
        this.isFetching = false;
      } else {
      }
    },

    async fetchMessages(id) {
      const response = await getMessageConv(id, {
        limit: 10,
        offset: this.offset,
      });
      if (response.data && response.data.data) {
        const messages = response.data.data.map((msg) => ({
          id: msg.id,
          type:
            msg.conversation_member.type === "User" &&
            msg.conversation_member.id == Cookies.get("user_id")
              ? "msg-me"
              : "msg-frnd",
          text: msg.text_body,
          time: new Date(msg.created_at).toLocaleTimeString("en-TR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Europe/Istanbul",
          }),
          created_at: msg.created_at,
          sender: msg.conversation_member?.name || "",
          isCopied: false,
          isImage: msg.type === "image",
          isDocument: msg.type === "document",
          isAudio: msg.type === "audio",
          isVideo: msg.type === "video",
          fileName: msg.file ? msg.file.name : null,
          fileUrl: msg.file ? msg.file.url : null,
          fileDownloadUrl: msg.file?.download_url || null,
          fileMimeType: msg.file ? msg.file.mime_type : null,
          status: msg.status,
        }));

        return messages;
      }
    },

    handleMarkAsUnread() {
      const activeChat = this.$refs.leftSidebar.chats.find(
        (chat) => chat.isActive
      );
      if (activeChat) {
        this.$refs.leftSidebar.markAsUnread(activeChat);
      }
    },
    pinActiveChat() {
      const activeChat = this.$refs.leftSidebar.chats.find(
        (chat) => chat.isActive
      );
      if (activeChat) {
        changePinStatus(activeChat.id);
        this.$refs.leftSidebar.pinChat(activeChat);
      }
    },

    handleDeleteChat() {
      this.$refs.leftSidebar.deleteChat();
      this.selectedChat = null;
    },
    handleOpenLabel() {
      this.$refs.labelModal.showModal();
    },
    handleSaveLabel(newName) {
      if (this.selectedChat) {
        this.selectedChat.name = newName;
      }
    },
    receiveNewMessage(new_message) {
      if (
        this.selectedChat &&
        this.selectedChat.id == new_message.conversation_id
      ) {
        this.handleNewMessage({
          id: new_message.id || Date.now(),
          type: "msg-frnd",
          text: new_message.text_body,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          created_at: new_message.created_at,
          sender: new_message.sender_name || new_message.sender,
          isCopied: false,
          isImage: new_message.type === "image",
          isDocument: new_message.type === "document",
          isAudio: new_message.type === "audio",
          isVideo: new_message.type === "video",
          fileName: new_message.file ? new_message.file.name : null,
          fileUrl: new_message.file ? new_message.file.url : null,
          fileDownloadUrl: new_message.file?.download_url || null,
          conversation_id: new_message.conversation_id,
          fileMimeType: new_message.file ? new_message.file.mime_type : null,
          status: new_message.status,
        });
      } else {
      }
    },

    updateMessage(data) {
      if (this.selectedChat) {
        const messageIndex = this.selectedChat.messages.findIndex(
          (msg) => msg.id == data.id
        );
        if (messageIndex !== -1) {
          const updated_data = {
            text: data.text_body,
            status: data.status,
          };
          this.selectedChat.messages[messageIndex] = {
            ...this.selectedChat.messages[messageIndex],
            ...updated_data,
          };
        }
      }
    },
    closeRightSidebarChat() {
      this.selectedChat = null;
    },
  },
  watch: {
    conversation: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.$refs.leftSidebar.addNewChat(newVal);
        }
      },
    },
    new_message: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.receiveNewMessage(newVal);
        }
      },
    },
    updated_message: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.updateMessage(newVal);
        }
      },
    },
  },
};
</script>
<style scoped>
#whatsappModal {
  z-index: 9999 !important;
}
.btnCloseWhatsapp {
  top: 10px;
  right: 10px;
  background-color: #7b77777e;
}
.backgroundImage {
  top: 50%;
  right: 30% !important;
  transform: translate(50%, -50%);
}
.modal-body {
  background-image: url("@/assets/whatsappImage/backgroundWA.png") !important ;
  background-size: contain;
  font-family: "Alexandria", sans-serif !important;
  background-attachment: fixed;
}
</style>
