<script setup>
import { useAuthStore } from "@/stores/auth.js";
const userStore = useAuthStore();
const { user } = storeToRefs(userStore);
</script>
<template>
  <section
    class="w-full max-w-[1640px] min-h-screen mt-[120px] flex flex-col contents-box py-[90px] mb-10 px-20"
  >
    <div class="flex w-full h-full flex-grow gap-[7vw]">
      <div class="w-[210px] border-white border-r-2 flex flex-col relative">
        <div class="w-full flex flex-col gap-[33px] sticky top-[100px] left-0">
          <router-link
            :to="`/user/${user.id}/post`"
            class="block text-white hover:text-point-500 text-2xl font-bold transition-all"
          >
            게시글
          </router-link>

          <router-link
            :to="`/user/${user.id}/like`"
            class="block text-white hover:text-point-500 text-2xl font-bold transition-all"
          >
            좋아요
          </router-link>

          <router-link
            :to="`/user/${user.id}/rank`"
            class="block text-white hover:text-point-500 text-2xl font-bold transition-all"
          >
            개인별 랭크
          </router-link>

          <router-link
            :to="`/user/${user.id}/comment`"
            class="block text-white hover:text-point-500 text-2xl font-bold transition-all"
          >
            작성한 댓글
          </router-link>
        </div>
      </div>
      <div class="flex-1">
        <div>
          <router-view></router-view>
        </div>
      </div>
    </div>
    <img
      src="/assets/images/singleGhost.png"
      alt="ghost"
      class="absolute bottom-[-27px] -left-8 w-[129px] h-[118px] z-10 overflow-visible"
    />
  </section>
</template>

<style scoped>
.router-link-active {
  color: #ce0a9c;
}
</style>
