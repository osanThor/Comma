<script setup>
import { loginWithSocial } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import KakaoIcon from "@/components/common/icons/KakaoIcon.vue";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const router = useRouter();

const googleLogin = async () => await loginWithSocial("google");

const kakaoLogin = async () => await loginWithSocial("kakao");

watch(user, () => {
  if (user.value) router.push("/");
});
</script>
<template>
  <main class="bg-size relative bg-login bg-center font-pretendard">
    <section
      class="absolute w-[calc(100%-32px)] max-w-[840px] h-[557px] p-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 contents-box"
    >
      <h1 class="mb-[60px]">
        <img
          class="object-cover max-w-[408px]"
          src="/assets/images/main-title.png"
          alt="logo"
        />
      </h1>
      <div class="w-full max-w-[299px] flex flex-col gap-5">
        <button
          class="bg-kakao transition-all hover:bg-[#261C07] text-black hover:text-kakao rounded-full flex items-center justify-center h-[53px] font-semibold"
          type="button"
          aria-label="kakao login"
          @click="kakaoLogin"
        >
          <KakaoIcon class="mr-3" />
          카카오로 시작하기
        </button>
        <button
          class="bg-white rounded-full flex items-center justify-center h-[53px] font-semibold hover:bg-[#1A3672] hover:text-white transition-all"
          type="button"
          aria-label="google login"
          @click="googleLogin"
        >
          <span class="flex items-center justify-center w-6 h-6 mr-2">
            <img
              class="object-cover w-5"
              src="/assets/images/icons/google-icon.svg"
              alt="google icon"
            />
          </span>
          Google로 시작하기
        </button>
      </div>
    </section>
    <img
      class="absolute top-12 left-12"
      src="/assets/images/login/play@2x.png"
      alt="play"
    />
    <img
      class="absolute bottom-12 left-12"
      src="/assets/images/login/timeline@2x.png"
      alt="timeline"
    />
    <img
      class="absolute top-12 right-12"
      src="/assets/images/login/vhs@2x.png"
      alt="vhs"
    />
  </main>
</template>
<style scoped></style>
