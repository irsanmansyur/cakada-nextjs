"use client";
import { TApi } from "@/utils";
import { TKecamatan } from "@/utils/type/kecamatan";
import useAxios from "axios-hooks";
import React, { useEffect, useState } from "react";
import Select from "react-select";

type KecamatanSelect2024Props = {
	kabId: number;
	kecId?: string | null;
	kecamatan: any;
	onChange?: (selectedOption: TKecamatan) => void;
};

export const KecamatanSelect2024: React.FC<KecamatanSelect2024Props> = ({
	kabId,
	kecId,
	kecamatan,
	onChange,
}) => {
	const [, loadKec] = useAxios(
		{ url: `/kecamatan/details/${kecId}?tahun=2024` },
		{ manual: true },
	);
	const id = Date.now().toString();
	const [isMounted, setIsMounted] = useState(false);

	const [{ data, loading }] = useAxios<TApi<TKecamatan[]>>({
		url: `/api/kecamatan`,
		params: { tahun: 2024, ...(kabId ? { kabId } : {}) },
	});

	useEffect(() => setIsMounted(true), []);

	useEffect(() => {
		if (kecId) {
			loadKec()
				.then((dt) => {
					const op = dt.data.data;
					if (onChange) onChange({ ...op, value: op.wilId, label: op.kecNama });
				})
				.catch((e) => console.log(e.message));
		}
	}, [kecId, loadKec, onChange]);
	if (!isMounted) return <></>;
	return (
		<Select
			id={id}
			className="basic-single !w-full whitespace-nowrap"
			classNamePrefix="select"
			isLoading={loading}
			isClearable={true}
			isSearchable={true}
			value={kecamatan}
			placeholder="Select Kecamatan"
			onChange={(value) => {
				if (onChange) onChange(value);
			}}
			options={
				data
					? data.data.map((op: any) => ({
							...op,
							value: op.wilId,
							label: op.kecNama,
						}))
					: []
			}
		/>
	);
};
