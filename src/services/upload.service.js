import supabase from "@/lib/supabase/client";

export const uploadImage = async (file, bucketName = "images") => {
  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data, error: urlError } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  if (urlError) {
    throw new Error(urlError.message);
  }

  return data.publicUrl;
};
