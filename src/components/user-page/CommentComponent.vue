<script setup>
import SmallLike from "@/components/common/icons/SmallLike.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const totalLikes = computed(() => {
  const likeCount = props.item?.like_count || 0;
  if (likeCount >= 1000) {
    return (likeCount / 1000).toFixed(1) + "k";
  }
  return likeCount.toString();
});

const dateFormed = computed(() => {
  const date = new Date(props.item.created_at);
  return date.toISOString().split("T")[0];
});
</script>

<template>
  <!-- Main content area -->
  <div class="clear-right mt-3">
    <div
      class="h-[70px] w-[1000px] ml-[30px] rounded-2xl bg-main-600 flex items-center px-[33px] mt-3"
    >
      <div class="flex-1 text-white text-base font-dnf max-w-32 truncate mr-10">
        {{ item.content }}
      </div>
      <div
        class="flex-[1.8] text-white/70 text-base font-medium max-w-[612px] truncate pr-8"
      >
        {{ item.content }}
      </div>
      <div
        class="flex-[0.6] text-gray-500 text-xs font-medium flex justify-center"
      >
        {{ dateFormed }}
      </div>
      <div class="flex items-center text-point-500 text-base min-w-12">
        <small-like width="15" height="15"></small-like>
        <span class="ml-1">{{ totalLikes }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
