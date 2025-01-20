<script>
import GamePostItem from "../game-view/GamePostItem.vue";
import Filter from "@/components/common/Filter.vue";
import Pagination from "@/components/common/Pagination.vue";

export default {
  name: "GamePosts",
  components: {
    GamePostItem,
    Filter,
    Pagination,
  },
};
</script>

<template>
  <div
    class="mt-[82.4px] w-[1075px] h-[1470px] border-[3px] pl-[63px] pr-[62px] pt-[61px] border-white bg-[rgba(23,18,50,0.2)] backdrop-blur-[10px] rounded-[30px]"
  >
    <div class="flex items-center gap-[26px]">
      <span class="font-dnf text-white text-[42px]">게시글</span>
      <Filter />
    </div>
    <div
      class="mt-[35px] grid grid-cols-4 gap-x-[25px] gap-y-[33.17px] mb-[59px]"
    >
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
      <GamePostItem />
    </div>
    <div class="flex justify-center">
      <Pagination :total="220" />
    </div>
  </div>
</template>
