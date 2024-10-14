import { Tab, TabList, Tabs } from "react-aria-components";
import { useState } from "react";
import useAxios from "axios-hooks";
import RekapTable from "./rekap-table";

interface HasilRekapProps {
	kabName?: string;
	kecName?: string;
	kelName?: string;
	relawanId?: number;
	dateStart?: string;
	dateEnd?: string;
}

interface MyTabProps {
	id: string;
	children: React.ReactNode;
}

export function HasilRekap({
	kabName,
	kecName,
	kelName,
	relawanId,
	dateStart,
	dateEnd,
}: HasilRekapProps) {
	const [selectedKey, setSelectedKey] = useState<string>("harapan");

	const [{ data, loading }] = useAxios(
		{
			url: `/api/program-harapan/rekap-group/${selectedKey}`,
			baseURL: "",
			params: {
				...(dateEnd && { dateEnd }),
				...(dateStart && { dateStart }),
				...(kabName && { kabName }),
				...(kecName && { kecName }),
				...(kelName && { kelName }),
				...(relawanId && { relawanId }),
			},
		},
		{
			autoCancel: true,
			ssr: false,
		},
	);
	const namaCaleg = `Husniah Talenrang & Darmawangsyah Muin`;

	return (
		<div className="border border-slate-300 overflow-hidden bg-white rounded-lg my-10">
			<h2 className="text-center bg-slate-600 text-white font-bold sm:text-2xl text-lg py-3 border-b px-2">
				Rekapitulasi Program Harapan <br />
				<strong className="text-slate-100 shadow-sm"> {namaCaleg}</strong>
			</h2>
			<Tabs
				className="space-y-1 pt-1"
				selectedKey={selectedKey}
				onSelectionChange={(e) => {
					setSelectedKey(e as string);
				}}
			>
				<div className="flex px-2 py-1 overflow-x-auto">
					<TabList
						aria-label="Feeds"
						className="flex gap-2 sm:gap-3 text-slate-950 p-1"
					>
						<MyTab id="harapan">Harapan Pemilih</MyTab>
						<MyTab id="tipePemilih">Tipe Pemilih</MyTab>
						<MyTab id="mendukung">Jenis Dukungan</MyTab>
						<MyTab id="mensosialisasikan">Tindakan Pemilih</MyTab>
					</TabList>
				</div>
				<MyRekap loading={loading} data={data?.data} />
			</Tabs>
		</div>
	);
}

function MyRekap({ loading, data }: { loading: boolean; data?: [] }) {
	if (loading || !data) return <p>Loading...</p>;
	return <RekapTable data={data} />;
}

export function MyTab({ id, children }: MyTabProps) {
	return (
		<Tab
			id={id}
			className={({ isSelected }) => `
        px-2 sm:px-4 line-clamp-1 rounded-md py-1 sm:py-2 font-medium text-lg text-center cursor-pointer ring-black outline-none transition-colors focus-visible:ring-2 whitespace-nowrap
        ${isSelected ? "text-white bg-gray-600" : "bg-slate-400"}
      `}
		>
			{children}
		</Tab>
	);
}
