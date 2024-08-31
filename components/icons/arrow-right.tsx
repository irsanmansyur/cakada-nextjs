import type { SVGProps } from "react";

export function SolarAltArrowRightBroken(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m9 5l2 2.333M9 19l6-7l-1.5-1.75"
      ></path>
    </svg>
  );
}
