<script setup>
import BaseHeader from "@/components/common/Header.vue";
import { watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const router = useRouter();

watch(user, () => {
  if (!user.value) router.push("/login");
});
</script>
<template>
  <div class="bg-size font-pretendard font-medium bg-main">
    <base-header></base-header>
    <main class="w-full flex flex-col items-center">
      <router-view />
    </main>
  </div>
</template>
<style scoped></style>
