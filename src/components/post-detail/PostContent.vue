<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useRouter } from "vue-router";
import { usePostStore } from "../../stores/post";
import { onMounted, ref } from "vue";

import { useModalStore } from "@/stores/modal";
const { openModal } = useModalStore();

export default {
  name: "PostContent",
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    postId: {
      type: String,
      required: true,
    },
    navigateToProfile: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const postStore = usePostStore();
    const router = useRouter();
    const post = ref(null);

    const fetchPost = async () => {
      await postStore.fetchPostById(props.postId);
      post.value = {
        title: postStore.title,
        content: postStore.content,
        user: postStore.user,
        images: postStore.images,
        createdAt: postStore.createdAt,
        updatedAt: postStore.updatedAt,
        category: postStore.category,
        likeCount: postStore.likeCount,
        commentCount: postStore.commentCount,
        hasLiked: postStore.hasLiked,
      };
    };

    onMounted(fetchPost);

    const editPost = () => {
      router.push(`/post/edit/${props.postId}`);
    };

    const deletePost = async () => {
      try {
        await postStore.deletePost(props.postId);
        router.push("/");
      } catch (error) {
        console.error("게시글 삭제 실패", error);
      }
    }

    const handleDelete = async () => {
      openModal(
        `"나 아직 갈 준비가 안 됐어요..."\n그래도 삭제하시겠어요?`,
        "삭제하기",
        deletePost,
      );
    };

    const handleToggleLike = async () => {
      try {
        await postStore.toggleLike(props.postId);
        post.value.likeCount = postStore.likeCount;
        post.value.hasLiked = postStore.hasLiked;
      } catch (error) {
        console.error("게시글 좋아요 처리 실패:", error);
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "Invalid date";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const formattedDate = new Intl.DateTimeFormat("ko-KR", options).format(
        date
      );
      const [year, month, day] = formattedDate
        .split(".")
        .map((part) => part.trim());
      return `${year}년 ${month}월 ${day}일`;
    };

    const swiperOptions = {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      navigation: true,
      pagination: { clickable: true },
    };

    return {
      post,
      editPost,
      handleDelete,
      formatDate,
      swiperOptions,
      handleToggleLike,
    };
  },
};
</script>

<template>
  <main class="flex flex-row items-center gap-12">
    <!-- 게시글 이미지 -->
    <section>
      <div
        class="bg-white w-[440px] h-[440px] rounded-xl flex items-center justify-center p-1"
      >
        <div class="w-[420px] h-[420px]">
          <Swiper v-bind="swiperOptions">
            <SwiperSlide v-for="(image, index) in post?.images" :key="index">
              <img
                class="w-[420px] h-[420px] object-cover object-center rounded-xl"
                :src="image"
              />
            </SwiperSlide>
            <SwiperSlide v-if="!post?.images?.length">
              <img
                src="/assets/images/postDefaultImg.png"
                class="w-[420px] h-[420px] object-cover object-center rounded-xl"
              />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
    <!-- 컨텐츠 -->
    <article
      class="flex flex-col items-start justify-between text-white w-[601px] h-[440px]"
    >
      <section class="w-full">
        <!-- 상단 -->
        <header class="flex flex-row items-end justify-between w-full">
          <!-- 제목 및 날짜 -->
          <div>
            <p class="font-medium text-white/70 mb-1">
              {{ formatDate(post?.createdAt) }}
            </p>
            <h1 class="font-dnf text-4xl">{{ post?.title }}</h1>
          </div>

          <!-- 수정/삭제 버튼 -->
          <div class="flex flex-row gap-6 text-lg font-semibold text-white/50">
            <button @click="editPost" class="hover:text-white/100">수정</button>
            <button @click="handleDelete" class="hover:text-white/100">
              삭제
            </button>
          </div>
        </header>
        <hr class="border-2 opacity-30 w-full my-5 rounded-sm" />

        <!-- 게시글 내용 -->
        <section>
          <!-- 점수 및 플레이 타임 -->
          <div
            class="flex flex-row items-center gap-4 font-semibold text-lg mb-4 text-point-500"
          >
            <p>TIME | 01:00:00</p>
            <p>SCORE | 999점</p>
          </div>
          <!-- 본문 -->
          <p class="font-medium opacity-85">{{ post?.content }}</p>
        </section>
      </section>

      <!-- 하단 -->
      <section class="w-full flex flex-row items-center justify-between">
        <!-- 작성자 -->
        <div
          @click="navigateToProfile(post?.user?.id)"
          class="flex flex-row items-center gap-2 cursor-pointer bg-main-500/30 pl-4 pr-5 py-2 rounded-full"
        >
          <div class="w-6 h-6 rounded-full">
            <img
              class="w-full h-full object-cover object-center rounded-full"
              :src="post?.user?.profile_image || '/assets/images/exProfile.png'"
            />
          </div>
          <p class="text-lg font-medium opacity-9 pb-[2px]">
            {{ post?.user?.name || "알 수 없음" }}
          </p>
        </div>

        <!-- 게시글 좋아요 -->
        <div
          @click="handleToggleLike"
          class="flex flex-row items-center gap-2 cursor-pointer hover:bg-point-500/60 bg-point-500/30 px-4 py-3 rounded-full"
        >
          <img
            class="w-5 h-5 object-contain"
            :src="
              post?.hasLiked
                ? '/assets/images/icons/post-like-icon.png'
                : '/assets/images/icons/post-nolike-icon.png'
            "
          />
          <p v-if="post?.likeCount > 0" class="text-sm">
            {{ post?.likeCount }}
          </p>
        </div>
      </section>
    </article>
  </main>
</template>

<style scoped>
:deep(.swiper-pagination-bullet) {
  background-color: #ce0a9c;
}
:deep(.swiper-pagination-bullet-active) {
  background-color: #ce0a9c;
}
:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  color: #ce0a9c;
  display: block;
  opacity: 0.5;
  cursor: pointer;
}

:deep(.swiper-button-next:hover::after),
:deep(.swiper-button-prev:hover::after) {
  opacity: 0.7;
}
:deep(.swiper-button-next:active::after),
:deep(.swiper-button-prev:active::after) {
  opacity: 1;
}
:deep(.swiper-button-next.swiper-button-disabled::after),
:deep(.swiper-button-prev.swiper-button-disabled::after) {
  color: #77748c;
  opacity: 0.5;
}
</style>
