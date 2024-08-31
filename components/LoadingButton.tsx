import { MdiLoading } from "./icons/MdiLoading";

export default function LoadingButton() {
  return (
    <div className="flex justify-center w-full my-4">
      <button
        type="button"
        className="bg-primary-blue flex justify-center rounded p-2 text-white items-center gap-2"
        disabled
      >
        <MdiLoading className="animate-spin h-5 w-5" />
        Processing...
      </button>
    </div>
  );
}
