<script setup>
import { ref, reactive, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import { debounce } from "lodash";
import GamePostItem from "@/components/game-view/GamePostItem.vue";
import Filter from "@/components/common/Filter.vue";
import Pagination from "@/components/common/Pagination.vue";
import { getPostsByCategory } from "@/services/post.service";

const postData = reactive({
  posts: [],
  total: 0,
});
const page = ref(1);
const sort = ref("likes");
const sortOption = [
  { name: "인기순", value: "likes" },
  { name: "최신순", value: "desc" },
];

const searchQuery = ref(""); // 입력값 저장
const query = ref(""); // 실제 검색에 사용되는 값

const route = useRoute();

const handleGetPosts = async (page) => {
  try {
    // URL 파라미터에서 gameName을 가져옴
    const category = route.params.gameName;

    if (!category) {
      throw new Error("유효하지 않은 게임입니다");
    }

    // API 호출 시 카테고리명 전달
    const data = await getPostsByCategory(
      category,
      sort.value,
      page,
      16,
      query.value
    );
    if (data) {
      postData.posts = data.data;
      postData.total = data.totalCount;
    }
  } catch (err) {
    console.error(err);
  }
};

const handleChangePage = (currentPage) => {
  page.value = currentPage;
};

const handleChangeSort = async (currentSort) => {
  if (sort.value !== currentSort) {
    sort.value = currentSort;
    page.value = 1;
    await handleGetPosts(page.value);
  }
};

// 디바운스된 검색 함수
const debouncedSearch = debounce((value) => {
  query.value = value;
  handleGetPosts(page.value);
}, 300);

// Enter키나 검색 버튼 클릭시 즉시 검색
const handleSearch = async () => {
  query.value = searchQuery.value;
  page.value = 1;
  await handleGetPosts(page.value);
};

onBeforeMount(async () => {
  await handleGetPosts(1);
});

// watch 수정 - page와 gameName만 감시
watch([page, () => route.params.gameName], async () => {
  await handleGetPosts(page.value);
});

// searchQuery watch 제거
watch(searchQuery, () => {}, { immediate: true });

// 입력 이벤트 핸들러 추가
const handleInput = (e) => {
  const value = e.target.value;
  searchQuery.value = value;
  debouncedSearch(value);
};
</script>

<template>
  <div
    class="mt-[82.4px] w-[1075px] h-[1470px] border-[3px] pl-[63px] pr-[62px] pt-[61px] border-white bg-[rgba(23,18,50,0.2)] backdrop-blur-[10px] rounded-[30px]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-[26px]">
        <span class="font-dnf text-white text-[42px]">게시글</span>
        <Filter
          :sort="sort"
          :sortOption="sortOption"
          @change-sort="handleChangeSort"
        />
      </div>
      <div
        class="w-[295px] h-[40px] bg-main-500 rounded-3xl opacity-50 relative hover:opacity-100 focus-within:opacity-100"
      >
        <input
          v-model="searchQuery"
          type="text"
          class="w-full h-full bg-transparent outline-none text-white pl-5 pr-[50px]"
          @input="handleInput"
          @keyup.enter="handleSearch"
        />
        <img
          src="/assets/images/icons/search-icon.svg"
          alt="search"
          class="absolute right-[13.4px] top-1/2 -translate-y-1/2 w-[26.11px] h-[27px] cursor-pointer"
          @click="handleSearch"
        />
      </div>
    </div>
    <div
      class="mt-[35px] grid grid-cols-4 grid-rows-4 gap-x-[25px] gap-y-[33.17px] mb-[59px]"
    >
      <GamePostItem
        v-for="value in postData.posts"
        :key="value.id"
        :item="value"
      />
    </div>
    <div class="flex justify-center">
      <Pagination
        :page="page"
        :total="postData.total"
        @page-change="handleChangePage"
      />
    </div>
  </div>
</template>
