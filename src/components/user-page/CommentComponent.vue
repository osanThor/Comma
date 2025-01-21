<script setup>
import SmallLike from "@/components/common/icons/SmallLike.vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  comment: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: "2025-01-01",
  },
  like: {
    type: Number,
    default: 0,
  },
});

const totalLikes = computed(() => {
  if (props.like >= 1000) {
    return (props.like / 1000).toFixed(1) + "k";
  }
  return props.like.toString();
});
</script>

<template>
  <!-- Main content area -->
  <div class="clear-right mt-3">
    <div
      class="h-[70px] w-[1000px] ml-[30px] rounded-2xl bg-main-600 flex items-center px-[33px] mt-3"
    >
      <div class="flex-1 text-white text-base font-dnf max-w-32 truncate mr-10">
        {{ title }}
      </div>
      <div
        class="flex-[1.8] text-white/70 text-base font-medium max-w-[612px] truncate pr-8"
      >
        {{ comment }}
      </div>
      <div
        class="flex-[0.6] text-gray-500 text-xs font-medium flex justify-center"
      >
        {{ date }}
      </div>
      <div class="flex items-center text-point-500 text-base min-w-12">
        <SmallLike width="15" height="15" />
        <span class="ml-1">{{ totalLikes }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
