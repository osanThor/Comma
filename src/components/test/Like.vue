<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { checkLike, addLike, removeLike } from "@/services/like.service";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const targetId = ref("");
const targetType = ref("post"); //'post' | 'comment'
const loading = ref(false);
const fetched = ref(false);

const isLike = ref(false);

const handleSubmit = async () => {
  if (!user.value || !user.value.id) return alert("로그인해주세요");
  try {
    loading.value = true;
    fetched.value = false;

    const data = await checkLike({
      userId: user.value.id,
      targetId: targetId.value,
      targetType: targetType.value,
    });
    isLike.value = data;
    fetched.value = true;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleLike = async () => {
  if (!user.value || !user.value.id) return alert("로그인해주세요");
  try {
    const data = await addLike({
      userId: user.value.id,
      targetId: targetId.value,
      targetType: targetType.value,
    });
    console.log(data);
  } catch (err) {
    console.error(err);
  } finally {
    await handleSubmit();
  }
};

const handleUnLike = async () => {
  if (!user.value || !user.value.id) return alert("로그인해주세요");
  try {
    const data = await removeLike({
      userId: user.value.id,
      targetId: targetId.value,
      targetType: targetType.value,
    });
    console.log(data);
  } catch (err) {
    console.error(err);
  } finally {
    await handleSubmit();
  }
};

const handleClick = () => (isLike.value ? handleUnLike() : handleLike());
</script>
<template>
  <article class="p-2 border flex-1">
    <h2 class="text-xl font-bold">LIKE</h2>
    <form
      class="flex flex-col gap-2 items-start mb-10"
      @submit.prevent="handleSubmit"
    >
      <label for="targetID">target ID</label>
      <input
        type="text"
        id="targetID"
        placeholder="타겟 id 입력"
        v-model="targetId"
        required
      />
      <select name="" id="" v-model="targetType">
        <option value="post">post</option>
        <option value="comment">comment</option>
      </select>
      <button type="submit" :disabled="loading" class="px-7 py-4 border">
        {{ loading ? "로딩..." : "찾기" }}
      </button>
    </form>
    <button v-show="fetched" @click="handleClick">
      {{ isLike ? "좋아요 취소" : "좋아요" }}
    </button>
  </article>
</template>
<style scoped></style>
