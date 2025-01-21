<script setup>
import { twMerge } from "tailwind-merge";
import PaginArrow from "@/components/common/icons/PaginArrow.vue";
const props = defineProps({
  page: { type: Number, required: true, default: 1 },
  total: { type: Number, required: true },
  pageSize: { type: Number, default: 12 },
  limit: { type: Number, default: 10 },
});

const emit = defineEmits(["page-change"]);

const totalPages = computed(() => Math.ceil(props.total / props.pageSize));

const visiblePages = computed(() => {
  const half = Math.floor(props.limit / 2);
  let start = Math.max(props.page - half, 1);
  let end = start + props.limit - 1;

  if (end > totalPages.value) {
    end = totalPages.value;
    start = Math.max(end - props.limit + 1, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit("page-change", page);
  }
};
</script>
<template>
  <div v-if="total" class="flex items-center text-sm font-dnf text-white gap-4">
    <button
      @click="changePage(page - 1)"
      :disabled="page === 1"
      class="disabled:opacity-50 text-poin-500"
    >
      <PaginArrow />
    </button>

    <button
      v-for="currentPage in visiblePages"
      :key="currentPage"
      @click="changePage(currentPage)"
      :class="
        twMerge(
          'min-w-[28px] h-[28px]',
          page === currentPage ? 'rounded-full bg-point-500 text-white' : ''
        )
      "
    >
      {{ currentPage }}
    </button>

    <button
      @click="changePage(page + 1)"
      :disabled="page === totalPages"
      class="disabled:opacity-50 text-poin-500"
    >
      <PaginArrow class="-scale-x-100" />
    </button>
  </div>
</template>
<style scoped></style>
