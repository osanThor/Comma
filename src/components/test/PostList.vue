<script setup>
import { getPostsByCategory } from "@/services/post.service";
import { watch } from "vue";
import { ref } from "vue";
import { onBeforeMount } from "vue";

const posts = ref([]);
const sort = ref("dec"); // 'desc' | 'asc' | 'likes' | 'comments'

const handleGetPosts = async () => {
  try {
    const data = await getPostsByCategory("free", sort.value);
    if (data) posts.value = data;
  } catch (err) {
    console.error(err);
    alert(err);
  }
};

onBeforeMount(handleGetPosts);
watch(sort, handleGetPosts);
</script>
<template>
  <article class="p-2 border flex-1">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">get POSTS</h2>
      <select name="" id="" v-model="sort">
        <option value="dec">최신순</option>
        <option value="asc">오래된순</option>
        <option value="likes">인기순</option>
        <option value="comments">댓글순</option>
      </select>
    </div>
    <div class="max-h-[800px] overflow-y-auto">
      <pre>
        {{ posts }}
      </pre>
    </div>
  </article>
</template>
<style scoped></style>
