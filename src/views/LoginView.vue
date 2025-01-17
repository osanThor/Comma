<script setup>
import { loginWithSocial } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";

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
          class="bg-kakao rounded-full flex items-center justify-center h-[53px] font-semibold"
          type="button"
          aria-label="kakao login"
          @click="kakaoLogin"
        >
          <span class="flex items-center justify-center w-6 h-6 mr-3">
            <img src="/assets/images/icons/kakao-icon.svg" alt="kakao icon" />
          </span>
          카카오로 시작하기
        </button>
        <button
          class="bg-white rounded-full flex items-center justify-center h-[53px] font-semibold"
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
  </main>
</template>
<style scoped></style>
