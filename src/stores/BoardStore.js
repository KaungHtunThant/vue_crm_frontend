import { defineStore } from "pinia";
import { getAllBoards } from "@/plugins/services/boardService";

export const useBoardStore = defineStore("board", {
  state: () => ({
    boards: [],
    currentBoard: null,
  }),
  getters: {
    getAllBoards: (state) => {
      return state.boards;
    },
    getCurrentBoard: (state) => {
      return state.currentBoard;
    },
  },
  actions: {
    async fetchAllBoards() {
      const response = await getAllBoards();
      if (response.status !== 200) {
        throw new Error("Failed to fetch boards");
      }
      this.boards = response.data.data;
    },
    setCurrentBoardWithId(board_id) {
      this.currentBoard = this.boards.find((b) => b.id === board_id) || null;
    },
    setCurrentBoardWithSlug(board_slug) {
      this.currentBoard =
        this.boards.find((b) => b.slug === board_slug) || null;
    },
  },
});
