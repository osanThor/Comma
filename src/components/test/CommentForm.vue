<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { createComment } from "@/services/comment.service";
import { createNotification } from "@/services/notification.service";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const postID = ref("");
const content = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  if (!user.value || !user.value.id) return alert("로그인해주세요");
  try {
    loading.value = true;

    const data = await createComment({
      postId: postID.value,
      content: content.value,
      userId: user.value.id,
    });
    if (data) {
      await createNotification({
        userId: user.value.id, // 바꿔야함 받는 사람으로
        senderId: user.value.id,
        targetId: postID.value,
        targetType: "post",
        type: "comment",
        message: `${user.value.name}님이 ${user.value.name}님 게시글에 댓글을 남겼습니다.`,
      });
      alert(data);
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <article class="p-2 border flex-1">
    <h2 class="text-xl font-bold">post COMMENT</h2>
    <form
      class="flex flex-col gap-2 items-start mb-10"
      @submit.prevent="handleSubmit"
    >
      <label for="postID">포스트 ID</label>
      <input
        type="text"
        id="postID"
        placeholder="제목 입력"
        v-model="postID"
        required
      />
      <label for="comment-content">내용</label>
      <textarea
        name="comment-content"
        id="comment-content"
        cols="30"
        rows="10"
        placeholder="내용 입력"
        v-model="content"
        required
      ></textarea>

      <button type="submit" :disabled="loading" class="px-7 py-4 border">
        {{ loading ? "로딩..." : "저장" }}
      </button>
    </form>
  </article>
</template>
<style scoped></style>
