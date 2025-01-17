<script setup>
import PostContent from "../components/post-detail/PostContent.vue";
import PostCommentInput from "../components/post-detail/PostCommentInput.vue";
import PostComment from "../components//post-detail/PostComment.vue";
</script>
<template>
  <main
    class="contents-box min-h-screen w-[1440px] mx-auto flex items-center justify-center mt-32 py-36 px-44 mb-80"
  >
    <section class="overflow-x-auto">
      <PostContent />
      <PostCommentInput />
      <PostComment />
    </section>
  </main>
</template>
<style scoped></style>
