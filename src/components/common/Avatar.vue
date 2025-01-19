<script setup>
import { twMerge } from "tailwind-merge";

const imgLoaded = ref(false);

const props = defineProps({
  src: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
  },
  size: {
    type: String,
    default: "base",
  },
});

const formatedSize = computed(() => {
  if (props.size === "xs") return "w-[18px] h-[18px] min-w-[18px] min-h-[18px]";
  if (props.size === "sm") return "w-[27px] h-[27px] min-w-[27px] min-h-[27px]";
  if (props.size === "base")
    return "w-[50px] h-[50px] min-w-[50px] min-h-[50px]";
});

const handleLoad = () => {
  setTimeout(() => {
    imgLoaded.value = true;
  }, 500);
};
</script>
<template>
  <div
    :class="
      twMerge(
        'flex items-center rounded-full justify-center overflow-hidden relative bg-white',
        formatedSize
      )
    "
  >
    <div
      v-if="!imgLoaded"
      class="w-full absolute top-0 left-0 bottom-0 right-0 bg-main-100 animate-pulse"
    ></div>
    <img class="object-cover" :src="src" alt="avatar" @load="handleLoad" />
  </div>
</template>
<style scoped></style>
