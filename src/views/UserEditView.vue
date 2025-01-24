<script setup>
import router from "@/router";
import { useAuthStore } from "@/stores/auth.js";
import { ref } from "vue";
//import { updateProfilePicture } from "@/services/user.service"; // 서버로 업로드하기 위한 API 함수 (가정)

const uInfo = useAuthStore();
const charCount = ref(uInfo.user.bio?.length || 0);
const name = ref(uInfo.user.name);
const email = ref(uInfo.user.email);
const profilePicture = ref(""); // 프로필 사진 경로를 저장하는 ref
const bio = ref(
  uInfo.user.bio === null
    ? "아직 자기소개를 작성하지 않으셨습니다. 자기소개를 작성해주세요"
    : uInfo.user.bio
);

function navigateToUserPage() {
  router.push(`/user/${uInfo.user.id}`); // Navigate to user page
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
    // 로컬 URL을 생성하여 이미지를 미리보기
    profilePicture.value = URL.createObjectURL(file);
  }
};

const updateUserProfileHandler = async () => {
  try {
    console.log(123);
    const data = await updateUserProfiles(targetId, "dec", true, 1, 10);
    console.log(data);
    if (data) {
      console.log(1);
    }
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <!-- Main Content -->
  <section
    class="w-[calc(100%-40px)] max-w-[1440px] mt-[120px] py-[90px] flex contents-box"
  >
    <div class="flex w-[100%]">
      <!-- Sidebar -->
      <div
        class="w-[540px] border-r-2 border-white/50 flex items-center justify-center"
        style="padding-top: 66px; padding-bottom: 66px"
      >
        <div class="relative">
          <!-- 프로필 이미지 -->
          <div
            class="w-[216px] h-[216px] bg-gray-800 rounded-full flex items-center justify-center overflow-hidden"
          >
            <img
              :src="profilePicture || uInfo.user.profile_image"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>

          <!-- 에딧 버튼 -->
          <div
            class="absolute bottom-2 right-4 bg-point-500 rounded-full w-[45px] h-[45px] flex items-center justify-center text-white text-xs overflow-hidden transform transition-transform duration-100 ease-in-out hover:scale-125"
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
      <div class="flex-1 pl-[122px] pt-5">
        <h2 class="text-white font-dnf text-5xl">PROFILE</h2>
        <h2 class="text-white text-xl font-bold mt-12">닉네임</h2>
        <input
          type="text"
          class="w-[624px] h-[56px] rounded-[12px] px-7 mt-2.5 text-lg font-medium"
          name="name"
          v-model="name"
        />

        <h2 class="text-white text-xl font-bold mt-[29px]">이메일</h2>
        <input
          type="text"
          class="w-[624px] h-[56px] rounded-[12px] px-7 mt-2.5 text-lg font-medium text-[#2E2E2E]"
          name="email"
          disabled
          v-model="email"
        />
        <h2 class="text-white text-xl font-bold mt-[29px]">자기소개</h2>
        <div class="flex flex-col">
          <textarea
            class="w-[624px] h-32 rounded-[12px] py-5 px-6 resize-none mt-2.5 text-lg font-medium"
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
            class="w-[66px] h-[32px] bg-main-500 rounded-lg text-white mr-2"
            @click="navigateToUserPage"
          >
            취소
          </button>
          <button
            class="w-[66px] h-[32px] bg-point-500 rounded-lg text-white"
            @click="updateUserProfileHandler()"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
