import Breadcrumbs from "@/components/layouts/breadcrumbs";
import { PageClient } from "./mydrager";

export default async function Home() {
  return (
    <>
      <Breadcrumbs
        breadcrumbs={[
          { name: "Lokasi", url: "/setting/lokasi" },
          { name: "Tambah Lokasi" },
        ]}
      />
      <div className="my-3 block space-y-3">
        <PageClient />
      </div>
    </>
  );
}
