<script setup>
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import Avatar from "./Avatar.vue";
import SideMenu from "@/components/common/SideMenu.vue";
import Notification from "./Notification.vue";
import { useGameStore } from "@/stores/test-game";

const authStore = useAuthStore();
const gameStore = useGameStore();

const { user } = storeToRefs(authStore);

const isAtTop = ref(false);
const topAnchor = ref(null);

let observer = null;

const setupObserver = () => {
  observer = new IntersectionObserver(
    ([entry]) => {
      isAtTop.value = entry.isIntersecting;
    },
    {
      root: null,
      threshold: 0,
    }
  );

  if (topAnchor.value) {
    observer.observe(topAnchor.value);
  }
};

onBeforeMount(async () => {
  await gameStore.getGamesData();
});

onMounted(() => {
  setupObserver();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>
<template>
  <div ref="topAnchor"></div>
  <header
    :class="
      twMerge(
        'h-[84px] fixed top-0 left-0 right-0 flex items-center justify-center transition-all z-[99999]',
        !isAtTop && 'backdrop-blur-sm'
      )
    "
  >
    <div
      class="w-[calc(100%-40px)] max-w-[1660px] flex items-center justify-between"
    >
      <h1 class="max-w-[120px]">
        <RouterLink to="/">
          <img src="/assets/images/logo.png" alt="logo" />
        </RouterLink>
      </h1>
      <div class="flex items-center gap-4">
        <RouterLink :to="`/user/${user?.id}`">
          <Avatar v-show="user" :src="user?.profile_image" size="sm" />
        </RouterLink>
        <Notification />
        <SideMenu />
      </div>
    </div>
  </header>
</template>
<style scoped></style>
