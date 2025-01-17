<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { realtimeNewNotifications } from "@/services/notification.service";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const newAlarm = ref(false);

watch(user, () => {
  if (!user.value || !user.value.id) return console.log("로그인 해야함");
  realtimeNewNotifications(user.value.id, (noti) => {
    console.log("new notification", noti);
    newAlarm.value = true;
  });
});
</script>

<template>
  <button class="relative mr-4">
    <span v-show="newAlarm" class="absolute -top-1 -right-2 flex h-3 w-3">
      <span
        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"
      ></span>
      <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
    </span>
    알림
  </button>
</template>
<style scoped></style>
