<script setup>
import UserProfile from "./UserProfile.vue";
import RankComponent from "./RankComponent.vue";
</script>
<template>
  <UserProfile />
  <!-- Main Content -->
  <!-- Game List 추후 컴포넌트화-->
  <div class="space-y-3 mt-[74px]">
    <RankComponent name="플래피 버드" rank="1" playTime="360000" />
    <RankComponent name="슈팅게임" rank="5" playTime="3600000" />
    s <RankComponent name="바운스 볼" rank="17" playTime="180000" />
    <RankComponent name="테트리스" rank="9" playTime="452684531" />
    <RankComponent name="지뢰찾기" rank="245" playTime="3321875" />
    <!-- <RankComponent /> -->
    <!-- <RankComponent /> -->
    <!-- <RankComponent /> -->
    <!-- <RankComponent /> -->
    <!-- <template v-for="game in games" :key="game.id">
              <div
                class="flex items-center justify-between bg-indigo-800/50 rounded-xl p-4 hover:bg-indigo-800/70 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <img
                    :src="game.icon"
                    :alt="game.name"
                    class="w-10 h-10 rounded-full"
                  />
                  <span class="text-white">{{ game.name }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-gray-300">{{ game.time }}</span>
                  <span class="text-gray-300">{{ game.score }}점</span>
                </div>
              </div>
            </template> -->
  </div>
</template>
<style scoped></style>
