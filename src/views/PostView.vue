<script setup>
import PostContent from "../components/post-detail/PostContent.vue";
import PostCommentInput from "../components/post-detail/PostCommentInput.vue";
import PostComment from "../components//post-detail/PostComment.vue";

const route = useRoute();
const postId = route.params.postId;
</script>
<template>
  <main
    class="contents-box mx-auto my-auto flex items-center mt-32 py-28 px-40 sm:px-8 lg:px-40 mb-80"
  >
    <section class="overflow-x-auto overflow-y-auto">
      <PostContent :postId="postId" />
      <PostCommentInput :postId="postId" />
      <PostComment :postId="postId" />
    </section>
  </main>
</template>
<style scoped></style>
