"use client";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import dynamic from "next/dynamic";
import { TLokasi } from ".";

export function PageClient({ lokasi }: { lokasi: TLokasi[] }) {
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
    return () => {};
  }, []);
  const MyAwesomeMap = dynamic(() => import("./(map)/list-lokasi"), {
    ssr: false,
  });
  return <MyAwesomeMap lokasi={lokasi} />;
}
