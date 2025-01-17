<script setup>
import { getComments } from "@/services/comment.service";
import { ref } from "vue";

const postID = ref("");
const comments = ref([]);

const handleGetComments = async () => {
  try {
    if (!postID.value) return alert("post id 입력");
    const data = await getComments(postID.value);
    if (data) comments.value = data;
  } catch (err) {
    console.error(err);
    alert(err);
  }
};
</script>
<template>
  <article class="p-2 border flex-1">
    <h2 class="text-xl font-bold">get COMMENTS</h2>
    <form
      class="flex flex-col gap-2 items-start mb-10"
      @submit.prevent="handleGetComments"
    >
      <label for="select-comment-post-id">postID</label>
      <input type="text" v-model="postID" />
      <button type="submit">찾기</button>
    </form>
    <pre>
    {{ comments }}
  </pre
    >
  </article>
</template>
<style scoped></style>
