import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore(
  "authStore",
  () => {
    const user = ref(null);

    const updateUser = (updatedUser) => {
      user.value = updatedUser;
    };
    const isLoggedIn = () => !!user.value;

    return {
      user,
      updateUser,
      isLoggedIn,
    };
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ["user"],
    },
  }
);
