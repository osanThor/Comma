<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useRouter } from "vue-router";
import { usePostStore } from "../../stores/post";
import { useAuthStore } from "../../stores/auth.js";
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
    const authStore = useAuthStore();
    const router = useRouter();
    const post = ref(null);
    const { user: currentUser } = storeToRefs(authStore);

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
    };

    const handleDelete = async () => {
      openModal(
        `"나 아직 갈 준비가 안 됐어요..."\n그래도 삭제하시겠어요?`,
        "삭제하기",
        deletePost
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
      currentUser,
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
  <main class="flex flex-col md:flex-row items-start md:gap-6 lg:gap-8">
    <!-- 게시글 이미지 -->
    <section class="flex flex-shrink-0">
      <div
        class="bg-white md:w-[400px] lg:w-[440px] md:h-[400px] lg:h-[440px] rounded-xl flex items-center justify-center p-1"
      >
        <div class="md:w-[380px] lg:w-[420px] md:h-[380px] lg:h-[420px]">
          <swiper v-bind="swiperOptions">
            <swiper-slide v-for="(image, index) in post?.images" :key="index">
              <img
                class="md:w-[380px] lg:w-[420px] md:h-[380px] lg:h-[420px] object-cover object-center rounded-lg lg:rounded-xl"
                :src="image"
              />
            </swiper-slide>
            <swiper-slide v-if="!post?.images?.length">
              <img
                src="/assets/images/postDefaultImg.png"
                class="w-full object-cover object-center rounded-lg lg:rounded-xl"
              />
            </swiper-slide>
          </swiper>
        </div>
      </div>
    </section>
    <!-- 컨텐츠 -->
    <article
      class="flex flex-col justify-between text-white flex-grow md:h-[410px] lg:h-[448px] w-full min-w-[500px] "
    >
      <section class="w-full">
        <!-- 상단 -->
        <header class="flex flex-row items-end justify-between w-full ">
          <!-- 제목 및 날짜 -->
          <div class="flex-grow">
            <p class="font-medium text-sm text-white/70 mb-2">
              {{ formatDate(post?.createdAt) }}
            </p>
            <h1 class="font-dnf text-4xl">{{ post?.title }}</h1>
          </div>

          <!-- 수정/삭제 버튼 -->
          <div v-if="post?.user?.id === currentUser?.id" class="flex flex-row gap-3 text-sm font-semibold text-white/50">
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
              :src="post?.user?.profile_image || '/assets/images/defaultProfile.png'"
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
