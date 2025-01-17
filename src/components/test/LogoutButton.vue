<script setup>
import { useAuthStore } from "@/stores/auth";
import { logout } from "@/services/user.service";
import router from "@/router";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const handleLogout = async () => {
  try {
    const { updateUser } = authStore;
    updateUser(null);
    router.push("/login");
    await logout();
  } catch (err) {
    console.error(err);
  }
};
</script>
<template>
  <button @click="handleLogout" v-show="user">로그아웃</button>
</template>
<style scoped></style>
