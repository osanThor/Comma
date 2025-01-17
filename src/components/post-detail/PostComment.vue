<script>
import PostCommentCard from '../post-detail/PostCommentCard.vue';
export default {
  name: "PostComment",
  components: {
    PostCommentCard,
  }
};

</script>

<template>
  <section class="flex flex-col items-center w-[1000px] mx-auto ">
    <!-- 댓글 상단 -->
    <header class="flex flex-row items-end justify-between w-full text-white">
      <p class="font-bold text-2xl">댓글 10개</p>
      <div class="flex flex-row items gap-5 font-bold text-lg">
        <button class="hover:text-point-500">최신순</button>
        <button class="hover:text-point-500">인기순</button>
      </div>
    </header>
    <main class="w-full">
      <!-- 댓글 목록 -->
      <PostCommentCard />
    </main>
  </section>
</template>

<style scoped></style>
