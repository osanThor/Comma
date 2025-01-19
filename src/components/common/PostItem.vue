<script setup>
import Avatar from "@/components/common/Avatar.vue";
import SmallLike from "@/components/common/icons/SmallLike.vue";
</script>
<template>
  <RouterLink
    to="/post/dididididid"
    class="text-white rounded-lg overflow-hidden"
  >
    <div
      class="w-full h-[130px] flex items-center justify-center overflow-hidden"
    >
      <img
        class="object-cover min-w-full min-h-full"
        src="/assets/images/examplepost.png"
        alt="post thumbnail"
      />
    </div>
    <div class="p-4 bg-main-500">
      <div class="flex gap-2 items-end mb-3 justify-between">
        <div class="text-sm font-dnf line-clamp-1">
          님들 이거 해보심?해보심?해보심?해보심?해보심?
        </div>
        <div class="text-[10px] text-white/70">2025.01.18</div>
      </div>
      <div class="line-clamp-2 text-xs opacity-70 mb-3">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </div>
      <div class="w-full flex justify-between items-center">
        <div class="text-xs flex items-center gap-1">
          <Avatar size="xs" /> 싹싹김치
        </div>
        <div
          class="text-[10px] leading-3 flex items-center gap-1 text-point-500"
        >
          <SmallLike />
          999+
        </div>
      </div>
    </div>
  </RouterLink>
</template>
<style scoped></style>
