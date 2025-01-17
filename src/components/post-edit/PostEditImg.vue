<script>
import PostEditImgCard from "./PostEditImgCard.vue";
export default {
  name: "PostEditImg",
  components: {
    PostEditImgCard,
  },
};
</script>

<template>
  <section class="flex flex-col items-center">
    <div>
      <PostEditImgCard />
    </div>
    <div class="flex flex-row items-center w-full justify-between mt-2">
      <PostEditImgCard :size="`w-[140px] h-[140px]`" :opacity=70 />
      <PostEditImgCard :size="`w-[140px] h-[140px]`" :opacity=50 />
      <PostEditImgCard :size="`w-[140px] h-[140px]`" :opacity=30 />
    </div>
  </section>
</template>

<style scoped></style>
