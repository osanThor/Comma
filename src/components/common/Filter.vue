<script setup>
import { twMerge } from "tailwind-merge";
import FilterArrow from "@/components/common/icons/FilterArrow.vue";
import { ref } from "vue";

const props = defineProps({
  sort: {
    type: String,
    required: true,
  },
  sortOption: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["change-sort"]);

const open = ref(false);

const currentSort = computed(() => {
  const matchedOption = props.sortOption.find(
    (option) => option.value === props.sort
  );
  return matchedOption ? matchedOption.name : "인기순";
});

const otherSortOptions = computed(() =>
  props.sortOption.filter((option) => option.value !== props.sort)
);

const handleChangeSort = (value) => {
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
        <FilterArrow
          :class="
            twMerge(
              'absolute top-[5px] left-3 transition-all',
              open && 'rotate-180'
            )
          "
        />{{ currentSort }}
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
