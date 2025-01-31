<script setup>
import PostContent from "../components/post-detail/PostContent.vue";
import PostCommentInput from "../components/post-detail/PostCommentInput.vue";
import PostComment from "../components//post-detail/PostComment.vue";
import BaseFooter from "@/components/common/Footer.vue";

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
  <div
    class="contents-box mx-auto flex flex-col items-center justify-start mt-24 md:py-16 md:px-20 lg:py-24 lg:px-28 mb-10 max-w-[1440px] px-10 py-10 h-auto"
  >
    <section class="w-full flex flex-col gap-8">
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
  </div>
  <base-footer></base-footer>
</template>
<style scoped></style>
