<script setup>
import PostContent from "../components/post-detail/PostContent.vue";
import PostCommentInput from "../components/post-detail/PostCommentInput.vue";
import PostComment from "../components//post-detail/PostComment.vue";

const route = useRoute();
const postId = route.params.postId;
const router = useRouter();

const navigateToProfile = (userId) => {
  if (userId) {
    router.push(`/user/${userId}`);
  }
};
</script>
<template>
  <main
    class="contents-box mx-auto my-auto flex items-center mt-32 py-28 px-40 sm:px-8 lg:px-40 mb-80"
  >
    <section class="">
      <post-content
        :postId="postId"
        :navigateToProfile="navigateToProfile"
      ></post-content>
      <post-comment-input :postId="postId"></post-comment-input>
      <post-comment
        :postId="postId"
        :navigateToProfile="navigateToProfile"
      ></post-comment>
    </section>
  </main>
</template>
<style scoped></style>
