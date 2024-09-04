import Cookies from "js-cookie";
import { ERole } from "./enum";
import { TPayloadUser } from "./type/user";

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
  return JSON.parse(payloadJson) as TPayloadUser;
};

export const setCookiesLogin = (accessToken: string, refreshToken: string) => {
  const accessTokenPayload = getPayload(accessToken);
  const refreshTokenPayload = getPayload(refreshToken);
  Cookies.set("accessToken", accessToken, {
    expires: new Date(accessTokenPayload.exp * 1000),
  });
  Cookies.set("refreshToken", refreshToken, {
    expires: new Date(refreshTokenPayload.exp * 1000),
  });
};

export function decodeBase64(base64String: string) {
  // Add padding if necessary
  const paddedString = base64String.padEnd(
    base64String.length + ((4 - (base64String.length % 4)) % 4),
    "="
  );

  // Decode base64 string
  const decodedString = atob(paddedString);

  // Parse the JSON string
  return JSON.parse(decodedString);
}

export function decodeAccessToken(token: string) {
  const tokenParts = token.split(".");
  if (tokenParts.length !== 3) {
    throw new Error("Invalid token format");
  }

  // The payload is the second part of the token
  const payload = tokenParts[1];
  return decodeBase64(payload);
}

export const clearCookies = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
};

export const hasRole = (...roles: ERole[]): boolean => {
  const accessToken = Cookies.get("accessToken");
  if (!accessToken) return false;
  const roleUser = getPayload(accessToken);
  if (!Array.isArray(roles)) {
    roles = [roles];
  }
  return roles.includes(roleUser.role.name);
};
