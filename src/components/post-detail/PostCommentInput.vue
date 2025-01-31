<script>
import { ref } from "vue";
import { useCommentStore } from "@/stores/comment";
import { useAuthStore } from "@/stores/auth";
import { usePostStore } from "@/stores/post";
import { createNotification } from "@/services/notification.service";

export default {
  name: "PostCommentInput",
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const postStore = usePostStore();
    const commentStore = useCommentStore();
    const authStore = useAuthStore();
    const commentContent = ref("");
    const maxCharacters = 420;

    const submitComment = async () => {
      if (commentContent.value.trim() === "") return;

      const user = authStore.user;

      const optimisticComment = {
        id: `temp-${Date.now().toString()}`,
        post_id: props.postId,
        user_id: user.id,
        content: commentContent.value,
        created_at: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          profile_image: user.profile_image || "/assets/images/exProfile.png",
        },
        like_count: 0,
        liked: false,
      };
      commentStore.addOptimisticComment(optimisticComment, true);
      commentContent.value = "";

      if (postStore.user && postStore.user.id !== user.id) {
        await createNotification({
          userId: postStore.user.id,
          senderId: user.id,
          targetId: props.postId,
          targetType: "post",
          type: "comment",
          message: ` 회원님의 게시글에 댓글을 남겼습니다.`,
        });
      }
      try {
        await commentStore.addComment(props.postId, optimisticComment.content);
      } catch (error) {
        console.error("댓글 작성 실패:", error);
        commentStore.removeOptimisticComment(optimisticComment.id);
      }
    };

    const handleKeyPress = async (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        await submitComment();
      }
    };

    const handleInput = (event) => {
      const input = event.target.value;
      if (input.length > maxCharacters) {
        commentContent.value = input.slice(0, maxCharacters);
      } else {
        commentContent.value = input;
      }
    };

    return {
      commentContent,
      maxCharacters,
      handleInput,
      submitComment,
      handleKeyPress,
    };
  },
};
</script>

<template>
  <section class="relative mx-auto w-full h-full mt-8">
    <img
      @click="submitComment"
      class="absolute bottom-4 right-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300"
      src="/assets/images/icons/post-send-icon.svg"
    />
    <textarea
      v-model="commentContent"
      @keypress="handleKeyPress"
      @input="handleInput"
      name="PostComment"
      class="w-full h-full min-h-28 bg-white/20 border-2 focus:placeholder:opacity-0 font-medium rounded-xl p-5 placeholder:text-white/50 text-white resize-none overflow-auto focus:outline-4 focus:outline-point-500/30"
      placeholder="댓글을 입력해주세요 φ(゜▽゜*)♪"
      id=""
    ></textarea>
  </section>
  <hr class="border-dashed border-2 mt-8 mb-8 opacity-30 w-full" />
</template>

<style scoped>
textarea {
  scrollbar-width: none;
}
</style>
