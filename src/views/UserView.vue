<script setup>
import { useAuthStore } from "@/stores/auth.js";
import UserPage from "@/components/user-page/UserPage.vue";
const uInfo = useAuthStore();
</script>
<template>
  <UserPage />
</template>

<style scoped></style>
