import Breadcrumbs from "@/components/layouts/breadcrumbs";
import TableKecamatan from "./table";
import { kabKode } from "@/commons/helpers";
export default async function Home() {
	return (
		<>
			<Breadcrumbs breadcrumbs={[{ name: "List  Kecamatan Kabupaten" }]} />
			<div className="my-3">
				<TableKecamatan kabId={kabKode} />
			</div>
		</>
	);
}
