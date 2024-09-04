import Cookies from "js-cookie";
import { useEffect, useState } from "react";

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

export const useCheckLocation = () => {
  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          // Location services are enabled
          setLocationEnabled(true);
          console.log("Location enabled:", position);
        },
        (error) => {
          // Location services are disabled or permission denied
          if (error.code === error.PERMISSION_DENIED) {
            setLocationEnabled(false);
          }
          console.error("Error checking location:", error);
        }
      );
    } else {
      // Geolocation not supported
      console.warn("Geolocation is not supported by this browser.");
      setLocationEnabled(false);
    }
  }, []);

  return { locationEnabled, position };
};
