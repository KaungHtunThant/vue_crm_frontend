import { defineStore } from "pinia";
import { getcommentstags } from "@/plugins/services/commentsTagsService";

export const useCommentsTagsStore = defineStore("commentstags", {
  state: () => ({
    commentstags: [],
  }),
  getters: {
    getcommentstags: (state) => {
      return state.commentstags;
    },
    getTagById: (state) => {
      return (id) => state.commentstags.find((tag) => tag.id === id);
    },
  },
  actions: {
    async fetchCommentsTags() {
      const result = await getcommentstags();
      this.commentstags = result.data.data;
    },
  },
});
