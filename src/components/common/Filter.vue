<script setup>
import { twMerge } from "tailwind-merge";
import FilterArrow from "@/components/common/icons/FilterArrow.vue";
import { ref } from "vue";

const open = ref(false);
</script>
<template>
  <div class="w-[106px] h-9 relative">
    <div
      class="w-[106px] border border-white rounded-md text-white absolute top-0 left-0"
    >
      <div
        @click="open = !open"
        class="flex items-center h-9 pl-10 pr-3 relative cursor-pointer font-semibold"
      >
        <FilterArrow
          :class="
            twMerge(
              'absolute top-[5px] left-3 transition-all',
              open && 'rotate-180'
            )
          "
        />인기순
      </div>
      <div
        :class="twMerge('transition-all overflow-hidden', open ? 'h-9' : 'h-0')"
      >
        <div
          class="flex items-center h-9 pl-10 pr-3 relative cursor-pointer font-semibold opacity-70 hover:opacity-100"
        >
          최신순
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
