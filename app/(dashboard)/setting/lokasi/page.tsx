import Breadcrumbs from "@/components/layouts/breadcrumbs";
import { TApi } from "@/utils";
import { axiosInstance } from "@/utils/lib";
import { kabKode } from "@/commons/helpers";
import { PageClient } from "./page-client";
import Link from "next/link";
import { TLokasi } from ".";

const getLokasi = (kabId: number) => {
  return axiosInstance().get<TApi<TLokasi[]>>(`/api/lokasi`);
};
export default async function Home() {
  const {
    data: { data: lokasi },
  } = await getLokasi(kabKode);
  return (
    <>
      <Breadcrumbs breadcrumbs={[{ name: "Lokasi" }]} />
      <div className="my-3 space-y-3">
        <Link href={"/setting/lokasi/tambah"} className="btn btn-primary">
          Tambah Lokasi
        </Link>
        {lokasi.length > 0 ? (
          <PageClient lokasi={lokasi} />
        ) : (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Lokasi Kosong.</span>
          </div>
        )}
      </div>
    </>
  );
}
