<script>
import { useCommentStore } from "../../stores/comment";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "PostCommentCardItem",
  props: {
    comment: {
      type: Object,
      required: true,
    },
    navigateToProfile: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const commentStore = useCommentStore();
    const isAnimating = ref(false);
    const router = useRouter();

    const toggleLike = async (commentId) => {
      if (isAnimating.value) return;
      isAnimating.value = true;

      const updatedComment = { ...props.comment };

      if (updatedComment.liked) {
        updatedComment.like_count -= 1;
        updatedComment.liked = false;
        await commentStore.unlikeComment(commentId);
      } else {
        updatedComment.like_count += 1;
        updatedComment.liked = true;
        await commentStore.likeComment(commentId);
      }

      props.comment.like_count = updatedComment.like_count;
      props.comment.liked = updatedComment.liked;

      setTimeout(() => {
        isAnimating.value = false;
      }, 50);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("ko-KR", options).replace(/\.$/, "");
    };

    return {
      toggleLike,
      formatDate,
      isAnimating,
    };
  },
};
</script>

<template>
  <div
    v-if="comment && comment.user"
    class="flex flex-row items-center justify-between mb-8 lg:mb-12 w-full"
  >
    <section class="flex flex-row items-start gap-4 ">
      <div class="pt-2">

        <!-- 작성자 프로필 이미지 -->
        <div
        @click="navigateToProfile(comment.user?.id)"
        class="md:w-8 md:h-8 lg:w-14 lg:h-14 rounded-full cursor-pointer "
        >
        <img
          class="w-full h-full object-cover object-center rounded-full"
          :src="comment.user?.profile_image || '/assets/images/defaultProfile.png'"
        />
      </div>
    </div>
      
      <!-- 댓글 콘텐츠 -->
      <div>
        <!-- 닉네임 및 작성일시 -->
        <div class="flex flex-row items-center text-white gap-2">
          <p class="font-semibold text-lg leading-0">
            {{ comment.user?.name || "알수없음" }}
          </p>
          <p class="font-medium text-xs text-white/50 leading-0 pt-1">
            {{ formatDate(comment.created_at) }}
          </p>
        </div>
        <!-- 댓글 본문 -->
        <p class="w-full max-w-[750px] h-auto text-white/70 font-medium text-sm mr-16">
          {{ comment.content }}
        </p>
      </div>
    </section>
    
    <!-- 좋아요 -->
    <div
      class="w-6 flex flex-col items-center justify-center font-medium text-white object-contain"
    >
      <img
        :class="['like-icon', { 'animate-like': isAnimating }]"
        @click="toggleLike(comment.id)"
        :src="
          comment.liked
            ? '/assets/images/icons/post-like-icon.png'
            : '/assets/images/icons/post-nolike-icon.png'
        "
      />
      <p
        v-if="comment.like_count > 0"
        :class="['text-sm', { 'text-point-500': comment.liked }]"
      >
        {{ comment.like_count.toString().padStart(2, "0") }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.like-icon {
  width: 26px;
  height: 26px;
  object-fit: contain;
  transition: transform 0.05s ease-in-out;
}

.animate-like {
  transform: scale(1.3);
}
</style>
