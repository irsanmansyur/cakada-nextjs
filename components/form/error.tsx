import React from "react";

export default function ErrorInput({ message }: { message?: string }) {
  if (!message) return <></>;
  return (
    <p className="text-red-500 text-xs truncate col-end-2 py-1">{message}</p>
  );
}
