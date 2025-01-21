<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import GameIntro from "../game-view/GameIntro.vue";
import GameDescription from "../game-view/GameDescription.vue";

const route = useRoute();

const gameDetails = {
  mineSweeper: {
    intro:
      "지뢰찾기는 논리적 추론을 통해 지뢰의 위치를 파악하는 퍼즐 게임입니다.",
    description: [
      "숫자는 주변 8칸의 지뢰 개수를 나타냅니다.",
      "깃발로 지뢰 위치를 표시할 수 있습니다.",
      "모든 지뢰를 찾으면 게임이 종료됩니다.",
    ],
  },
  tetris: {
    intro:
      "테트리스는 다양한 모양의 블록을 쌓아 줄을 완성하는 퍼즐 게임입니다.",
    description: [
      "방향키로 블록을 이동하고 회전할 수 있습니다.",
      "한 줄이 완성되면 해당 줄이 사라집니다.",
      "블록이 천장에 닿으면 게임이 종료됩니다.",
    ],
  },
  bounceBall: {
    intro: "바운스볼은 패들로 공을 튕겨\n점수를 획득하는 게임입니다.",
    description: [
      "마우스로 패들을 이동합니다.",
      "떨어지는 공을 패들로 받아\n공을 튕깁니다.",
      "패들로 공을 맞추면 점수를 획득하고\n공이 땅에 닿으면 게임이 종료됩니다.",
    ],
  },
  flappyBird: {
    intro:
      "플래피 버드는 단순하지만 중독성 있는 게임으로, 스페이스바를 통해 새를 조작하여 장애물을 피하는 방식으로 진행됩니다.",
    description: [
      "space를 눌러 새를 위로 띄우세요.",
      "장애물을 피해 최대한 멀리 날아가 점수를 획득하세요.",
      "장애물에 부딪히거나 땅에 떨어지면 게임이 종료됩니다.",
    ],
  },
  shooting: {
    intro: "슈팅게임은 적을 피하고 공격하며 점수를 획득하는 게임입니다.",
    description: [
      "방향키로 이동하고 스페이스바로 공격합니다.",
      "적을 맞추면 점수를 획득합니다.",
      "적과 부딪히면 게임이 종료됩니다.",
    ],
  },
};

const currentGame = computed(() => {
  const gameName = route.params.gameName;
  return gameDetails[gameName];
});
</script>

<template>
  <div
    class="mt-[160px] h-[565px] w-[325px] bg-main-700 rounded-2xl items-center justify-center flex flex-col px-[19px] relative"
  >
    <h2 class="font-dnf text-white text-2xl mt-[41px] mb-[8px]">게임 소개</h2>
    <GameIntro :intro="currentGame.intro" />
    <h2 class="font-dnf text-white text-2xl mb-[8px]">게임 설명</h2>
    <GameDescription :description="currentGame.description" />
    <img
      src="/assets/images/ghost.png"
      alt="ghost"
      class="absolute bottom-[33px] right-[7px] w-[92px] h-[63px] z-10"
    />
  </div>
</template>
