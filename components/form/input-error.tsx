export function InputErrorMessage({ error }: { error?: string }) {
  if (!error) <></>;
  return <div className="text-red-500 text-xs  whitespace-nowrap">{error}</div>;
}
