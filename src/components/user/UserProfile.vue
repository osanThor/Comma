<script setup>
import Avatar from "@/components/common/Avatar.vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import { getUserById } from "@/services/user.service";
const router = useRouter();
const authStore = useAuthStore();
const { user: userInfo } = storeToRefs(authStore);

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

function navigateToEdit() {
  router.push("/user/edit"); // Navigate to /user/edit
}

const formatedBio = computed(
  () =>
    props.user.bio ||
    "아직 자기소개를 작성하지 않으셨습니다. 자기소개를 작성해주세요"
);
</script>
<template>
  <!-- Profile Section -->
  <div class="flex items-center">
    <div class="relative mr-[78px]">
      <avatar :src="user.profile_image" size="xl"></avatar>
      <div
        v-if="userInfo.id === user.id"
        class="absolute bottom-[7px] right-[6px] bg-point-500 rounded-full w-[39px] h-[39px] flex items-center justify-center overflow-hidden cursor-pointer transform transition-transform duration-100 ease-in-out hover:scale-125"
        @click="navigateToEdit"
      >
        <img
          class="w-[16px] hover:color-main-500"
          src="/assets/images/icons/editProfile-icon.svg"
          alt="수정"
        />
      </div>
    </div>
    <div class="flex flex-col items-start">
      <div class="inline-flex">
        <h2 class="text-white font-bold font-dnf text-[30px] mr-[8px]">
          {{ user.name }}
        </h2>
        <span class="text-gray-400 self-end mb-1 text-sm">{{
          user.email
        }}</span>
      </div>
      <h2 class="text-gray-300 text-[16px] h-8 mt-[5px] mb-3">
        {{ formatedBio }}
      </h2>
      <div
        class="mt-2 bg-main-600 text-point-500 h-[38px] px-3.5 rounded-xl text-base font-semibold flex items-center justify-center text-center"
      >
        총 플레이 시간 | 00:00:00
      </div>
    </div>
  </div>
</template>
<style scoped></style>
