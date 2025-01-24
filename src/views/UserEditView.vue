<script setup>
import router from "@/router";
import { uploadImage } from "@/services/upload.service";
import { updateUserProfile } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth.js";
import { useToastStore } from "@/stores/toast";
import { ref } from "vue";

const authStore = useAuthStore();
const { updateUser } = authStore;
const { user } = storeToRefs(authStore);

const { addToast } = useToastStore();

const name = ref(user.value.name);
const email = ref(user.value.email);
const profilePictureFile = ref(null); // 프로필 사진 경로를 저장하는 ref
const profilePictureSrc = ref(""); // 프로필 사진 경로를 저장하는 ref
const bio = ref(user.value.bio || "");
const charCount = ref(user.value.bio?.length || 0);

function navigateToUserPage() {
  router.push(`/user/${user.value.id}`); // Navigate to user page
}

const updateCharCount = () => {
  charCount.value = bio.value.length;
};

const updateProfilePictureHandler = async () => {
  const fileInput = document.getElementById("profile-picture-input");
  if (fileInput) fileInput.click(); // Trigger file input click
};

// 파일 선택 시 호출되는 함수
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    profilePictureFile.value = file;
    // 로컬 URL을 생성하여 이미지를 미리보기
    profilePictureSrc.value = URL.createObjectURL(file);
  }
};

const handleUpdateUser = async () => {
  try {
    if (!name.value) return addToast("닉네임을 입력해주세요.");
    if (name.value.length > 10) return addToast("닉네임은 최대 10자까지에요.");
    if (bio.value.length > 150)
      return addToast("자기소개는 최대 150자까지에요.");
    const body = {
      name: name.value.trim(),
      bio: bio.value.trim() || null,
    };
    if (profilePictureFile.value) {
      const url = await uploadImage(profilePictureFile.value);
      body.profile_image = url;
    }
    const data = await updateUserProfile(user.value.id, body);
    console.log(data, body);
    if (data) {
      addToast("성공적으로 저장 됐어요.");
      updateUser({ ...user.value, ...body });
    }
  } catch (err) {
    console.error(err);
    addToast("정보 수정에 실패했어요.", "error");
  }
};
</script>

<template>
  <!-- Main Content -->
  <section
    class="w-[calc(100%-40px)] max-w-[1440px] py-[60px] mt-[120px] mb-20 flex contents-box"
  >
    <div class="flex w-[100%] gap-[122px] px-5">
      <!-- Sidebar -->
      <div
        class="w-[40%] max-w-[540px] border-r-2 border-white/50 flex items-center justify-center"
        style="padding-top: 66px; padding-bottom: 66px"
      >
        <div class="relative">
          <!-- 프로필 이미지 -->
          <div
            class="w-[216px] h-[216px] bg-gray-800 rounded-full flex items-center justify-center overflow-hidden"
          >
            <img
              :src="profilePictureSrc || user.profile_image"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>

          <!-- 에딧 버튼 -->
          <div
            class="absolute cursor-pointer bottom-2 right-4 bg-point-500 rounded-full w-[45px] h-[45px] flex items-center justify-center text-white text-xs overflow-hidden transform transition-transform duration-100 ease-in-out hover:scale-125"
            @click="updateProfilePictureHandler"
          >
            <img
              class="w-[22px]"
              src="/assets/images/icons/pictureEdit-icon.svg"
              alt="수정"
            />
          </div>

          <!-- 숨겨진 파일 입력 -->
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>

      <!-- Main Content Area -->
      <form class="flex-1 pt-5" @submit.prevent="handleUpdateUser">
        <h2 class="text-white font-dnf text-5xl">PROFILE</h2>
        <label for="name" class="text-white text-xl block font-bold mt-12">
          닉네임
        </label>
        <input
          id="name"
          type="text"
          class="w-full max-w-[624px] h-[56px] rounded-[12px] px-7 mt-2.5 text-lg font-medium"
          placeholder="닉네임을 입력해주세요."
          name="name"
          v-model="name"
        />

        <label for="email" class="text-white text-xl block font-bold mt-[29px]">
          이메일
        </label>
        <input
          id="email"
          type="text"
          class="w-full max-w-[624px] h-[56px] rounded-[12px] px-7 mt-2.5 text-lg font-medium text-[#2E2E2E] text-black/30"
          name="email"
          disabled
          v-model="email"
        />
        <label for="bio" class="text-white text-xl block font-bold mt-[29px]">
          자기소개
        </label>
        <div class="flex flex-col">
          <textarea
            id="bio"
            class="w-full max-w-[624px] h-32 rounded-[12px] py-5 px-6 resize-none mt-2.5 text-lg font-medium"
            placeholder="아직 자기소개를 작성하지 않으셨습니다. 자기소개를 작성해주세요."
            name="bio"
            maxlength="150"
            v-model="bio"
            @input="updateCharCount"
          ></textarea>
          <h2
            class="float-left text-sm text-white py-2 pl-2"
            :class="{
              'text-point-500 font-medium': charCount >= 150,
              'text-white/50': charCount < 150,
            }"
          >
            현재 글자 수: {{ charCount }} / 150
          </h2>
        </div>
        <div class="mt-8 flex float-right pr-[150px]">
          <button
            type="button"
            class="w-[66px] h-[32px] bg-main-500 rounded-lg text-white mr-2"
            @click="navigateToUserPage"
          >
            취소
          </button>
          <button
            type="submit"
            class="min-w-[66px] h-[32px] bg-point-500 rounded-lg text-white"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
