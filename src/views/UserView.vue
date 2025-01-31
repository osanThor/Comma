<script setup>
import { getUserById } from "@/services/user.service";
import { useToastStore } from "@/stores/toast";

const { addToast } = useToastStore();

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const userId = ref(null);
const user = ref(null);

const handleGetUser = async (id) => {
  try {
    loading.value = true;
    const data = await getUserById(id);
    if (data) {
      user.value = data;
      userId.value = id;
    } else {
      addToast("사용자를 찾을 수 없어요", "error");
      router.push("/");
    }
  } catch (err) {
    addToast("사용자를 찾을 수 없어요", "error");
    router.push("/");
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  const id = route.params.userId;
  handleGetUser(id);
});

watch(
  () => route.params.userId,
  () => {
    const id = route.params.userId;
    handleGetUser(id);
  }
);
</script>
<template>
  <section
    class="w-[calc(100%-40px)] max-w-[1640px] min-h-[898px] mt-[120px] flex flex-col contents-box py-[90px] mb-10 px-10 lg:px-20"
  >
    <div
      v-if="loading"
      class="w-full h-full flex-grow flex justify-center items-center"
    >
      <div class="loader text-4xl font-bold text-white">Loading..</div>
    </div>
    <div v-else class="flex w-full h-full flex-grow gap-[7vw]">
      <div class="min-w-[212px] border-white border-r-2 flex flex-col relative">
        <div class="w-full flex flex-col gap-[33px] sticky top-[100px] left-0">
          <router-link
            :to="`/user/${user.id}/post`"
            class="block text-white hover:text-point-500 text-2xl font-bold transition-all"
          >
            게시글
          </router-link>

          <router-link
            :to="`/user/${user.id}/like`"
            class="block text-white hover:text-point-500 text-2xl font-bold transition-all"
          >
            좋아요
          </router-link>

          <router-link
            :to="`/user/${user.id}/rank`"
            class="block text-white hover:text-point-500 text-2xl font-bold transition-all"
          >
            개인별 랭크
          </router-link>

          <router-link
            :to="`/user/${user.id}/comment`"
            class="block text-white hover:text-point-500 text-2xl font-bold transition-all"
          >
            작성한 댓글
          </router-link>
        </div>
      </div>
      <div class="w-full flex flex-col">
        <router-view :user="user" :user-id="userId"></router-view>
      </div>
    </div>
    <img
      src="/assets/images/singleGhost.png"
      alt="ghost"
      class="absolute bottom-[-27px] -left-8 w-[129px] h-[118px] z-10 overflow-visible"
    />
  </section>
</template>

<style scoped>
.router-link-active {
  color: #ce0a9c;
}
</style>
