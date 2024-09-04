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
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  REL_KAB = "relawan kabupaten",
  REL_KEC = "relawan kecamatan",
  REL_KEL = "relawan kelurahan",
}

export const getPayload = (accessToken: string) => {
  // Pisahkan token berdasarkan titik
  const parts = accessToken.split(".");
  // Pastikan token valid dengan memiliki 3 bagian
  if (parts.length !== 3) {
    throw new Error("Invalid JWT token");
  }

  // Ambil bagian payload dari token (Bagian kedua)
  const payloadBase64Url = parts[1];

  // Konversi Base64Url menjadi Base64
  const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");

  // Decode Base64 menjadi string JSON
  const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf8");
  // Parse JSON untuk mendapatkan objek payload
  return JSON.parse(payloadJson);
};
