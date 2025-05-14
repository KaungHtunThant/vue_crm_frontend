<template>
  <div
    class="modal fade"
    id="whatsappModal"
    tabindex="-1"
    aria-labelledby="whatsappModalLabel"
    aria-hidden="true"
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
            <img src="@/assets/whatsappImage/Art_WA.png" alt="" /><br />
            <span>
              Always start with conversations that have today's tasks or overdue
              ones.
            </span>
            <h1 class="text-center fw-bolder">GOOD LUCK!</h1>
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
            <SidebarLeft
              @select-chat="setSelectedChat"
              :file="file"
              ref="leftSidebar"
            />
            <SidebarRight
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
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <LabelModal
    ref="labelModal"
    :chat-name="selectedChat?.name"
    @save-label="handleSaveLabel"
  />
</template>

<script>
import SidebarLeft from "@/components/whatsapp/SidebarLeft.vue";
import SidebarRight from "@/components/whatsapp/SidebarRight.vue";
import {
  changePinStatus,
  getMessageConv,
} from "@/plugins/services/authService";
import LabelModal from "@/components/whatsapp/labelWhatsapp.vue";
import Cookies from "js-cookie";
export default {
  name: "WhatsappModal",
  components: { SidebarLeft, SidebarRight, LabelModal },
  props: {
    conversation: {
      type: Object,
      default: null,
    },
    new_message: {
      type: Object,
      default: null,
    },
    updated_message: {
      type: Object,
      default: null,
    },
    file: {
      type: Object,
      default: null,
    },
  },
  emits: ["close"],
  data() {
    return {
      selectedChat: null,
      offset: 0,
      total: 0,
      scrollToBot: false,
      isFetching: false,
    };
  },
  methods: {
    loadConversations(conversations) {
      if (this.$refs.leftSidebar) {
        this.$refs.leftSidebar.chats = conversations;
      } else {
        console.warn("LeftSidebar ref not found");
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
        console.log("Selected chat:", chat);
        const chatId = chat.id || chat.conversation_id;
        if (!chatId) {
          console.error("No chat ID found!");
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
        console.error("Error fetching messages:", error);
        this.selectedChat = chat;
      }
    },

    async getMoreMessages() {
      if (!this.isFetching) {
        this.isFetching = true;
        console.log("get more");
        this.offset = this.selectedChat.messages.length;
        const messages = await this.fetchMessages(this.selectedChat.id);
        this.selectedChat.messages = [
          ...messages,
          ...this.selectedChat.messages,
        ];
        this.isFetching = false;
      } else {
        console.log("Already fetching messages");
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
        console.log("activeChat", activeChat);
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
        console.log("chat opened", this.selectedChat, new_message);
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
        console.log("chat not opened", this.selectedChat, new_message);
      }
    },

    updateMessage(data) {
      if (this.selectedChat) {
        const messageIndex = this.selectedChat.messages.findIndex(
          (msg) => msg.id == data.id
        );
        console.log("messageIndex", messageIndex);
        if (messageIndex !== -1) {
          const updated_data = {
            text: data.text_body,
            status: data.status,
          };
          this.selectedChat.messages[messageIndex] = {
            ...this.selectedChat.messages[messageIndex],
            ...updated_data,
          };
          console.log(
            "Updated message:",
            this.selectedChat.messages[messageIndex]
          );
        }
      }
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
