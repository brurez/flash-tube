import { apiEndpoint } from "../config";
import { Video } from "../types/Video";
import { CreateVideoRequest } from "../types/CreateVideoRequest";
import Axios from "axios";
import { UpdateVideoRequest } from "../types/UpdateVideoRequest";

export async function getVideos(idToken: string): Promise<Video[]> {
  console.log("Fetching videos");

  const response = await Axios.get(`/${apiEndpoint}/video`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("Videos:", response.data);
  return response.data;
}

export async function getOneVideo(idToken: string, id: string): Promise<Video> {
  console.log("Fetching one video");

  const response = await Axios.get(`/${apiEndpoint}/video/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
  console.log("Video:", response.data);
  return response.data;
}

export async function createVideo(
  idToken: string,
  newVideo: CreateVideoRequest
): Promise<Video> {
  const response = await Axios.post(
    `/${apiEndpoint}/video`,
    JSON.stringify(newVideo),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data;
}

export async function patchVideo(
  idToken: string,
  videoId: string,
  updatedVideo: UpdateVideoRequest
): Promise<void> {
  await Axios.patch(
    `/${apiEndpoint}/video/${videoId}`,
    JSON.stringify(updatedVideo),
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
}

export async function deleteVideo(
  idToken: string,
  videoId: string
): Promise<void> {
  await Axios.delete(`/${apiEndpoint}/video/${videoId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });
}

export async function getUploadUrl(
  idToken: string,
  videoId: string
): Promise<string> {
  const response = await Axios.get(
    `/${apiEndpoint}/video/${videoId}/attachment`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  return response.data.url;
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file);
}
