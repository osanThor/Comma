<script>
import Avatar from "@/components/common/Avatar.vue";
import SmallLike from "@/components/common/icons/SmallLike.vue";

export default {
  name: "GamePostItem",
  components: {
    Avatar,
    SmallLike,
  },
};
</script>
<template>
  <RouterLink to="/post/1" class="text-white rounded-lg overflow-hidden">
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
      <div class="text-sm font-dnf mb-3">신기록 달성!</div>
      <div class="line-clamp-2 text-xs opacity-70 mb-3">
        여러분은 최근에 어떤 기록을 달성하셨나요? 같이 공유하고 공략에 대해
        이야기해보면 좋겠습니다. 😃 읽어주셔서 감사합니다! 다음 목표는 [새로운
        목표, 랭크 등]를 달성하는 겁니다. 응원 부탁드려요!
      </div>
      <div class="w-full flex justify-between">
        <div class="text-xs flex items-center gap-1">
          <Avatar size="xs" /> 싹싹김치
        </div>
        <div class="text-[10px] flex items-center gap-1 text-point-500">
          <SmallLike />
          999+
        </div>
      </div>
    </div>
  </RouterLink>
</template>
