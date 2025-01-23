<script setup>
import { twMerge } from "tailwind-merge";
import FilterArrow from "@/components/common/icons/FilterArrow.vue";
import { ref, computed } from "vue";

const sort = ref("likes");
const sortOption = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
];

const emit = defineEmits(["change-sort"]);
const open = ref(false);

const currentSort = computed(() => {
  const matchedOption = sortOption.find(
    (option) => option.value === sort.value
  );
  return matchedOption ? matchedOption.name : "인기순";
});

const otherSortOptions = computed(() =>
  sortOption.filter((option) => option.value !== sort.value)
);

const handleChangeSort = (value) => {
  sort.value = value;
  emit("change-sort", value);
};
</script>
<template>
  <div class="w-[106px] h-9 relative z-10">
    <div
      @click="open = !open"
      class="w-[106px] border border-white rounded-md text-white absolute top-0 left-0 bg-white/20 backdrop-blur-lg"
    >
      <div
        class="flex items-center h-9 pl-10 pr-3 relative cursor-pointer font-semibold"
      >
        <filter-arrow
          :class="
            twMerge(
              'absolute top-[5px] left-3 transition-all',
              open && 'rotate-180'
            )
          "
        ></filter-arrow>
        {{ currentSort }}
      </div>
      <div
        v-for="option in otherSortOptions"
        @click="handleChangeSort(option.value)"
        :class="twMerge('transition-all overflow-hidden', open ? 'h-9' : 'h-0')"
      >
        <div
          class="flex items-center h-9 pl-10 pr-3 relative cursor-pointer font-semibold opacity-70 hover:opacity-100"
        >
          {{ option.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
