import { createRouter, createWebHistory } from "vue-router";
import MainView from "../views/MainView.vue";
import LoginView from "../views/LoginView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: MainView,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/user",
      name: "user",
      children: [
        {
          path: ":userId",
          name: "userProfile",
          component: () => import("../views/UserView.vue"),
        },
        {
          path: "edit",
          name: "userEdit",
          component: () => import("../views/UserEditView.vue"),
        },
      ],
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/post",
      name: "post",
      children: [
        {
          path: ":postId",
          name: "postDetail",
          component: () => import("../views/PostView.vue"),
        },
        {
          path: "edit/:postId", // 포스트 수정
          name: "postEdit",
          component: () => import("../views/PostEditView.vue"),
        },
        {
          path: "write", // 포스트 작성
          name: "postWrite",
          component: () => import("../views/PostWriteView.vue"),
        },
      ],
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/game",
      name: "game",
      children: [
        {
          path: ":gameName",
          name: "gameDetail",
          component: () => import("../views/GameView.vue"),
        },
        {
          path: "play",
          name: "gamePlay",
          component: () => import("../views/GamePlayView.vue"),
        },
      ],
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        requireAuth: false,
        layout: "EmptyLayout",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/NotFoundView.vue"),
      meta: {
        layout: "EmptyLayout",
      },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const { isLoggedIn } = useAuthStore();
  if (to.meta.requireAuth && !isLoggedIn()) {
    next("/login");
  } else if (to.meta.requireAuth === false && isLoggedIn()) {
    next("/");
  }
  next();
});

export default router;
