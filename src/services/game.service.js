import supabase from "@/lib/supabase/client";

export const getGames = async () => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("display_name", { ascending: false });

  if (error) throw error;
  return data;
};

export const getGameByName = async (gameName) => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("name", gameName)
    .single();

  if (error) throw error;
  return data;
};

export const updateGameScore = async (gameId, userId, score, playTime) => {
  const { data: existingGameData, error: existingGameError } = await supabase
    .from("game_scores")
    .select("total_play_time")
    .eq("game_id", gameId)
    .eq("user_id", userId)
    .single();
  if (existingGameError && existingGameError.code === "PGRST116") {
    const { error: insertGameError } = await supabase
      .from("game_scores")
      .insert([
        {
          game_id: gameId,
          user_id: userId,
          score,
          play_time: playTime,
          total_play_time: playTime,
        },
      ]);
    if (insertGameError) throw insertGameError;
    return "suceess";
  }
  if (existingGameError) {
    throw existingGameError;
  }

  const { error: updateGameError } = await supabase
    .from("game_scores")
    .update([
      {
        score,
        play_time: playTime,
        total_play_time: existingGameData.total_play_time + playTime,
      },
    ])
    .eq("game_id", gameId)
    .eq("user_id", userId);
  if (updateGameError) throw updateGameError;
  return "suceess";
};

export const getGameRanking = async (gameId, sortType = "desc") => {
  const { data, error } = await supabase
    .from("game_scores")
    .select("*")
    .eq("game_id", gameId)
    .order("score", { ascending: sortType === "asc" });
  if (!data) return [];
  if (error) throw error;

  return data.map((game, idx) => ({ ...game, rank: idx + 1 }));
};

export const getGameScoreByUser = async (userID, sortType = "desc") => {
  const { data, error } = await supabase
    .from("game_scores")
    .select("*,game:game_id(id)")
    .eq("user_id", userID)
    .order("score", { ascending: sortType === "asc" });

  if (!data) return [];
  if (error) throw error;

  return data;
};
