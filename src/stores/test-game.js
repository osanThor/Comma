import { getGames } from "@/services/game.service";

export const useGameStore = defineStore(
  "testGameStore",
  () => {
    const games = ref([]);
    const rawGames = computed(() => toRaw(games.value));

    const getGamesData = async () => {
      try {
        const data = await getGames();
        if (data) games.value = data;
      } catch (err) {
        console.error("GET GAME ERROR", err);
        throw err;
      }
    };

    return {
      games,
      rawGames,
      getGamesData,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
