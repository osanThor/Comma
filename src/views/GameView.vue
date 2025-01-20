<script setup>
import GameBanner from "../components/game-view/GameBanner.vue";
import GameList from "../components/game-view/GameList.vue";
import GamePosts from "../components/game-view/GamePosts.vue";
import GameDetail from "../components/game-view/GameDetail.vue";
import GameRank from "../components/game-view/GameRank.vue";
</script>

<template>
  <div class="max-w-[1920px] h-[2458px] mx-auto px-[240px]">
    <div class="grid grid-cols-4 gap-10">
      <div class="col-span-3">
        <GameBanner />
        <GameList />
        <GamePosts />
      </div>
      <div class="flex flex-col">
        <GameDetail />
        <GameRank />
      </div>
    </div>
  </div>
</template>
