import axios from "axios";

export const uploadCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "atwymgd9");
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/dm5uvtj7t/image/upload`,
      formData
    );
    return { url: data?.secure_url };
  } catch (error) {
    console.error(error);
  }
};

export function configure(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
