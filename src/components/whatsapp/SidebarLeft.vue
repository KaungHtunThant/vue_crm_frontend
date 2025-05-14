<template>
  <div class="col-12 col-md-4 chatResponsive px-0">
    <div class="left-side bg-secondary-subtle vh-100">
      <div
        class="inputSearch w-100 text-center position-relative d-flex justify-content-center align-items-center"
      >
        <div class="row d-flex justify-content-start align-items-center w-100">
          <div class="col-12">
            <div class="input-group w-100">
              <div class="position-relative flex-grow-1">
                <input
                  type="search"
                  placeholder="Search Here.."
                  v-model="searchQuery"
                  style="outline: none"
                  class="border border-1 border-white py-2 pe-5 ps-5 rounded-2 bg-body text-secondary w-100"
                  id="whatsappSearchInput"
                  @search="fetchConversations"
                />
                <i
                  class="fa-solid fa-magnifying-glass searchIcon fs-6 text-secondary position-absolute"
                ></i>
                <!-- <button
                  v-if="searchQuery"
                  @click="clearSearch"
                  class="btnCloseSearch bg-transparent border-0 position-absolute text-danger d-flex justify-content-center align-items-center gap-1 fs-5"
                >
                  <span>Close</span>
                  <i class="fa-solid fa-xmark"></i>
                </button> -->
              </div>
              <button
                type="button"
                class="btn btn-primary py-2 flex-shrink-0"
                @click="openFilterModal"
              >
                <i class="fa-solid fa-filter text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="chat-list position-relative overflow-auto"
        @scroll="handleScroll"
        ref="chatList"
      >
        <div
          class="chat d-flex justify-content-end align-items-end position-relative w-100 px-lg-3 pt-1 border-1 border-bottom border-secondary-subtle cursor-pointer"
          v-for="(chat, index) in chats"
          :key="index"
          @click="openChat(chat, index)"
          :class="{ active: chat.isActive }"
        >
          <CountryFlagAvatar
            :phone="chat.phone"
            :defaultImage="
              chat.img ||
              require('@/assets/whatsappImage/default-userImage.jpg')
            "
            style="width: 45px; height: 45px !important"
          />
          <div class="details position-relative w-100">
            <div class="d-flex justify-content-between">
              <div class="rating mb-1" style="font-size: 12px">
                <template v-for="index in 7" :key="index">
                  <i
                    class="fa-solid fa-star"
                    :class="
                      index <= (chat.rating || 0)
                        ? 'text-gold'
                        : 'text-lightgray'
                    "
                  ></i>
                </template>
              </div>
              <span style="font-size: 14px" class="time text-success">{{
                chat.time
              }}</span>
            </div>
            <div class="head pe-2 d-flex justify-content-between">
              <h4
                style="font-size: 14px; font-weight: 400"
                class="name text-black"
              >
                {{ chat.name }}
                <span class="text-muted ms-2">{{ chat.phone }}</span>
              </h4>
              <!-- <span style="font-size: 14px" class="time text-success">{{
                chat.time
              }}</span> -->
            </div>
            <div
              class="msgs d-flex justify-content-between align-items-center text-secondary"
            >
              <p
                class="msg pe-2 text-truncate"
                :title="chat.message ?? chat.last_message?.text_body"
              >
                <!-- <span
                  :class="{
                    'text-secondary':
                      chat.message_status === 'sent' ||
                      chat.message_status === 'delivered',
                    'text-info':
                      chat.message_status === 'received' ||
                      chat.message_status === 'read',
                  }"
                  class="pe-1"
                >
                  <i class="fa-solid fa-check fs-6"></i>
                </span> -->
                <span v-if="chat.message_type === 'msg-me'">
                  <span
                    v-if="chat.message_status === 'sent'"
                    class="text-secondary"
                  >
                    <i class="fa-solid fa-check fs-6"></i>
                  </span>
                  <span
                    v-else-if="chat.message_status === 'delivered'"
                    class="text-secondary"
                  >
                    <i class="fa-solid fa-check fs-6"></i>
                    <i class="fa-solid fa-check fs-6"></i>
                  </span>
                  <span
                    v-else-if="chat.message_status === 'read'"
                    class="text-info"
                  >
                    <i class="fa-solid fa-check fs-6"></i>
                    <i class="fa-solid fa-check fs-6"></i>
                  </span>
                  <span
                    v-else-if="chat.message_status === 'undelivered'"
                    class="text-danger"
                  >
                    <i class="fa-solid fa-xmark"></i> (Not sent)
                  </span>
                  <span
                    v-else-if="chat.message_status === 'error'"
                    class="text-danger"
                  >
                    <i class="fa-solid fa-xmark"></i> (Not sent)
                  </span>
                </span>
                {{
                  truncatedMessage(
                    chat.message ?? chat.last_message?.text_body
                  ) || "Media message"
                }}
              </p>
              <div class="d-flex align-items-center gap-3">
                <b
                  class="num"
                  :class="{ unread: chat.unread_count > 0 }"
                  v-if="chat.unread_count > 0"
                >
                  {{ chat.unread_count }}
                </b>
                <i
                  v-if="chat.pinned"
                  class="fa-solid fa-thumbtack pin-icon"
                  title="Pinned Chat"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <FilterModalConv @filter-by-rating="handleFilterByRating" />
</template>

<script>
import { Modal } from "bootstrap";
import FilterModalConv from "@/components/whatsapp/FilterModalConv.vue";
import CountryFlagAvatar from "@/components/whatsapp/CountryFlagAvatar.vue";
import {
  getconversations,
  getMessageConv,
  getMoreConversations,
} from "@/plugins/services/authService";
export default {
  name: "SidebarLeft",
  components: {
    FilterModalConv,
    CountryFlagAvatar,
  },
  data() {
    return {
      searchQuery: "",
      chats: [],
      selectedChat: null,
      newLabel: "",
      modalInstance: null,
      limit: 10,
      offset: 0,
      total: 0,
      isLoading: false,
      locale: localStorage.getItem("locale") || "en",
    };
  },
  methods: {
    async fetchConversations() {
      try {
        const searchText = this.searchQuery;
        const response = await getconversations(searchText);
        this.chats = await response.data.data.map((conversation) => {
          const last_message = conversation.last_message;
          return {
            id: conversation.id,
            created_at: conversation.created_at,
            img:
              conversation.img ||
              require("@/assets/whatsappImage/default-userImage.jpg"),
            name: conversation.name || conversation.contact?.name,
            phone: conversation.phone || "",
            rating: conversation.rating,
            unread_count: conversation.unread_count,
            time: last_message
              ? new Date(last_message.created_at).toLocaleTimeString("en-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Europe/Istanbul",
                })
              : "",
            created_at_last_message: last_message?.created_at || "",
            message: last_message?.text_body || "",
            message_status: last_message?.status,
            message_type:
              last_message?.conversation_member?.type == "User"
                ? "msg-me"
                : "msg-frnd",
            sender: last_message?.conversation_member?.name || "",
            unread: false,
            isActive: false,
            pinned: conversation.pinned,
            label: "",
            messages: [],
            conversation_id: conversation.id,
          };
        });
        this.total = response.data.meta.total;
        this.offset = this.chats.length;
      } catch (error) {
        console.log("No conversations available:", error);
        this.chats = [];
      }
    },
    async fetchMessages(conversationId, chatObj) {
      try {
        const response = await getMessageConv(conversationId);
        console.log("Messages response:", response.data);
        if (response.data && response.data.data) {
          chatObj.messages = response.data.data.map((msg) => ({
            id: msg.id,
            type: msg.status === "sent" ? "msg-me" : "msg-frnd",
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
            isImage: msg.type === "media",
          }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        chatObj.messages = [];
      }
    },

    async openChat(chat, index) {
      try {
        if (index >= 0 && index < this.chats.length) {
          this.chats.forEach((item) => {
            item.isActive = false;
          });

          this.chats[index].isActive = true;
          this.chats[index].unread_count = 0;
          console.log("opening chat:", chat);
          this.$emit("select-chat", {
            ...chat,
            id: chat.id,
            isActive: true,
            messages: [],
          });
        }
      } catch (error) {
        console.error("Error opening chat:", error);
      }
    },
    markAsUnread(chat) {
      chat.unread = true;
      chat.unreadCount = "";
    },
    pinChat(chat) {
      const activeChat = this.chats.find((c) => c.isActive);

      chat.pinned = !chat.pinned;

      this.chats = this.chats.slice().sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      });

      if (!chat.pinned) {
        const pinnedChat = this.chats.find((c) => c.pinned);
        if (pinnedChat) {
          this.chats.forEach((c) => (c.isActive = false));
          pinnedChat.isActive = true;
        } else {
          if (activeChat) {
            const activeIndex = this.chats.findIndex(
              (c) => c.id === activeChat.id
            );
            if (activeIndex !== -1) {
              this.chats[activeIndex].isActive = true;
            }
          }
        }
      } else {
        this.chats.forEach((chat) => (chat.isActive = false));
        chat.isActive = true;
      }
    },
    deleteChat() {
      const activeChat = this.chats.find((chat) => chat.isActive);
      if (activeChat) {
        const index = this.chats.indexOf(activeChat);
        if (index !== -1) {
          this.chats.forEach((chat, idx) => {
            this.chats[idx].isActive = false;
          });
          this.chats.splice(index, 1);
        }
      }
    },
    clearSearch() {
      this.searchQuery = "";
    },
    truncatedMessage(message) {
      if (!message) return "";
      const maxLength = 40;
      if (message.length > maxLength) {
        return message.substring(0, maxLength) + "...";
      }
      return message;
    },

    addNewChat(chat) {
      let chatIndex = this.chats.findIndex((c) => c.id === chat.id);
      let processed_chat = null;
      if (chatIndex === -1) {
        processed_chat = {
          id: chat.id,
          created_at: chat.created_at,
          img:
            chat.img || require("@/assets/whatsappImage/default-userImage.jpg"),
          name: chat.name || chat.contact?.name,
          time: chat.last_message
            ? new Date(chat.last_message.created_at).toLocaleTimeString(
                this.locale == "ar" ? "ar-EG" : "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "UTC",
                }
              )
            : "",
          created_at_last_message: chat.last_message?.created_at || "",
          message: chat.last_message?.text_body || "",
          message_status: chat.last_message?.status,
          message_type:
            chat.last_message?.conversation_member?.type == "User"
              ? "msg-me"
              : "msg-frnd",
          sender: chat.last_message?.conversation_member?.name || "",
          unread: false,
          unreadCount: 0,
          isActive: false,
          pinned: chat.pinned,
          label: "",
          messages: [],
          conversation_id: chat.id,
          phone: chat.phone.phone || chat.phone,
        };
        console.log("Processed chat:", processed_chat);
        this.chats.unshift(processed_chat);
        chatIndex = this.chats.length - 1;
      } else {
        processed_chat = this.chats[chatIndex];
        console.log("Chat already exists:", processed_chat);
      }
      console.log("final processed chat and index", processed_chat, chatIndex);
      this.openChat(processed_chat, chatIndex);
    },
    openFilterModal() {
      const modalElement = document.getElementById("filterWhatsappModal");
      if (modalElement) {
        const modal = new Modal(modalElement);
        modal.show();
      } else {
        console.error("Modal element not found in DOM.");
      }
    },
    async handleScroll() {
      const chatList = this.$refs.chatList;
      if (
        chatList.scrollTop + chatList.clientHeight + 1 >=
          chatList.scrollHeight &&
        this.chats.length < this.total &&
        !this.isLoading
      ) {
        this.isLoading = true;
        const response = await getMoreConversations(this.offset, this.limit);
        if (response.data && response.data.data) {
          this.chats = [
            ...this.chats,
            ...response.data.data.map((conversation) => {
              const last_message = conversation.last_message;
              return {
                id: conversation.id,
                created_at: conversation.created_at,
                img:
                  conversation.img ||
                  require("@/assets/whatsappImage/default-userImage.jpg"),
                name: conversation.name || conversation.contact?.name,
                phone: conversation.phone.phone,
                rating: conversation.rating,
                unread_count: conversation.unread_count,
                time: last_message
                  ? new Date(last_message.created_at).toLocaleTimeString(
                      this.locale == "ar" ? "ar-EG" : "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: "UTC",
                      }
                    )
                  : "",
                created_at_last_message: last_message?.created_at || "",
                message: last_message?.text_body || "",
                sender: last_message?.conversation_member?.name || "",
                unread: false,
                unreadCount: 0,
                isActive: false,
                pinned: conversation.pinned,
                label: "",
                messages: [],
                conversation_id: conversation.id,
              };
            }),
          ];
          this.isLoading = false;
        }
        this.offset += 10;
        console.log("Updated chats:", this.chats);
        // Add logic here to load more chats or perform any desired action
      }
    },
  },
  mounted() {
    this.fetchConversations();
    if (this.$refs.labelModal) {
      this.modalInstance = new Modal(this.$refs.labelModal);
    }
  },
};
</script>

<style scoped>
.left-side .inputSearch {
  height: 70px !important;
}
.left-side .inputSearch .searchIcon {
  left: 4%;
  top: 50%;
  transform: translate(0%, -50%);
}
@media (max-width: 850px) {
  .left-side .inputSearch .searchIcon {
    left: 8%;
    top: 50%;
    transform: translate(0%, -50%);
  }
}
.left-side .inputSearch .btnCloseSearch {
  right: 5%;
  top: 50%;
  transform: translate(0%, -50%);
}
.left-side .inputSearch .btnCloseSearch span {
  font-size: 12px;
}
.left-side .inputSearch input::placeholder {
  font-size: 14px;
}
.left-side .inputSearch input:focus {
  border: 1px solid #a28484ab;
}

/* left sidebar  */
/* scroll style */
.left-side .chat-list::-webkit-scrollbar {
  width: 10px;
}

.left-side .chat-list::-webkit-scrollbar-track {
  background: #edebeb97;
}

.left-side .chat-list::-webkit-scrollbar-thumb {
  background: #6d6c6ca7;
  border-radius: 8px;
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  -ms-border-radius: 8px;
  -o-border-radius: 8px;
}
/* end scroll style */
.left-side .chat-list {
  height: 92vh;
}
.left-side .chat-list .chat {
  cursor: pointer;
}
.left-side .chat-list .chat.active {
  background: #ebebeb;
}

.left-side .chat-list .chat:hover {
  background: #f5f5f5;
}

.left-side .chat-list .chat .imgBx {
  width: 70px;
}

@media (max-width: 850px) {
  .left-side .chat-list .chat .details .head h4.name {
    font-size: 12px !important;
  }
}
.left-side .chat-list .chat .details .msg {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.left-side .chat-list .chat .details .num.unread {
  background-color: #06d755;
  color: #fff;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
}
.message-truncate {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.message-truncate-multiline {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.2em;
  max-height: 2.4em;
}

.message-truncate:hover {
  cursor: pointer;
}
.text-gold {
  color: #ffd700;
}

.text-lightgray {
  color: #d3d3d3;
}
.text-gray {
  color: #6c757d;
}

.text-blue {
  color: #0d6efd;
}
</style>
