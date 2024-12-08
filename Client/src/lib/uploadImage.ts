import { SummaryApi } from "@/constants/SummaryApi";
import Axios from "./Axios";

interface ImageUploadResponse {
  data: {
    data: {
      url: string;
    };
  };
}

const uploadImage = async (image: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append("image", image);

  const response = await Axios({
    ...SummaryApi.uploadImage,
    data: formData,
  });

  return response;
};

export default uploadImage;
