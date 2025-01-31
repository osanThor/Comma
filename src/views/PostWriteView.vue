<script setup>
import PostEditor from "../components/post-edit/PostEditor.vue";
</script>
<template>
  <div
    class="contents-box mx-auto flex flex-col items-center justify-start mt-24 md:py-16 md:px-20 lg:py-24 lg:px-28 mb-80 max-w-[1440px] px-10 py-10 h-auto"
  >
    <section>
      <post-editor :isEdit="false"></post-editor>
    </section>
  </div>
</template>
<style scoped></style>
