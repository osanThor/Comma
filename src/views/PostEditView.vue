<script setup>
import PostEditor from "../components/post-edit/PostEditor.vue";
</script>
<template>
  <div
    class="contents-box mx-auto flex flex-col items-center justify-start mt-20 md:py-24 md:px-8 lg:py-20 lg:px-20 mb-80 max-w-[1440px] px-10 py-20 h-auto"
  >
    <section>
      <post-editor :isEdit="true"></post-editor>
    </section>
  </div>
</template>
<style scoped></style>
