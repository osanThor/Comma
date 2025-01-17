<script setup>
import { useAuthStore } from "@/stores/auth";
import { reactive } from "vue";
import { uploadImage } from "@/services/upload.service";
import { updateUserProfile } from "@/services/user.service";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const body = reactive({
  name: authStore.user.name || "",
  bio: authStore.user.bio || "",
  profile_image: authStore.user.profile_image || "",
});

const handleChange = async (event) => {
  try {
    const files = event.target.files;
    if (!files || !files[0]) return;
    const file = files[0];
    body.profile_image = await uploadImage(file);
  } catch (err) {
    console.error(err);
  }
};

const handleSubmit = async () => {
  if (!body.name) return alert("이름 필수");
  try {
    await updateUserProfile(user.value.id, body);
    alert("성공");
  } catch (error) {
    console.error("프로필 업데이트 실패:", error.message);
    alert("실패");
  }
};
</script>
<template>
  <div>
    <h1>프로필 수정</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">이름:</label>
        <input v-model="body.name" type="text" id="name" />
      </div>
      <div>
        <label for="bio">소개:</label>
        <textarea v-model="body.bio" id="bio"></textarea>
      </div>
      <div>
        <label for="profile_image">프로필 이미지 URL:</label>
        <img :src="body.profile_image" alt="" />
        <input
          type="file"
          id="profile_image"
          accept="image/png, image/jpeg, image/jpg"
          @change="handleChange($event)"
        />
        <input v-model="body.profile_image" type="text" hidden />
      </div>
      <button type="submit">저장</button>
    </form>
  </div>
</template>

<style scoped></style>
