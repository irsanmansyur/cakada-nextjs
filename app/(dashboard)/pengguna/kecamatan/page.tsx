import Breadcrumbs from "@/components/layouts/breadcrumbs";
import TableKecamatan from "./table-kecamatan";
export default async function Home() {
  return (
    <>
      <Breadcrumbs breadcrumbs={[{ name: "List  Relawan Kabupaten" }]} />
      <div className="my-3">
        <TableKecamatan />
      </div>
    </>
  );
}
