<template>
  <div
    :class="`textMessage position-relative py-2 text-start px-3 start-0 rounded-2 fst-normal text-break text-wrap lh-base ${
      message.status === 'undelivered'
        ? 'text-danger'
        : message.status === 'error'
        ? 'message-error'
        : ''
    }`"
  >
    <component
      :is="messageComponent"
      :message="message"
      @open-fullscreen="() => $emit('open-fullscreen', message.fileUrl)"
    />

    <button
      class="buttonMenu border-0 bg-transparent position-absolute top-0 start-0 fs-6"
      @click="handleMenuClick"
    >
      <i
        class="fa-solid fa-ellipsis-vertical text-secondary"
        :class="message.status === 'message-error' ? 'text-white' : ''"
      ></i>
    </button>

    <span class="d-block mt-1 opacity-50 fst-normal">
      <div class="d-flex justify-content-between">
        <span class="me-2">{{ message.time }}</span>
      </div>
      <span v-if="message.type === 'msg-me'">
        <span
          v-if="message.status === 'sent'"
          class="status-icon text-secondary"
        >
          <i class="fa-solid fa-check fs-6"></i>
        </span>
        <span
          v-else-if="message.status === 'delivered'"
          class="status-icon text-secondary"
        >
          <i class="fa-solid fa-check fs-6"></i>
          <i class="fa-solid fa-check fs-6"></i>
        </span>
        <span
          v-else-if="message.status === 'read'"
          class="status-icon text-info"
        >
          <i class="fa-solid fa-check fs-6"></i>
          <i class="fa-solid fa-check fs-6"></i>
        </span>
        <span v-else-if="message.status === 'undelivered'" class="status-icon">
          <i class="fa-solid fa-xmark"></i> (Message not sent)
        </span>
        <span v-else-if="message.status === 'error'" class="status-icon">
          <i class="fa-solid fa-xmark"></i> (Message not sent)
        </span>
      </span>
    </span>

    <ChatMessageMenu
      v-if="activeMenu === index"
      :message="message"
      :index="index"
      @copy="handleMenuAction('copy')"
      @reply="handleMenuAction('reply')"
      @delete="handleMenuAction('delete')"
      v-click-outside="closeMenu"
    />

    <div
      v-if="message.isCopied"
      class="copy-message position-absolute bg-secondary-subtle py-1 px-2 rounded-1 bottom-100 text-center"
    >
      Message Copied!
    </div>
  </div>
</template>

<script>
import ChatMessageText from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesText.vue";
import ChatMessageImage from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesImage.vue";
import ChatMessageVideo from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesVideo.vue";
import ChatMessageAudio from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesAudio.vue";
import ChatMessageDocument from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesDocument.vue";
import ChatMessageMenu from "@/components/whatsapp/WhatsAppModalSidebarRightChatMessageContainerMessagesMenu.vue";

export default {
  name: "WhatsAppModalSidebarRightChatMessageContainerMessages",
  components: {
    ChatMessageText,
    ChatMessageImage,
    ChatMessageVideo,
    ChatMessageAudio,
    ChatMessageDocument,
    ChatMessageMenu,
  },
  props: {
    message: Object,
    index: Number,
    activeMenu: Number,
  },
  methods: {
    handleMenuClick(event) {
      event.stopPropagation();
      this.$emit("toggle-menu", this.index);
    },
    closeMenu() {
      this.$emit("close-menu");
    },
    handleMenuAction(action) {
      switch (action) {
        case "copy":
          this.$emit("copy-message", this.message);
          break;
        case "reply":
          this.$emit("reply-message", this.message);
          break;
        case "delete":
          this.$emit("delete-message", this.index);
          break;
      }
      this.closeMenu();
    },
  },
  computed: {
    messageComponent() {
      if (this.message.isImage) return "ChatMessageImage";
      if (this.message.isVideo) return "ChatMessageVideo";
      if (this.message.isAudio) return "ChatMessageAudio";
      if (this.message.isDocument) return "ChatMessageDocument";
      return "ChatMessageText";
    },
  },
};
</script>
<style scoped>
.right-side .chatBx .msg .textMessage {
  max-width: 65%;
  background: #dcf8c6;
}
.right-side .chatBx .msg .textMessage img {
  max-width: 400px;
  object-fit: cover;
}
@media (max-width: 1200px) {
  .right-side .chatBx .msg .textMessage img {
    max-width: 100%;
  }
}

.right-side .chatBx .msg-me .textMessage::before {
  content: "";
  position: absolute;
  top: 0;
  left: -10px;
  border-top: 10px solid #dcf8c6;
  border-left: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid #dcf8c6;
}

.right-side .chatBx .msg-me {
  justify-content: flex-start;
}
/* icon menu */
.right-side .chatBx .msg-me .buttonMenu {
  right: 0 !important;
}
.right-side .chatBx .msg-frnd .buttonMenu {
  left: 0 !important;
}
/* menu list */
.right-side .chatBx .msg-me .menu-list {
  right: 0% !important;
}
.right-side .chatBx .msg-frnd .menu-list {
  left: 0% !important;
}
/* copy message */
.right-side .chatBx .msg .copy-message {
  min-width: fit-content;
  font-size: 12px;
  white-space: nowrap;
}
.right-side .chatBx .msg-frnd .copy-message {
  left: 0% !important;
}
.right-side .chatBx .msg-me .copy-message {
  right: 0% !important;
}

.right-side .chatBx .msg-frnd {
  justify-content: flex-end;
}

.right-side .chatBx .msg-frnd .textMessage {
  background: #fff;
  text-align: left;
}

.right-side .chatBx .msg-frnd .textMessage::before {
  content: "";
  position: absolute;
  top: 0;
  right: unset;
  right: -10px;
  border-top: 10px solid #fff;
  border-left: 10px solid #fff;
  border-bottom: 10px solid transparent;
  border-right: 10px solid transparent;
}
.full-screen-image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.078);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.full-screen-image {
  max-width: 90% !important;
  max-height: 90% !important;
  border-radius: 8px;
}
.text-gray {
  color: #6c757d;
}

.text-blue {
  color: #0d6efd;
}
.btn-scroll {
  bottom: 60px;
  right: -5px;
  background: #8a8686eb;
  width: 40px;
  height: 40px;
  z-index: 1000;
}
.right-side .chatBx .msg-frnd .buttonMenu {
  left: 0 !important;
}
.right-side .chatBx .msg-frnd .addNote {
  background: #ffffff60;
  left: -31px !important;
}
.right-side .chatBx .msg-me .addNote {
  background: #ffffff60;
  right: -31px !important;
}
.message-error {
  background-color: #d40000 !important;
  color: #fff !important;
}

.right-side .chatBx .msg-me .message-error::before {
  border-top-color: #d40000 !important;
  border-right-color: #d40000 !important;
}

.right-side .chatBx .msg-frnd .message-error::before {
  border-top-color: #d40000 !important;
  border-left-color: #d40000 !important;
}
</style>
