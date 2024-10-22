import axios from "axios";
import useAxios from "axios-hooks";
import { useEffect, useState } from "react";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";
import { MdiPeopleGroup } from "./icons/MdiPeopleGroup";
import { TDpt } from "@/utils/type/dpt";
import Swal from "sweetalert2";

type OptionType = {
	value: string;
	label: React.ReactNode;
	[key: string]: any;
};

type KepalaKeluargaSelectProps = {
	kabId: number;
	kelId?: number;
	kecId?: number;
	limit?: number;
	onChange?: (value: OptionType | null) => void;
	value?: OptionType | null;
	dpt?: TDpt;
};

export default function KepalaKeluargaSelect({
	kabId,
	kelId,
	kecId,
	limit = 20,
	onChange = (v) => v,
	value: initialValue,
	dpt,
}: KepalaKeluargaSelectProps) {
	const [searchKey, setSearchKey] = useState(
		`${kabId}-${kecId || ""}-${kelId || ""}`,
	);
	const [loading, setLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => setIsMounted(true), []);

	const [value, setValue] = useState<OptionType | null>(initialValue || null);
	const [inputValue, setInputValue] = useState<string>("");

	const loadOptions = async (input: any, prevOptions: any, { page }: any) => {
		setLoading(true);
		const params: Record<string, any> = {
			page,
			limit,
		};
		if (kecId) params.kecId = kecId;
		if (kelId) params.kelId = kelId;
		if (input) params.nama = input;

		const { data } = await axios.get(`/api/dpt/${kabId}`, { params });
		setLoading(false);

		const options = data.data.map(({ isKk, ...option }: any) => ({
			...option,
			label: (
				<div className="flex flex-col bg-gray-50 text-gray-800 p-3 hover:bg-sky-500 hover:text-white relative">
					<div className="flex gap-2 items-center">
						<span>{option.nama}</span>
						{isKk !== false && <MdiPeopleGroup className="w-5 h-5" />}
					</div>
					<small>Umur: {option.usia}</small>
					<small>Kel: {option.namaKel}</small>
					<small>RT/RW: {`${option.rt}/${option.rw}`}</small>
				</div>
			),
		}));

		// Jika tidak ada hasil, tambahkan opsi "Tambah Kepala Keluarga"
		if (options.length === 0 && input) {
			options.push({
				value: "add-new",
				label: (
					<div className="flex gap-2 items-center text-blue-600">
						<span>+ Tambah Kepala Keluarga &quot;{input}&quot;</span>
					</div>
				),
				isNew: true,
				nama: input,
			});
		}

		return {
			options,
			hasMore: data.data.length >= limit,
			additional: {
				page: data.data.length >= limit ? page + 1 : page,
			},
		};
	};

	const onChangeDefault = (v: OptionType | null) => {
		if (v && v.isNew) {
			handleAddNewKepalaKeluarga(v.nama);
		} else if (v) {
			setValue({ ...v, label: v.nama });
			onChange(v);
		} else {
			setValue(null);
			onChange(null);
		}
	};

	const [{}, postDpt] = useAxios(
		{
			url: process.env.NEXT_PUBLIC_DOMAIN + `/api/dpt/${kabId}`,
			method: "POST",
		},
		{ manual: true },
	);

	// Fungsi untuk menangani penambahan Kepala Keluarga baru
	const handleAddNewKepalaKeluarga = async (nama: string) => {
		// Tampilkan swal untuk konfirmasi
		Swal.fire({
			title: "Apakah Anda yakin?",
			text: `Anda akan menambahkan Kepala Keluarga dengan nama "${nama}"`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Ya, tambahkan!",
			cancelButtonText: "Batal",
		}).then(async (result) => {
			if (result.isConfirmed) {
				// Jika pengguna menekan tombol "Ya"
				postDpt({
					data: {
						kabId,
						nama,
						idKec: kecId,
						idKel: kelId,
						namaTps: "000",
						umur: 0,
						isKk: true,
					},
				})
					.then(({ data }) => {
						if (data) {
							const newKK = {
								...data.data,
								value: data.data.idDpt,
								label: data.data.nama,
							};
							setValue(newKK);
							onChange(newKK);

							// Reset cache pencarian dan input
							setSearchKey(
								`${kabId}-${kecId || ""}-${kelId || ""}-${Date.now()}`,
							); // Update key untuk reset cache
							setInputValue(""); // Reset input value

							// Tampilkan swal sukses
							Swal.fire(
								"Berhasil!",
								`Kepala Keluarga "${nama}" telah ditambahkan.`,
								"success",
							);
						}
					})
					.catch(({ response }) => {
						// Tampilkan swal error jika ada masalah
						Swal.fire(
							"Error!",
							"Terjadi kesalahan saat menambahkan Kepala Keluarga.",
							"error",
						);
					});
			}
		});
	};

	// Handler for input change with delay
	let idTimeout: ReturnType<typeof setTimeout>;
	const onInputChange = (inputValueNew: string) => {
		if (idTimeout) clearTimeout(idTimeout);
		idTimeout = setTimeout(() => {
			setInputValue(inputValueNew + " ");
		}, 2000);
		setInputValue(inputValueNew);
	};
	if (!isMounted) return <></>;
	return (
		<AsyncPaginate
			key={searchKey} // Gunakan searchKey untuk memicu reset pencarian
			value={value}
			isClearable={true}
			placeholder="Select Kepala Keluarga"
			onChange={onChangeDefault}
			className={"basic-single !w-full whitespace-nowrap"}
			loadOptions={loadOptions}
			isLoading={loading}
			getOptionLabel={(v: OptionType) => v.label as string}
			additional={{
				page: 1,
			}}
			onInputChange={onInputChange}
		/>
	);
}
