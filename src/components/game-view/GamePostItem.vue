<script setup>
import Avatar from "@/components/common/Avatar.vue";
import SmallLike from "@/components/common/icons/SmallLike.vue";
import dayjs from "dayjs";

const DEFAULT_THUMBNAIL = "/assets/images/postDefaultImg.png";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const imageLoaded = ref(false);

const formatedDate = (D) => {
  const date = dayjs(D);
  return date.format("YYYY.MM.DD");
};
</script>

<template>
  <RouterLink
    :to="`/post/${item.id}`"
    class="text-white rounded-lg overflow-hidden flex flex-col"
  >
    <div
      class="w-full h-[130px] relative flex items-center justify-center overflow-hidden"
    >
      <span
        v-if="!imageLoaded"
        class="absolute top-0 left-0 bottom-0 right-0 bg-main-200 animate-pulse"
      ></span>
      <img
        class="object-cover min-w-full min-h-full"
        :src="item.images[0] || DEFAULT_THUMBNAIL"
        alt="post thumbnail"
        @load="imageLoaded = true"
      />
    </div>
    <div class="p-4 bg-main-500 flex-grow flex flex-col">
      <div class="flex gap-2 items-end mb-3 justify-between">
        <div class="text-sm font-dnf line-clamp-1">
          {{ item.title }}
        </div>
        <div class="text-[10px] text-white/70">
          {{ formatedDate(item.created_at) }}
        </div>
      </div>
      <div class="line-clamp-2 text-xs opacity-70 mb-3 break-words flex-grow">
        {{ item.content }}
      </div>
      <div class="w-full flex justify-between items-center">
        <div class="text-xs flex items-center gap-1">
          <Avatar :src="item.user.profile_image" size="xs" />
          {{ item.user.name }}
        </div>
        <div
          class="text-[10px] leading-3 flex items-center gap-1 text-point-500"
        >
          <small-like></small-like>
          {{ item.like_count > 999 ? "999+" : item.like_count }}
        </div>
      </div>
    </div>
  </RouterLink>
</template>
