<script setup>
import { twMerge } from "tailwind-merge";
import PaginArrow from "@/components/common/icons/PaginArrow.vue";
const props = defineProps({
  total: { type: Number, required: true },
  pageSize: { type: Number, default: 12 },
  limit: { type: Number, default: 10 },
});

const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

const visiblePages = computed(() => {
  const half = Math.floor(props.limit / 2);
  let start = Math.max(currentPage.value - half, 1);
  let end = start + props.limit - 1;

  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(end - props.limit + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    emit("pageChange", page);
  }
};
</script>
<template>
  <div class="flex items-center text-sm font-dnf text-white gap-4">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="disabled:opacity-50 text-poin-500"
    >
      <PaginArrow />
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      @click="changePage(page)"
      :class="
        twMerge(
          'min-w-[28px] h-[28px]',
          currentPage === page ? 'rounded-full bg-point-500 text-white' : ''
        )
      "
    >
      {{ page }}
    </button>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="disabled:opacity-50 text-poin-500"
    >
      <PaginArrow class="-scale-x-100" />
    </button>
  </div>
</template>
<style scoped></style>
