<script>
import { ref } from "vue";
import { useCommentStore } from "../../stores/comment";
import { useAuthStore } from "../../stores/auth";

export default {
  name: "PostCommentInput",
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const commentStore = useCommentStore();
    const authStore = useAuthStore();
    const commentContent = ref("");

    const submitComment = async () => {
      console.log("submitComment 호출됨");
      if (commentContent.value.trim() === "") return;

      const user = authStore.user;

      const optimisticComment = {
        id: Date.now().toString(),
        post_id: props.postId,
        user_id: user.id,
        content: commentContent.value,
        created_at: new Date().toISOString(),
        user: {
          id: user.id,
          name: user.name,
          profile_image: user.profile_image || '/assets/images/exProfile.png',
        },
        like_count: 0,
        liked: false,
      };
      commentStore.addOptimisticComment(optimisticComment);
      commentContent.value = "";

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

    return {
      commentContent,
      submitComment,
      handleKeyPress,
    };
  },
};
</script>

<template>
  <section class="relative w-[1090px] h-[104px] mt-16">
    <img
      @click="submitComment"
      class="absolute bottom-0 right-0 m-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300"
      src="/assets/images/icons/post-send-icon.svg"
    />
    <textarea
      v-model="commentContent"
      @keypress="handleKeyPress"
      name="PostComment"
      class="w-full h-full bg-white/20 border-2 focus:outline-none focus:placeholder:opacity-0 font-medium rounded-xl p-5 placeholder:text-white/50 text-white resize-none overflow-auto"
      placeholder="댓글을 입력해주세요 φ(゜▽゜*)♪"
      id=""
    ></textarea>
  </section>
  <hr class="border-dashed border-2 my-16 opacity-30" />
</template>

<style scoped></style>
