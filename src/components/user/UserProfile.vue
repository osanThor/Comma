<script setup>
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import { getUserById } from "@/services/user.service";
const uInfo = useAuthStore();
const router = useRouter();

const props = defineProps({
  targetId: {
    type: String,
    default: "",
  },
});

const handleGetUserById = async (targetId) => {
  try {
    console.log(props.targetId);
    const data = await getUserById(targetId);
    console.log(data);
    if (data) {
    }
  } catch (err) {
    console.error(err);
  }
};

onBeforeMount(async () => {
  await handleGetUserById(props.targetId);
});

const name = ref(uInfo.user.name);
const email = ref(uInfo.user.email);
const bio = ref(
  uInfo.user.bio === null
    ? "아직 자기소개를 작성하지 않으셨습니다. 자기소개를 작성해주세요"
    : uInfo.user.bio
);

function navigateToEdit() {
  router.push("/user/edit"); // Navigate to /user/edit
}
</script>
<template>
  <!-- Profile Section -->
  <div class="flex items-center">
    <div class="relative mr-[78px]">
      <div
        class="w-[156px] h-[156px] bg-gray-800 rounded-full flex items-center justify-center overflow-hidden"
      >
        <img
          :src="uInfo.user.profile_image"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </div>
      <!-- 에딧 -->
      <div
        class="absolute -bottom-1 -right-1 bg-point-500 rounded-full w-[39px] h-[39px] flex items-center justify-center overflow-hidden cursor-pointer transform transition-transform duration-100 ease-in-out hover:scale-125"
        @click="navigateToEdit"
      >
        <img
          class="w-[14px] hover:color-main-500"
          src="/assets/images/icons/editProfile-icon.svg"
          alt="수정"
        />
      </div>
    </div>
    <div class="">
      <div class="inline-flex">
        <h2 class="text-white font-bold font-dnf text-[30px] mr-[8px]">
          {{ name }}
        </h2>
        <span class="text-gray-400 self-end mb-1 text-sm">{{ email }}</span>
      </div>
      <h2 class="text-gray-300 text-[16px] h-8 mt-[5px] mb-3">
        {{ bio }}
      </h2>

      <div
        class="mt-2 bg-point-500/30 text-white w-[220px] h-p[38px] py-2.5 px-3.5 rounded-xl text-base font-semibold inline-block justify-center text-center"
      >
        총 플레이 시간 | 00:00:00
      </div>
    </div>
  </div>
  <button
    @click="
      {
        {
          targetId;
        }
      }
    "
  >
    버튼
  </button>
</template>
<style scoped></style>
