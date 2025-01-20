<script setup>
import Avatar from "./Avatar.vue";

const items = ref(Array(20).fill(0));
// const items = ref([]);

const header = ref(null);
const modal = ref(null);
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
  const isModal = modal.value && modal.value.contains(e.target);
  if (isOutside && !isModal) toggleListener((isOpenMenu.value = false));
}

function mouseDownItem(handler) {
  router.push(handler);
  toggleListener((isOpenMenu.value = false));
}
</script>
<template>
  <div class="relative flex items-center justify-center">
    <button
      ref="header"
      @mousedown.prevent="mouseDownHeader"
      aria-label="alarm button"
      type="button"
    >
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
      class="absolute bg-white w-[calc(100vw-40px)] max-w-[440px] top-full shadow-md translate-y-6 right-0 min-w-[180px] rounded-2xl flex flex-col items-center px-12 py-8"
    >
      <div class="w-full flex justify-between items-center mb-5">
        <div class="flex items-center gap-4 text-main-500 font-bold">
          <button class="">전체</button>
          <button class="text-sm opacity-50">읽지 않음</button>
        </div>
        <button class="w-20 h-9 rounded-[10px] bg-main-200 text-white text-sm">
          모두 읽음
        </button>
      </div>
      <div class="w-full max-h-[50vh] overflow-y-auto py-5">
        <!-- <div class="w-full max-h-[650px] overflow-y-auto"> -->
        <ul class="w-full flex flex-col gap-9">
          <li v-if="!items.length">알림이 없습니다.</li>
          <li
            class="w-full flex items-center gap-[10px]"
            v-for="(_, idx) in items"
            :key="idx"
          >
            <Avatar />
            <div class="font-medium text-sm text-main-500/70">
              <span class="font-bold">허정민</span> 님이 [벽돌 깨기] 신기록에
              달성하셨습니다. <span class="text-xs">2025년 1월 13일</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
