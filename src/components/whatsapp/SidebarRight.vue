<template>
  <div class="col-0 col-md-8 boxChat px-0" v-if="selectedChat">
    <div class="right-side position-relative pt-2" style="height: 100vh">
      <div
        class="header position-relative px-2 border-1 border-end bg-success rounded-3"
      >
        <div class="row h-100">
          <div class="col-5 col-lg-4 h-100">
            <div
              class="user-details d-flex justify-content-start align-items-center gap-2 h-100"
            >
              <div class="user-imgBx">
                <!-- <img
                  :src="selectedChat.img ||require('@/assets/whatsappImage/User-21.svg')"
                  alt="user image"
                  class="img-fluid"
                /> -->
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 512 512"
                  style="enable-background: new 0 0 512 512"
                  xml:space="preserve"
                >
                  <g>
                    <path
                      d="M256,281.6c-77.6,0-140.8-63.2-140.8-140.8S178.4,0,256,0s140.8,63.2,140.8,140.8S333.6,281.6,256,281.6z M256,25.6
		c-63.5,0-115.2,51.7-115.2,115.2S192.5,256,256,256s115.2-51.7,115.2-115.2S319.5,25.6,256,25.6z"
                    />
                    <path
                      d="M460.8,512H51.2c-21.2,0-38.4-17.2-38.4-38.4c0-1.7,0.4-43.1,31.4-84.5c18.1-24.1,42.8-43.2,73.5-56.8
		c37.5-16.7,84-25.1,138.4-25.1s100.9,8.4,138.4,25.1c30.7,13.6,55.4,32.7,73.4,56.8c31,41.3,31.4,82.7,31.4,84.5
		C499.2,494.8,482,512,460.8,512z M256,332.8c-89.3,0-155.1,24.4-190.5,70.6c-26.5,34.6-27.1,69.9-27.1,70.3c0,7,5.7,12.8,12.8,12.8
		h409.6c7.1,0,12.8-5.7,12.8-12.8c0-0.3-0.6-35.7-27.1-70.3C411.1,357.2,345.2,332.8,256,332.8z"
                    />
                  </g>
                </svg>
              </div>
              <div class="">
                <p class="my-auto text-white ps-1">{{ selectedChat.name }}</p>
                <p class="my-auto text-white" style="font-size: 14px">
                  {{ selectedChat.phone }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="col-7 col-lg-8 search_list d-flex justify-content-end align-items-center ps-4 gap-2 fs-6 h-100"
          >
            <div id="bxSearch" class="d-flex">
              <div
                class="searchInput align-items-center"
                :class="{ 'show-search': isSearchBarVisible }"
              >
                <input
                  type="text"
                  name="searchChat"
                  id="searchChat"
                  class="ms-3 border-0 text-white py-1 px-2 fs-6 w-100 ms-5 bg-transparent border-1 border-bottom border-white"
                  v-model="searchQuery"
                  placeholder="Search Here.."
                  style="outline: none"
                />
              </div>
              <button
                @click="toggleSearchInput()"
                aria-label="search in chat"
                class="border-0 bg-transparent"
              >
                <i
                  class="fa-solid fa-magnifying-glass searchIcon fs-6 text-white cursor-pointer"
                ></i>
              </button>
            </div>
            <button
              @click.stop="showList()"
              aria-label="list chat (menu)"
              class="border-0 bg-transparent"
            >
              <i class="fa-solid fa-ellipsis-vertical fs-6 text-white"></i>
            </button>
            <button
              class="bg-transparent border-0"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fa fa-window-restore fs-6 pt-2 ps-1 text-white"></i>
            </button>
          </div>
        </div>
      </div>

      <div
        class="chatBx position-relative w-100 overflow-auto px-5 pt-5 pb-5"
        ref="chatBox"
      >
        <ChatBubbles
          :messages="chatMessages"
          :searchQuery="searchQuery"
          @delete-message="handleDeleteMessage"
          @scroll-top-reached="getMoreMessages"
        />
        <div
          ref="menu"
          v-click-outside="closeMenu"
          class="menu align-items-center text-end bg-secondary-subtle shadow-lg rounded-2 lh-base position-fixed z-3"
          :class="{ 'show-list': showListVisible }"
        >
          <ul class="list-unstyled p-0">
            <li @click="handleArchiveChat">
              <a class="text-primary text-decoration-none" href="#">
                Archive Chat
              </a>
            </li>
            <li @click="handlePinChat">
              <a class="text-primary text-decoration-none" href="#">
                Pin Chat
              </a>
            </li>
            <li @click="handleLabelClick">
              <a class="text-primary text-decoration-none" href="#">
                Label Chat
              </a>
            </li>
            <li @click="$emit('mark-as-unread', chat)">
              <a class="text-primary text-decoration-none" href="#">
                Mark as Unread
              </a>
            </li>
            <li @click="handleDeleteChat">
              <a class="text-primary text-decoration-none" href="#">
                Delete Chat
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="message-input m-auto">
        <MessageInput
          @send-message="receiveMessage"
          @scroll-to-bottom="scrollToBottom"
          @send-init-message="sendInit"
          @send-greeting-message="sendGreeting"
          :conversation-id="selectedChat.id"
          :lastMessageDate="lastMessageDate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MessageInput from "@/components/whatsapp/MessageInput.vue";
import ChatBubbles from "@/components/whatsapp/ChatBubbles.vue";
import {
  sendGreetingMessage,
  sendInitMessage,
  sendMessage,
} from "@/plugins/services/authService";
export default {
  emits: [
    "mark-as-unread",
    "pin-chat",
    "open-label",
    "delete-chat",
    "new-message",
  ],
  components: {
    MessageInput,
    ChatBubbles,
  },
  name: "SidebarRight",
  props: {
    selectedChat: {
      type: Object,
      required: true,
    },
    scrollToBot: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      isSearchBarVisible: false,
      showListVisible: false,
      searchQuery: "",
      chatBox_ref: this.$refs.chatBox,
    };
  },
  computed: {
    chatMessages() {
      return this.selectedChat?.messages || [];
    },
    lastMessageDate() {
      console.log("lastMessageDate", this.selectedChat.created_at_last_message);
      return this.selectedChat.created_at_last_message;
    },
  },
  watch: {
    selectedChat: {
      immediate: true,
      handler(newChat, oldChat) {
        if (newChat && (!oldChat || newChat.id !== oldChat.id)) {
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      },
    },
    "selectedChat.messages": {
      immediate: true,
      handler(newMessages, oldMessages) {
        if (
          oldMessages &&
          newMessages.length > oldMessages.length &&
          newMessages[newMessages.length - 1]?.id !== oldMessages[0]?.id
        ) {
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      },
    },
  },
  methods: {
    async receiveMessage(messageData) {
      if (this.selectedChat) {
        try {
          const messageToSend = {
            ...messageData,
            conversation_id: this.selectedChat.id || null,
          };

          if (!messageToSend.conversation_id) {
            console.error("Conversation ID is missing.");
            return;
          }

          const response = await sendMessage(messageToSend);
          console.log("Message sent:", response);
          const newMessage = {
            id: response.data?.data?.id || Date.now(),
            type: "msg-me",
            text: messageData.text_body,
            time: new Date().toLocaleTimeString("en-TR", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Europe/Istanbul",
            }),
            created_at: new Date().toLocaleString("en-TR", {
              timeZone: "Europe/Istanbul",
            }),
            sender: "You",
            isCopied: false,
            conversation_id: this.selectedChat.id,
            isImage: messageData.file?.type.startsWith("image/"),
            isDocument: messageData.file?.type.startsWith("application/"),
            isAudio: messageData.file?.type.startsWith("audio/"),
            isVideo: messageData.file?.type.startsWith("video/"),
            fileName: messageData.file ? messageData.file.name : null,
            fileUrl: messageData.file
              ? URL.createObjectURL(messageData.file)
              : null,
            fileDownloadUrl: messageData.file
              ? URL.createObjectURL(messageData.file)
              : null,
            fileMimeType: messageData.file ? messageData.file.type : null,
            status: "sent",
          };

          this.$emit("new-message", newMessage);
          this.scrollToBottom();
        } catch (error) {
          console.error("Error sending message:", error);
          alert("Failed to send message. Please try again.");
        }
      }
    },
    sendInit(init_message_id) {
      if (this.selectedChat) {
        sendInitMessage(null, this.selectedChat.id, init_message_id || null)
          .then((response) => {
            const newMessage = {
              id: response.data?.data?.last_message?.id || "",
              type: "msg-me",
              text: response.data?.data?.last_message?.text_body || "",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              created_at: new Date().toISOString(),
              sender: "You",
              isCopied: false,
              conversation_id: this.selectedChat.id,
              isImage: false,
              isDocument: false,
              isAudio: false,
              isVideo: false,
              fileName: null,
              fileUrl: null,
              fileDownloadUrl: null,
              fileMimeType: null,
              status: "sent",
            };
            this.$emit("new-message", newMessage);
            this.scrollToBottom();
          })
          .catch((error) => {
            console.error("Error sending init message:", error);
          });
      }
    },

    sendGreeting() {
      if (this.selectedChat) {
        sendGreetingMessage(null, this.selectedChat.id)
          .then((response) => {
            const newMessage = {
              id: response.data?.data?.last_message?.id || "",
              type: "msg-me",
              text: response.data?.data?.last_message?.text_body || "",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              created_at: new Date().toISOString(),
              sender: "You",
              isCopied: false,
              conversation_id: this.selectedChat.id,
              isImage: false,
              isDocument: false,
              isAudio: false,
              isVideo: false,
              fileName: null,
              fileUrl: null,
              fileDownloadUrl: null,
              fileMimeType: null,
              status: "sent",
            };
            this.$emit("new-message", newMessage);
            this.scrollToBottom();
          })
          .catch((error) => {
            console.error("Error sending init message:", error);
          });
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$refs.chatBox;
        chatBox.scrollTo({
          top: chatBox.scrollHeight,
          behavior: "smooth",
        });
      });
    },

    toggleSearchInput() {
      this.isSearchBarVisible = !this.isSearchBarVisible;
    },
    showList() {
      this.showListVisible = !this.showListVisible;
    },
    closeMenu() {
      this.showListVisible = false;
    },

    handlePinChat() {
      this.$emit("pin-chat");
    },
    handleLabelClick() {
      this.$emit("open-label");
    },
    handleDeleteChat() {
      this.$emit("delete-chat");
    },
    handleDeleteMessage(index) {
      this.$emit("delete-message", index);
    },
    async getMoreMessages() {
      this.$emit("get-more-messages");
    },
  },
  directives: {
    clickOutside: {
      beforeMount(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
};
</script>

<style scoped>
.right-side {
  position: relative;
  background-image: url(@/assets/whatsappImage/Default\ WhatsApp\ background.jpg);
  background-size: contain;
  background-position: center;
}

.right-side::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 110px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.4) 30%,
    rgba(0, 0, 0, 0.07) 70%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none;
  z-index: 1;
}
.right-side::after {
  content: ".";
  position: absolute;
  top: 0%;
  left: 0;
  right: 0;
  height: 130px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0) 30%,
    rgba(0, 0, 0, 0.15) 70%,
    rgba(0, 0, 0, 0.3) 100%
  );
  pointer-events: none;
  z-index: 0;
  width: 100%;
  margin: 0 auto;
}
li {
  cursor: pointer;
}
.right-side .message-input {
  position: sticky;
  bottom: 1%;
  width: 98%;
  z-index: 999;
}

.right-side .header {
  height: 50px !important;
  width: 98%;
  margin: 0 auto;
  z-index: 1;
}
@media (max-width: 850px) {
  .right-side .header {
    height: 50px !important;
  }
}
.right-side .header .user-details .user-imgBx {
  width: 35px;
  min-width: 35px;
  height: 35px;
  min-height: 35px;
}
input::placeholder {
  color: white;
}

.searchInput {
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s;
}
.searchInput.show-search {
  opacity: 1;
  visibility: visible;
}

/* chat box */

.right-side .chatBx {
  height: 88vh;
}
.right-side .chatBx .menu {
  top: 8vh;
  right: 1%;
  opacity: 0;
  visibility: hidden;
  transition: all 0.5s;
}

.right-side .chatBx .menu.show-list {
  opacity: 1;
  visibility: visible;
}
.right-side .chatBx .menu ul li {
  padding: 10px 10px 10px 20px;
  transition: all 0.2s;
}
.right-side .chatBx .menu ul li:hover {
  background-color: #fff;
}
.right-side .chat-input {
  position: sticky;
  bottom: 0;
}
/* scroll style */
.right-side .chatBx::-webkit-scrollbar {
  width: 8px;
}

.right-side .chatBx::-webkit-scrollbar-track {
  background: #edebeb97;
}

.right-side .chatBx::-webkit-scrollbar-thumb {
  background: #6d6c6ca7;
  border-radius: 8px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  -ms-border-radius: 8px;
  -o-border-radius: 8px;
}
svg {
  fill: #cfcece;
}
</style>
