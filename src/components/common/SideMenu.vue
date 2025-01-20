<script setup>
import { logout } from "@/services/user.service";
import { twMerge } from "tailwind-merge";
import { useRouter } from "vue-router";
import LogoutIcon from "./icons/LogoutIcon.vue";
import { useGameStore } from "@/stores/test-game";

const gameStore = useGameStore();
const { rawGames: games } = storeToRefs(gameStore);

const router = useRouter();

const header = ref(null);
const isOpenMenu = ref(false);

function toggleListener(active) {
  active
    ? window.addEventListener("mousedown", mouseDownOutside)
    : window.removeEventListener("mousedown", mouseDownOutside);
}

function mouseDownHeader() {
  toggleListener((isOpenMenu.value = !isOpenMenu.value));
}

function mouseDownOutside(e) {
  const isOutside = header.value && !header.value.contains(e.target);

  if (isOutside) toggleListener((isOpenMenu.value = false));
}

function mouseDownItem(handler) {
  if (handler === "logout") handleLogout();
  else router.push(handler);
  toggleListener((isOpenMenu.value = false));
}
const handleLogout = async () => await logout();
</script>
<template>
  <div class="relative">
    <button
      ref="header"
      @mousedown.prevent="mouseDownHeader"
      class="flex items-center justify-center"
      aria-label="sidebar button"
      type="button"
    >
      <img
        :class="twMerge('transition-all w-7', isOpenMenu && 'rotate-90')"
        src="/assets/images/icons/sidebar-icon.svg"
        alt="사이드바"
      />
    </button>
    <div
      id="menu-dropdown"
      v-if="isOpenMenu"
      class="absolute bg-white w-[180px] top-full translate-y-6 right-0 min-w-[180px] rounded-2xl flex flex-col items-center gap-[40px] px-6 py-4 font-semibold shadow-md"
    >
      <nav class="w-full flex flex-col">
        <button
          v-for="value in games"
          :key="value.id"
          class="w-full border-main-200/20 border-b-2 last:border-0 pt-3 pb-[10px] flex justify-center text-main-500 hover:text-point-500"
          @mousedown.prevent="mouseDownItem(`/game/${value.name}`)"
        >
          {{ value.display_name }}
        </button>
      </nav>
      <button
        class="text-main-300 hover:text-main-500 flex items-center text-sm gap-[2px]"
        aria-label="logout button"
        type="button"
        @mousedown.prevent="mouseDownItem('logout')"
      >
        <LogoutIcon />
        로그아웃
      </button>
    </div>
  </div>
</template>
<style scoped></style>
