<script>
import { onMounted, computed } from 'vue';
import { useCommentStore } from '../../stores/comment.js';
import PostCommentCard from '../post-detail/PostCommentCard.vue';

export default {
  name: "PostComment",
  props: {
    postId: {
      type: String,
      required: true,
    },
  },
  components: {
    PostCommentCard,
  },
  setup(props) {
    const commentStore = useCommentStore();

    onMounted(() => {
      if (props.postId) {
        commentStore.fetchComments(props.postId);
      } else {
        console.error('postId가 정의되지 않았습니다.');
      }
    });

    const comments = computed(() => commentStore.comments);
    const totalCount = computed(() => commentStore.totalCount);

    return {
      comments,
      totalCount,
    };
  },
}
</script>

<template>
  <section class="flex flex-col items-center w-[1000px] mx-auto ">
    <!-- 댓글 상단 -->
    <header class="flex flex-row items-end justify-between w-full text-white">
      <p class="font-bold text-2xl">댓글 {{ totalCount }}개</p>
      <div class="flex flex-row items gap-5 font-bold text-lg">
        <button class="hover:text-point-500">최신순</button>
        <button class="hover:text-point-500">인기순</button>
      </div>
    </header>
    <main class="w-full">
      <!-- 댓글 목록 -->
      <PostCommentCard v-for="comment in comments" :key="comment.id" :comment="comment" />
    </main>
  </section>
</template>

<style scoped></style>
