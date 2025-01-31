<script setup>
import { useRoute } from "vue-router";
import GameBanner from "../components/game-view/GameBanner.vue";
import GameList from "../components/game-view/GameList.vue";
import GamePosts from "../components/game-view/GamePosts.vue";
import GameDetail from "../components/game-view/GameDetail.vue";
import GameRank from "../components/game-view/GameRank.vue";
import BaseFooter from "@/components/common/Footer.vue";

const route = useRoute();
const gameName = route.params.gameName;
</script>

<template>
  <div class="w-[calc(100%-40px)] max-w-[1440px]">
    <div class="grid grid-cols-4 gap-10">
      <div class="col-span-3">
        <game-banner :game-name="gameName"></game-banner>
        <game-list :game-name="gameName"></game-list>
        <game-posts :game-name="gameName"></game-posts>
      </div>
      <div class="flex flex-col">
        <game-detail :game-name="gameName"></game-detail>
        <game-rank :game-name="gameName"></game-rank>
      </div>
    </div>
  </div>
  <base-footer></base-footer>
</template>
