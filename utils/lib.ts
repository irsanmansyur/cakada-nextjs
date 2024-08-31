import axios from "axios";
import { cookies } from "next/headers";

export function getSession() {
  const accessToken = cookies().get("accessToken")?.value;
  if (!accessToken) return null;
  return accessToken;
}

export async function storeCookies(accessToken: string, refreshToken: string) {
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  cookies().set("accessToken", accessToken, { expires, httpOnly: true });
  cookies().set("refreshToken", refreshToken, { expires, httpOnly: true });
}

export const SERVER_URL = process.env.API_URL || "http://localhost:3000";

export const axiosInstance = () => {
  const axiosClient = axios.create({
    baseURL: SERVER_URL,
    headers: {
      Authorization: `Bearer ${getSession()}`,
    },
  });

  return axiosClient;
};

export enum ERole {
  ADMIN = "admin",
  OWNER = "owner",
  KASIR = "kasir",
}
