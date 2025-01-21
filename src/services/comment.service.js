import supabase from "@/lib/supabase/client";

const formetSort = (value) => {
  switch (value) {
    case "dec":
      return ["created_at", "desc"];
    case "likes":
      return ["like_count", "desc"];
    default:
      return ["created_at", "desc"];
  }
};

export const getComments = async (
  postId,
  sort = "dec",
  page = 1,
  limit = 10
) => {
  const { count, error: countError } = await supabase
    .from("comments_with_counts")
    .select("id", { count: "exact" })
    .eq("post_id", postId);

  if (countError) throw countError;

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const [sortBy] = formetSort(sort);

  const { data, error } = await supabase
    .from("comments_with_counts")
    .select(
      `
      *,
      user:user_id(id, name, email, profile_image)
      `
    )
    .eq("post_id", postId)
    .order(sortBy, { ascending: false })
    .range(start, end);

  if (error) throw error;

  return {
    data: data.map((comment) => ({
      ...comment,
      like_count: comment.like_count.length || 0,
    })),
    totalCount: count,
  };
};

export const createComment = async ({ postId, content, userId }) => {
  const { error } = await supabase
    .from("comments")
    .insert([{ post_id: postId, content, user_id: userId }]);
  if (error) throw error;
  return "success";
};

export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);
  if (error) throw error;
  return "success";
};


