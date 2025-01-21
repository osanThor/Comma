import { defineStore } from "pinia";
import { createComment, getComments } from "../services/comment.service";
import { addLike } from "../services/like.service";
import { useAuthStore } from "./auth";

export const useCommentStore = defineStore("comment", {
  state: () => ({
    comments: [],
    totalCount: 0,
  }),
  actions: {
    async fetchComments(postId) {
      try {
        const { data, totalCount } = await getComments(postId);
        this.comments = data;
        this.totalCount = totalCount;
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
      }
    },
    async addComment(postId, content) {
      try {
        const authStore = useAuthStore();
        const userId = authStore.user.id;
        console.log("addComment 호출됨", { postId, content, userId });
        const data = await createComment({ postId, content, userId });

        const index = this.comments.findIndex(
          (comment) => comment.id === data[0].id
        );
        if (index !== -1) {
          this.comments[index] = data[0];
        } else {
          this.comments.push(data[0]);
        }
        this.totalCount += 1;
      } catch (error) {
        console.error("댓글 작성 실패:", error);
      }
    },
    addOptimisticComment(comment) {
      this.comments.push(comment);
    },
    removeOptimisticComment(commentId) {
      this.comments = this.comments.filter(
        (comment) => comment.id !== commentId
      );
    },

    async likeComment(commentId) {
      try {
        const authStore = useAuthStore();
        const userId = authStore.user.id;
        const response = await addLike({
          userId,
          targetId: commentId,
          targetType: "comment",
        });
        const comment = this.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.like_count = (comment.like_count || 0) + 1;
          comment.liked = true;
        }
        return response;
      } catch (error) {
        console.error("댓글 좋아요 실패:", error);
        throw error;
      }
    },
  },
});
