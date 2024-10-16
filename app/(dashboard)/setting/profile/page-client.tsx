"use client";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import { TUser } from "@/utils/type/user";

export function PageClient({ profile }: { profile: TUser }) {
  return (
    <>
      <form className="space-y-3">
        <div className="flex gap-3 flex-col md:flex-row">
          <div className="w-full"></div>
        </div>
      </form>
    </>
  );
}
