"use client";

import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import { MdiLocationCheckOutline } from "@/components/icons/MdiLocationCheckOutline";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const { setPosition, locationEnabled, setLocationEnabled } =
    useStoreDashboard();
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationEnabled(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationEnabled(false);
          }
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setLocationEnabled(false);
    }
  }, [setLocationEnabled, setPosition]);

  if (locationEnabled === null) return <p>Checking location services...</p>;

  const handleLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ latitude, longitude });
          setLocationEnabled(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            // Alert the user if permission is denied
            alert(
              "Akses lokasi diperlukan untuk melanjutkan. Silakan izinkan akses lokasi di pengaturan browser Anda."
            );
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            alert("Posisi tidak tersedia.");
          } else if (error.code === error.TIMEOUT) {
            alert("Permintaan lokasi timeout.");
          } else {
            alert("Gagal mengakses lokasi.");
          }
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (locationEnabled === false)
    return (
      <div className="flex items-center justify-center flex-col h-screen gap-5">
        <span>Location services are disabled.</span>
        <button className="btn btn-error" onClick={handleLocationAccess}>
          <MdiLocationCheckOutline className="w-10 h-10" />
          Please enable location services
        </button>
      </div>
    );
  return children;
}
