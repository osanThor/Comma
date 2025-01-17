<script>
import PostEditContent from './PostEditContent.vue';
import PostEditImg from './PostEditImg.vue';
export default {
  name: "PostEditor",
  components:{
    PostEditContent,
    PostEditImg,
  }
};
</script>


<template>
  <main class="flex flex-row items-center justify-center gap-12">
    <PostEditImg />
    <PostEditContent />
  </main>
</template>

<style lang="scss" scoped></style>
