import React from "react";
import { MdiHome } from "../icons/MdiHome";
import Link from "next/link";

type Props = {
  breadcrumbs?: { name: string; url?: string }[];
};
export default function Breadcrumbs({ breadcrumbs = [] }: Props) {
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link href={"/"} className="inline-flex items-center gap-[3px]">
            <MdiHome className="h-4 w-4" />
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb) => {
          if (crumb.url) {
            return (
              <li key={crumb.name}>
                <Link
                  href={crumb.url}
                  className="inline-flex items-center gap-2"
                >
                  {crumb.name}
                </Link>
              </li>
            );
          }
          return (
            <li key={crumb.name}>
              <span className="inline-flex items-center gap-2">
                {crumb.name}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
