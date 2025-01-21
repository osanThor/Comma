<script setup>
import { useRoute } from "vue-router";
import GameBanner from "../components/game-view/GameBanner.vue";
import GameList from "../components/game-view/GameList.vue";
import GamePosts from "../components/game-view/GamePosts.vue";
import GameDetail from "../components/game-view/GameDetail.vue";
import GameRank from "../components/game-view/GameRank.vue";

const route = useRoute();
const gameName = route.params.gameName;
</script>

<template>
  <div class="max-w-[1920px] h-[2458px] mx-auto px-[240px]">
    <div class="grid grid-cols-4 gap-10">
      <div class="col-span-3">
        <GameBanner :game-name="gameName" />
        <GameList :game-name="gameName" />
        <GamePosts :game-name="gameName" />
      </div>
      <div class="flex flex-col">
        <GameDetail :game-name="gameName" />
        <GameRank :game-name="gameName" />
      </div>
    </div>
  </div>
</template>
