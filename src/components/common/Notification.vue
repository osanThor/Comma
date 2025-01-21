<script setup>
import { useAuthStore } from "@/stores/auth";
import Avatar from "./Avatar.vue";
import {
  getNotifications,
  realtimeNewNotifications,
  readNotification,
  readAllNotifications,
} from "@/services/notification.service";
import { twMerge } from "tailwind-merge";

const router = useRouter();

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const newAlarm = ref(false);

const handleGetNotifications = async (userId) => {
  try {
    const data = await getNotifications(userId);
    console.log(data);
    if (data) items.value = data;
  } catch (err) {
    console.error(err);
  }
};

const items = ref([]);
const computedItems = computed(() =>
  isAll.value ? items.value : items.value.filter((item) => !item.is_read)
);

const header = ref(null);
const modal = ref(null);
const isOpenMenu = ref(false);

const isAll = ref(true);

const handleClickAllRead = async () => {
  if (!user.value || !user.value.id) return alert("다시 로그인 해주세요");
  if (!items.value.filter((item) => !item.is_read).length) return;
  try {
    await readAllNotifications(user.value.id);
    await handleGetNotifications(user.value.id);
  } catch (err) {
    console.error(err);
  }
};

const toggleListener = (active) => {
  active
    ? window.addEventListener("mousedown", mouseDownOutside)
    : window.removeEventListener("mousedown", mouseDownOutside);
};

const mouseDownHeader = () => {
  const active = (isOpenMenu.value = !isOpenMenu.value);
  toggleListener(active);
};

const mouseDownOutside = (e) => {
  const isOutside = header.value && !header.value.contains(e.target);
  const isModal = modal.value && modal.value.contains(e.target);
  if (isOutside && !isModal) toggleListener((isOpenMenu.value = false));
};

const mouseDownItem = async (handler, targetId) => {
  router.push(handler);
  toggleListener((isOpenMenu.value = false));
  await readNotification(targetId);
};

watch(user, () => {
  if (!user.value || !user.value.id) return;
  realtimeNewNotifications(user.value.id, (noti) => {
    console.log("new notification", noti);
    if (!noti.is_read) newAlarm.value = true;
  });
});

watch([isOpenMenu, user], async () => {
  newAlarm.value = false;
  if (user.value && isOpenMenu.value)
    await handleGetNotifications(user.value.id);
});
</script>
<template>
  <div class="relative flex items-center justify-center">
    <button
      ref="header"
      class="relative"
      @mousedown.prevent="mouseDownHeader"
      aria-label="alarm button"
      type="button"
    >
      <span
        v-if="newAlarm"
        @mousedown.prevent="mouseDownHeader"
        class="absolute top-0 right-0 flex h-3 w-3 items-center justify-center"
      >
        <span
          class="animate-ping absolute inline-flex h-[20px] w-[20px] translate-x-1 rounded-full bg-point-400 opacity-75"
        ></span>
        <span
          class="relative inline-flex rounded-full h-3 w-3 bg-point-500"
        ></span>
      </span>
      <img
        class="w-[24px]"
        src="/assets/images/icons/alarm-icon.svg"
        alt="알림"
      />
    </button>
    <div
      ref="modal"
      id="alarm-dropdown"
      v-if="isOpenMenu"
      class="absolute bg-white w-[calc(100vw-40px)] max-w-[440px] top-full translate-y-6 right-0 min-w-[180px] rounded-2xl flex flex-col items-center px-12 py-8 shadow-md"
    >
      <div class="w-full flex justify-between items-center mb-5">
        <div class="flex items-center gap-4 text-main-500 font-bold">
          <button
            @click="isAll = true"
            :class="twMerge(!isAll && 'opacity-30')"
          >
            전체
          </button>
          <button
            @click="isAll = false"
            :class="twMerge(isAll && 'opacity-30')"
          >
            읽지 않음
          </button>
        </div>
        <button
          @click="handleClickAllRead"
          class="w-20 h-9 rounded-[10px] bg-main-200 text-white text-sm"
        >
          모두 읽음
        </button>
      </div>
      <div class="w-full max-h-[50vh] overflow-y-auto py-5">
        <ul class="w-full flex flex-col gap-9">
          <li v-if="!computedItems.length" class="text-center text-main-200">
            알림이 없습니다.
          </li>
          <li
            v-for="item in computedItems"
            :class="
              twMerge(
                'w-full flex items-center gap-[10px] cursor-pointer',
                item.is_read && 'opacity-60'
              )
            "
            :key="item.id"
            @click="mouseDownItem(`/user/${item.sender.id}`, item.id)"
          >
            <Avatar :src="item.sender.profile_image" />
            <div class="font-medium text-sm text-main-500/70 break-keep">
              <span class="font-bold">{{ item.sender.name }}</span> 님이
              {{ item.message }}<span class="ml-1" />
              <span class="text-xs">2025년 1월 13일</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
