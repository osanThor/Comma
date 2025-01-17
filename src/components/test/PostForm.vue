<script setup>
import { uploadImage } from "@/services/upload.service";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { createPost } from "@/services/post.service";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const title = ref("");
const content = ref("");
const imageBlobs = ref([]);
const loading = ref(false);

const handleUploadImage = (e) => {
  const files = e.target.files;
  if (!files || !files[0]) return;
  if (imageBlobs.value.length + Array.from(files).length > 4) {
    e.target.value = "";
    alert("최대 4개까지");
    return;
  }
  const newFiles = Array.from(files).map((file) => {
    return { file, preview: URL.createObjectURL(file) };
  });

  imageBlobs.value.push(...newFiles);
  e.target.value = "";
};

const handleGetImageURL = async (file) => {
  try {
    return await uploadImage(file);
  } catch (err) {
    console.error(err);
  }
};

const handleSubmit = async () => {
  if (!user.value || !user.value.id) return alert("로그인해주세요");
  try {
    loading.value = true;
    const images = await Promise.all(
      imageBlobs.value.map((file) => handleGetImageURL(file.file))
    );
    const data = await createPost({
      userId: user.value.id,
      category: "free",
      title: title.value,
      content: content.value,
      images,
    });
    if (data) alert(data);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <article class="p-2 border flex-1">
    <h2 class="text-xl font-bold">post POST</h2>
    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col gap-2 items-start mb-10"
    >
      <label for="title">제목</label>
      <input
        type="text"
        id="title"
        placeholder="제목 입력"
        v-model="title"
        required
      />
      <label for="content">내용</label>
      <textarea
        name="content"
        id="content"
        cols="30"
        rows="10"
        placeholder="내용 입력"
        v-model="content"
        required
      ></textarea>
      <label for="images">이미지</label>
      <input
        type="file"
        id="images"
        @change="handleUploadImage($event)"
        accept="image/png, image/jpeg, image/jpg"
        multiple
      />
      <ul>
        <li v-for="(file, idx) in imageBlobs" :key="idx">
          <img :src="file.preview" :alt="'이미지 ' + idx" />
        </li>
      </ul>
      <button type="submit" :disabled="loading" class="px-7 py-4 border">
        {{ loading ? "로딩..." : "저장" }}
      </button>
    </form>
  </article>
</template>
<style scoped></style>
