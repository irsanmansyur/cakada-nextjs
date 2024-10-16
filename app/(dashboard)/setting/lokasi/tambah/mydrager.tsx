"use client";

import React, { useEffect, useState } from "react";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import dynamic from "next/dynamic";

export function PageClient() {
  const { position } = useStoreDashboard();
  useEffect(() => {
    return () => {};
  }, []);
  if (position.latitude == 0) return "";

  const MyAwesomeMap = dynamic(() => import("../(map)/tambah-lokasi"), {
    ssr: false,
  });
  return (
    <MyAwesomeMap
      position={{ lat: position.latitude, lng: position.longitude }}
    />
  );
}
