<script setup>
import AfterGameOverButton from "./AfterGameOverButton.vue";
import { ref, watch } from "vue";
import { uploadImage } from "@/services/upload.service";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { createPost } from "@/services/post.service";
import { useRoute, useRouter } from "vue-router";

const { imageBlobs, score, playTime } = defineProps({
  imageBlobs: {
    type: Array,
  },
  score: {
    type: String,
  },
  playTime: {
    type: String,
  },
});

const emit = defineEmits(["removeImage", "uploadImage"]);

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const title = ref("");
const content = ref("");
const category = ref("");

const fileInputRef = ref(null);

const isGameShareModalOpen = ref(true);

const closeGameShareModal = () => {
  isGameShareModalOpen.value = false;
  window.location.reload();
};

const handleUploadImage = (e) => {
  const files = e.target.files;
  if (!files || !files[0]) return;

  const newFile = {
    file: files[0],
    preview: URL.createObjectURL(files[0]),
  };

  emit("uploadImage", newFile);
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
    const images = await Promise.all(
      imageBlobs.map((file) => handleGetImageURL(file.file))
    );
    const data = await createPost({
      userId: user.value.id,
      title: title.value,
      category: category.value,
      content: content.value,
      images,
      score,
      playTime,
    });

    if (data && data.postId) {
      const postId = data.postId;
      router.push(`/post/${postId}`);
    }
  } catch (err) {
    console.error(err);
  }
};

watch(
  () => route.name,
  (newGameName) => {
    category.value = newGameName;
  },
  { immediate: true }
);
</script>

<template>
  <div
    v-if="isGameShareModalOpen"
    class="w-[538px] h-[754px] border-4 border-white rounded-[28px] bg-main-500"
  >
    <form @submit.prevent="handleSubmit">
      <header class="flex flex-col items-center">
        <input
          type="text"
          class="w-[372px] mt-[52px] mx-auto text-white font-dnf text-3xl placeholder:text-white placeholder:font-dnf placeholder:opacity-70 bg-transparent text-center focus:outline-none border-none shadow-none focus:placeholder-transparent"
          placeholder="제목을 입력해 주세요..."
          v-model="title"
          required
        />
        <div class="w-[372px] h-[2px] bg-white mt-3 opacity-50"></div>
      </header>
      <main class="flex flex-col items-center">
        <!-- 이미지 업로드 섹션 -->
        <section
          class="relative w-[332px] h-[192px] border-[6px] mt-9 border-white rounded-[10px] flex items-center justify-center"
        >
          <input
            type="file"
            ref="fileInputRef"
            class="hidden"
            @change="handleUploadImage($event)"
            accept="image/png, image/jpeg, image/jpg"
          />
          <!-- 이미지 업로드 버튼 -->
          <button
            v-if="imageBlobs.length === 0"
            type="button"
            class="absolute w-[42px] h-[42px] rounded-full flex items-center justify-center text-white text-xl shadow-lg"
            @click="fileInputRef?.click()"
          >
            <img
              src="/assets/images/icons/gameOver-postEdit-ImgPlus-icon.svg"
              alt="Add Image"
            />
          </button>
          <!-- 이미지 삭제 버튼 -->
          <button
            v-if="imageBlobs.length > 0"
            type="button"
            class="group absolute bottom-[-16px] right-[-16px] w-[42px] h-[42px] bg-point-500 hover:bg-white rounded-full flex items-center justify-center text-white text-xl shadow-lg"
            @click="emit('removeImage')"
          >
            <img
              src="/assets/images/icons/trash-white.svg"
              alt="Delete Image"
              class="w-7 h-7 object-contain group-hover:hidden"
            />
            <img
              src="/assets/images/icons/trash-pink.svg"
              alt="Delete Image Hover"
              class="w-7 h-7 object-contain hidden group-hover:block"
            />
          </button>
          <!-- 이미지 프리뷰 -->
          <div class="w-full h-full">
            <img
              v-if="imageBlobs.length > 0"
              :src="imageBlobs[0].preview"
              alt="'첨부된 이미지"
              class="w-full h-full object-cover rounded-md"
            />
          </div>
        </section>
        <!-- 본문 입력 -->
        <section
          class="w-[372px] h-[230px] border-2 mt-9 border-main-100 rounded-[10px] bg-white bg-opacity-10"
        >
          <textarea
            name="content"
            class="w-full h-full pt-6 pl-8 pr-7 text-white bg-transparent placeholder:text-main-100 placeholder:font-pretendard placeholder:text-base focus:outline-none resize-none focus:placeholder-transparent"
            placeholder="최고의 순간을 공유해 보세요!"
            v-model="content"
            required
          ></textarea>
        </section>
      </main>
      <footer class="flex justify-between mx-[82px] mt-[32px]">
        <after-game-over-button
          text="CANCEL"
          bg-color="bg-main-400"
          @click="closeGameShareModal"
        ></after-game-over-button>
        <after-game-over-button
          text="SHARE"
          type="submit"
        ></after-game-over-button>
      </footer>
    </form>
  </div>
</template>
