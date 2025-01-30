import { getGameRanking, getGames } from "@/services/game.service";

export const useGameStore = defineStore(
  "testGameStore",
  () => {
    const games = ref([]);
    const gameTopRankers = reactive({
      flappyBoo: null,
      mineSweeper: null,
      bounceBall: null,
      tetris: null,
      shooting: null,
    });

    const getGamesData = async () => {
      try {
        const data = await getGames();
        if (data) games.value = data;
      } catch (err) {
        console.error("GET GAME ERROR", err);
        throw err;
      }
    };

    const getGameTopRanker = async (gameId) => {
      try {
        const data = await getGameRanking(gameId);
        gameTopRankers[data[0].game?.name] = data[0];
        return data[0];
      } catch (err) {
        console.error(err);
        throw new Error(`GET RANKER ERROR`);
      }
    };

    const getGameTopRankers = async () => {
      try {
        if (games.value.length)
          await Promise.all(
            games.value.map((game) => getGameTopRanker(game.id))
          );
      } catch (err) {
        console.error(err);
      }
    };

    return {
      games,
      getGamesData,
      gameTopRankers,
      getGameTopRanker,
      getGameTopRankers,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
