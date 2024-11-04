import { SelectFormGroup } from "@/components/form/form-group";
import { TKelurahan } from "@/utils/type/kecamatan";
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";

export default function KelurahanSelect({
	kelurahans: kls,
	kecamatan,
	onChange,
}: {
	kelurahans: TKelurahan[];
	kecamatan?: string;
	onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
	const [kelurahans, setKelurahans] = useState(kls);
	useEffect(() => {
		if (kecamatan && kecamatan.length > 0) {
			const newKels = kls.filter((item) => {
				return item.kecName.toLowerCase() === kecamatan.toLowerCase();
			});
			setKelurahans(newKels);
		}
		return () => {};
	}, [kecamatan, kls]);
	return (
		<SelectFormGroup
			classNameParent="w-1/2 sm:w-1/3 p-2"
			label={"Kelurahan/Desa"}
			id="kelurahan-id"
			name="Kelurahan"
			options={[
				{ value: "", label: "--- Kelurahan/Desa ---" },
				...kelurahans.map((item) => ({
					...item,
					value: item.kelName,
					label: item.kelName,
				})),
			]}
			onChange={onChange}
		/>
	);
}
