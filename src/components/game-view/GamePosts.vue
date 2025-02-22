<script setup>
import { ref, reactive, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import { debounce } from "lodash";
import GamePostItem from "@/components/game-view/GamePostItem.vue";
import BaseFilter from "@/components/common/Filter.vue";
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

const debouncedSearch = debounce((value) => {
  query.value = value;
  page.value = 1; // 페이지 리셋
  handleGetPosts(1); // 첫 페이지부터 검색
}, 300);

// Enter키나 검색 버튼 클릭시 즉시 검색 수정
const handleSearch = async () => {
  query.value = searchQuery.value;
  page.value = 1; // 페이지 리셋
  await handleGetPosts(1); // 첫 페이지부터 검색
};

// 검색어 변경 감시
watch(query, async (newQuery) => {
  if (newQuery !== undefined) {
    page.value = 1;
    await handleGetPosts(1);
  }
});

onBeforeMount(async () => {
  await handleGetPosts(1);
});

// route.params.gameName 변경을 독립적으로 감시
watch(
  () => route.params.gameName,
  async (newGame) => {
    // 검색 관련 상태 초기화
    searchQuery.value = "";
    query.value = "";
    page.value = 1;
    // 검색어 초기화된 상태로 게시글 새로 불러오기
    await handleGetPosts(1);
  }
);

// page만 따로 감시
watch(page, async () => {
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
    class="mt-[82.4px] w-full max-w-[1075px] pb-20 border-[3px] pl-[63px] pr-[62px] pt-[61px] border-white bg-[rgba(23,18,50,0.2)] backdrop-blur-[10px] rounded-[30px]"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-[26px]">
        <span class="font-dnf text-white text-[42px]">게시글</span>
        <base-filter
          :sort="sort"
          :sortOption="sortOption"
          @change-sort="handleChangeSort"
        ></base-filter>
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

    <!-- 게시글 목록 또는 빈 상태 메시지 -->
    <div
      v-if="postData.posts.length > 0"
      class="mt-[35px] grid grid-cols-4 gap-x-[25px] gap-y-[33.17px] mb-[59px]"
    >
      <game-post-item
        v-for="value in postData.posts"
        :key="value.id"
        :item="value"
      >
      </game-post-item>
    </div>
    <div v-else class="h-[1000px] flex items-center justify-center">
      <p class="text-2xl text-white opacity-50">게시글이 존재하지 않습니다.</p>
    </div>

    <div class="flex justify-center">
      <pagination
        :page="page"
        :total="postData.total"
        :page-size="16"
        @page-change="handleChangePage"
      ></pagination>
    </div>
  </div>
</template>
