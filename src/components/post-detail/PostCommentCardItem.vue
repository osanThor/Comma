<script>
import { useCommentStore } from "../../stores/comment";

export default {
  name: "PostCommentCardItem",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const commentStore = useCommentStore();

    const likeComment = async (commentId) => {
      await commentStore.likeComment(commentId);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("ko-KR", options).replace(/\.$/, "");
    };

    return {
      likeComment,
      formatDate,
    };
  },
};
</script>

<template>
  <div
    class="flex flex-row items-center justify-between my-20 comment-card-item"
  >
    <!-- 작성자 프로필 이미지 -->
    <div class="w-16 h-16 rounded-full">
      <img
        class="w-full h-full object-cover object-center rounded-full"
        :src="comment.user.profile_image || '/assets/images/exProfile.png'"
      />
    </div>

    <!-- 댓글 콘텐츠 -->
    <div>
      <!-- 닉네임 및 작성일시 -->
      <div class="flex flex-row items-center text-white gap-2">
        <p class="font-bold text-xl leading-0">{{ comment.user.name }}</p>
        <p class="font-medium text-xs text-white/50 leading-0 pt-1">
          {{ formatDate(comment.created_at) }}
        </p>
      </div>
      <!-- 댓글 본문 -->
      <p class="w-[790px] h-auto text-white/70 font-semibold mr-16">
        {{ comment.content }}
      </p>
    </div>
    <!-- 좋아요 -->
    <div class="flex flex-col items-center font-medium text-white">
      <img
        @click="likeComment(comment.id)"
        :src="
          comment.liked
            ? '/assets/images/icons/post-like-icon.png'
            : '/assets/images/icons/post-nolike-icon.png'
        "
      />
      <p>{{ comment.like_count || 0 }}</p>
    </div>
  </div>
</template>

<style scoped></style>
