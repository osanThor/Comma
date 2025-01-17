import axios from "axios";

export const imgUploadInstance = axios.create({
  baseURL: import.meta.env.VITE_IMAGE_UPLOAD_URL,
  headers: { "Content-Type": "multipart/form-data" },
  params: {
    key: import.meta.env.VITE_IMAGE_UPLOAD_KEY,
  },
});
