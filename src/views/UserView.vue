<script setup>
import { useAuthStore } from "@/stores/auth.js";
import UserPage from "@/components/user-page/UserPage.vue";
const uInfo = useAuthStore();
</script>
<template>
  <UserPage targetId="7dfc8ce0-9678-4b15-aace-54b57e052b12" />
</template>

<style scoped></style>
