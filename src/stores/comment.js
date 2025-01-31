import { defineStore } from "pinia";
import { createComment, getComments } from "../services/comment.service";
import { addLike, checkLike, removeLike } from "../services/like.service";
import { useAuthStore } from "./auth";

export const useCommentStore = defineStore("comment", {
  state: () => ({
    comments: [],
    totalCount: 0,
  }),
  actions: {
    async fetchComments(postId, sort, page, limit) {
      try {
        const { data, totalCount } = await getComments(
          postId,
          sort,
          page,
          limit
        );
        const authStore = useAuthStore();
        const userId = authStore.user.id;

        const commentsWithLikes = await Promise.all(
          data.map(async (comment) => {
            const liked = await checkLike({
              userId,
              targetId: comment.id,
              targetType: "comment",
            });
            return {
              ...comment,
              liked,
              like_count: comment.like_count || 0,
            };
          })
        );

        this.comments = commentsWithLikes;
        this.totalCount = totalCount;
      } catch (error) {
        console.error("댓글 불러오기 실패:", error);
      }
    },
    async addComment(postId, content) {
      try {
        const authStore = useAuthStore();
        const userId = authStore.user.id;
        await createComment({ postId, content, userId });

      } catch (error) {
        console.error("댓글 작성 실패:", error);
        throw error;
      }
    },
    addOptimisticComment(comment, prepend = false) {
      if(prepend){
        this.comments.unshift(comment);
      } else {
        this.comments.push(comment);
      }
      this.totalCount += 1;
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
          comment.like_count += 1;
          comment.liked = true;
        }
        return response;
      } catch (error) {
        console.error("댓글 좋아요 실패:", error);
        throw error;
      }
    },

    async unlikeComment(commentId) {
      try {
        const authStore = useAuthStore();
        const userId = authStore.user.id;
        const response = await removeLike({
          userId,
          targetId: commentId,
          targetType: "comment",
        });
        const comment = this.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.like_count -= 1;
          comment.liked = false;
        }
        return response;
      } catch (error) {
        console.error("댓글 좋아요 취소 실패:", error);
        throw error;
      }
    },
  },
});
