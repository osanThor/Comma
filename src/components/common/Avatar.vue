<script setup>
import { twMerge } from "tailwind-merge";

const props = defineProps({
  src: {
    type: String,
    default:
      "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png",
  },
  size: {
    type: String,
    default: "sm",
  },
});

const formatedSize = computed(() => {
  if (props.size === "sm") return "w-[27px] h-[27px]";
});
</script>
<template>
  <div
    :class="
      twMerge(
        'flex items-center rounded-full justify-center overflow-hidden',
        formatedSize
      )
    "
  >
    <img class="object-cover" :src="src" alt="avatar" />
  </div>
</template>
<style scoped></style>
