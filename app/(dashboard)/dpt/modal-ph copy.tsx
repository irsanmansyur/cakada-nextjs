import { useStoreDashboard } from "@/commons/helpers/dashboard-client";
import ErrorInput from "@/components/form/error";
import FormGroup, { SelectFormGroup } from "@/components/form/form-group";
import KepalaKeluargaSelect from "@/components/kepala-keluarga-select";
import LoadingButton from "@/components/LoadingButton";
import { TApi } from "@/utils";
import { TDpt, TTipePemilih } from "@/utils/type/dpt";
import { TDtdoor, TKunjungan } from "@/utils/type/dtdoor";
import { TKabupaten } from "@/utils/type/kabupaten";
import axios from "axios";
import useAxios from "axios-hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { z } from "zod";
import Swal from "sweetalert2";
import { hasRole } from "@/utils/helpers";
import { ERole } from "@/utils/enum";
import { InputErrorMessage } from "@/components/form/input-error";
import { TProgramHarapan } from "../program-harapan";

const baseImage =
	"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

export const readFile = (file: File): Promise<string | ArrayBuffer | null> => {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => resolve(reader.result), false);
		reader.readAsDataURL(file);
	});
};
export default function ModalFPH({
	kabupaten,
	dpt,
	onAdded,
}: {
	dpt: TDpt;
	kabupaten: TKabupaten;
	onAdded: () => void;
}) {
	const [{ data: dataProgramHarapan, loading: loadingDtdoor }] = useAxios(
		process.env.NEXT_PUBLIC_DOMAIN +
			`/api/program-harapan/cek/${dpt.idDpt}/${dpt.idKel}`,
		{
			useCache: false,
		},
	);
	if (loadingDtdoor) return <LoadingButton />;

	return (
		<ModalDfhLocal
			programHarapan={dataProgramHarapan.data}
			dpt={dpt}
			onAdded={onAdded}
			kabupaten={kabupaten}
		/>
	);
}

function ModalDfhLocal({
	programHarapan,
	kabupaten,
	onAdded,
	dpt,
}: {
	programHarapan?: TProgramHarapan;
	dpt: TDpt;
	onAdded: () => void;
	kabupaten: TKabupaten;
}) {
	const { position, user } = useStoreDashboard();
	const [data, setData] = useState<TProgramHarapan>({
		idDpt: dpt.idDpt,
		kepalaKeluarga: programHarapan?.kepalaKeluarga || "",
		kepalaKeluargaId: programHarapan?.kepalaKeluargaId || 0,
		kabId: kabupaten.wilId,
		kabName: kabupaten.kabNama || "",
		nik: programHarapan?.nik || dpt.nik || "",
		namaLengkap: programHarapan?.namaLengkap || dpt.nama,
		jenisKelamin: programHarapan?.jenisKelamin || dpt.jenisKelamin,
		kecId: programHarapan?.kecId || dpt.idKec,
		kecName: programHarapan?.kecName || dpt.namaKec,
		kelId: programHarapan?.kelId || dpt.idKel,
		kelName: programHarapan?.kelName || dpt.namaKel,
		tps: programHarapan?.tps || dpt.namaTps,
		rt: programHarapan?.rt || dpt["rt"],
		rw: programHarapan?.rw || dpt["rw"],
		status: programHarapan?.status || "active",
		jumlahWajibPilih: programHarapan?.jumlahWajibPilih || 2,
		noTelpon: programHarapan?.noTelpon || "-",
		namaRelawan: programHarapan?.namaRelawan || "",
		kontakRelawan: programHarapan?.kontakRelawan || "",
		harapan: programHarapan?.harapan || "",
		mendukung: programHarapan?.mendukung || "",
		mensosialisasikan: programHarapan?.mensosialisasikan || "",
		position,
		jumlahKunjungan: programHarapan?.jumlahKunjungan || 1,
		tipePemilih: programHarapan?.tipePemilih || "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loadingAdd, setLoadingAdd] = useState(false);

	const validate = () => {
		const programBantuanSchema = z
			.object({
				tipePemilih: z.string().min(1, { message: "Tipe pemilih harus diisi" }),
				kepalaKeluargaId: z
					.number()
					.int()
					.positive({ message: "Kepala Keluarga harus diisi" }),
				kepalaKeluargaName: z.string().optional(),
				harapan: z
					.string({ message: "Harus Isi Harapan" })
					.min(1, { message: "Harus Isi Harapan" }),
				mendukung: z
					.string({ message: "Harus Isi Mendukung" })
					.min(1, { message: "Harus Isi Mendukung" }),
				mensosialisasikan: z.string().min(1, { message: "Harus diisi" }),
				namaRelawan: z.string().min(1, { message: "namaRelawan harus diisi" }),
				kontakRelawan: z
					.union([
						z.string().regex(/^\+?\d+$/, {
							message: "kontakRelawan harus dalam format telepon",
						}),
						z.number(),
					])
					.transform((value) => String(value)),
			})
			.refine(
				(data) => data.kepalaKeluargaId || data.kepalaKeluargaName, // Kondisi validasi
				{
					message: "Salah satu Kepala Keluarga ID atau Nama harus diisi",
					path: ["kepalaKeluargaId"], // Pesan kesalahan terkait Kepala Keluarga ID
				},
			);

		const { error } = programBantuanSchema.safeParse(data);
		if (error) {
			const formattedErrors = error.errors.reduce((acc: any, error: any) => {
				const [key] = error.path;
				acc[key] = error.message;
				return acc;
			}, {});
			setErrors(formattedErrors);
			return false;
		}
		return true;
	};

	const refClose = useRef(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (loadingAdd) return;

		setLoadingAdd(true);

		const isValid = validate();

		if (isValid === false) {
			alert("Data tidak valid");
			setLoadingAdd(false);
			return;
		}

		axios
			.post(`/api/program-harapan`, { ...data })
			.catch((err) => {
				if (err.response?.status === 422) {
					setErrors(err.response.data.errors);
					return;
				}
				Swal.fire({
					icon: "error",
					title: "Error",
				});
			})
			.then(() => {
				if (!refClose?.current) return;
				(refClose.current as HTMLElement).click();
				Swal.fire({
					icon: "success",
					title: "Success",
				}).then(() => {
					onAdded();
				});
			})
			.finally(() => {
				setLoadingAdd(false);
			});
	};

	function formatPhone(input: string): string {
		// Hapus semua karakter non-digit dari input
		const cleanedInput = input.replace(/\D/g, "");

		// Tambahkan spasi setiap 3 digit
		let formattedNumber = "";
		for (let i = 0; i < cleanedInput.length; i += 3) {
			if (i > 0) {
				formattedNumber += " ";
			}
			formattedNumber += cleanedInput.substring(i, i + 3);
		}

		return formattedNumber;
	}
	const namaCaleg = `Husniah Talenrang & Darmawangsyah Muin`;

	function formatValuePilihanLainya(value: string, prefix: string) {
		if (!value.includes(prefix)) return "";
		const newV = value.replace(prefix, "").replace(" : ", "");
		return newV;
	}

	return (
		<dialog id="my_modal_4" className="modal">
			<div className="modal-box w-11/12 max-w-5xl">
				<div className="flex justify-between items-center mb-7">
					<h3 className="font-bold text-lg">Form Penggalangan Harapan</h3>
					<div className="modal-action" style={{ marginTop: 0 }}>
						<form method="dialog">
							<button ref={refClose} className="rounded border px-2">
								X
							</button>
						</form>
					</div>
				</div>
				<div>
					<form className="w-full space-y-4" onSubmit={handleSubmit}>
						<div className="flex">
							<label className="sm:w-[300px] w-1/2 flex-shrink-0">
								Kecamatan
							</label>
							<input
								type="text"
								placeholder="Type here"
								className="input input-bordered w-full max-w-xs input-sm"
								value={data.kecName}
								onChange={(e) => setData({ ...data, kecName: e.target.value })}
							/>
						</div>
						<div className="flex">
							<label className="sm:w-[300px] w-1/2 flex-shrink-0">
								Kelurahan/Desa
							</label>
							<div>
								<input
									type="text"
									placeholder="Type here"
									className="input input-bordered w-full max-w-xs input-sm"
									value={data.kelName}
									onChange={(e) =>
										setData({ ...data, kelName: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="flex">
							<label className="w-[300px]">Nama Yang Ditemui</label>
							<input
								type="text"
								placeholder="Type here"
								className="input input-bordered w-full max-w-xs input-sm"
								value={data.namaLengkap}
								onChange={(e) =>
									setData({ ...data, namaLengkap: e.target.value })
								}
							/>
						</div>

						<div className="flex flex-col sm:flex-row">
							<label className="pb-1 w-[300px] flex-shrink-0">
								Kepala Keluarga
							</label>
							<div className="w-full">
								<KepalaKeluargaSelect
									kabId={data.kabId}
									kelId={data?.kelId}
									kecId={data?.kecId}
									value={data.kepalaKeluargaId as any}
									onChange={(v) => {
										setData((e) => ({
											...e,
											kepalaKeluarga: v?.nama || "",
											kepalaKeluargaId: v?.idDpt || "",
										}));
									}}
								/>
								<InputErrorMessage error={errors.kepalaKeluargaId} />
							</div>
						</div>

						<div className="flex">
							<label className="w-[300px]">Nik</label>
							<input
								type="text"
								placeholder="Type here"
								className="input input-bordered w-full max-w-xs input-sm"
								value={data.nik}
								onChange={(e) => setData({ ...data, nik: e.target.value })}
							/>
						</div>
						<div className="flex">
							<label className="w-[300px]">No. Telp/HP</label>
							<input
								type="text"
								placeholder="Type here"
								className="input input-bordered w-full max-w-xs input-sm"
								value={formatPhone(data.noTelpon)}
								onChange={(e) => {
									const input = e.target.value.replace(/\D/g, "");
									setData({ ...data, noTelpon: input });
								}}
							/>
						</div>
						<div className="flex gap-3">
							<FormGroup
								id="jmlWajibPilih"
								classNameParent="w-full"
								type="number"
								min={"2"}
								name={"jmlWajibPilih"}
								label={"Jumlah Anggota Keluarga yang punya hak pilih : "}
								value={data.jumlahWajibPilih}
								onChange={(e) =>
									setData({ ...data, jumlahWajibPilih: +e.target.value })
								}
							/>
							<SelectFormGroup
								id={"tipePemilihId"}
								name={"tipePemilihId"}
								label="Tipe Pemilih"
								classNameParent="w-full"
								className="p-2"
								value={data.tipePemilih}
								onChange={(e) => {
									setData({
										...data,
										tipePemilih: e.target.value,
									});
								}}
								options={[
									{ value: "", label: "Pilih" },
									{ value: "Simpatisan", label: "Simpatisan" },
									{ value: "Simpatisan Aktif", label: "Simpatisan Aktif" },
									{ value: "Relawan", label: "Relawan" },
									{ value: "Saksi", label: "Saksi" },
									{ value: "Tim Lain", label: "Tim Lain" },
									{ value: "Pemilih Kompetitor", label: "Pemilih Kompetitor" },
									{ value: "Belum Menentukan", label: "Belum Menentukan" },
								]}
								error={errors[`tipePemilih`]}
							/>
						</div>

						<ul className="space-y-4 pt-4">
							<li className="flex gap-2">
								<span>1. </span>
								<div>
									Apa harapan Bapak/Ibu terhadap <strong>{namaCaleg} </strong>
									jika terpilih sebagai Bupati & Wakil Bupati Gowa?
									{errors[`harapan`] && (
										<p className="text-red-500 text-xs italic pb-3">
											{errors[`harapan`]}
										</p>
									)}
									<div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-10"
													className="radio checked:bg-red-500"
													value={"Pembangunan Jalan"}
													checked={data.harapan === "Pembangunan Jalan"}
													onChange={(e) => {
														setData({
															...data,
															harapan: e.target.value,
														});
													}}
												/>
												<span className="label-text">Pembangunan Jalan</span>
											</label>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-10"
													className="radio checked:bg-red-500"
													value={"Seragam Gratis Siswa Baru (SD/SMP)"}
													checked={
														data.harapan ===
														"Seragam Gratis Siswa Baru (SD/SMP)"
													}
													onChange={(e) => {
														setData({
															...data,
															harapan: e.target.value,
														});
													}}
												/>
												<span className="label-text">
													Seragam Gratis Siswa Baru (SD/SMP)
												</span>
											</label>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-10"
													className="radio checked:bg-red-500"
													value={"Tersedianya Pupuk dan Bibit untuk Petani"}
													checked={
														data.harapan ===
														"Tersedianya Pupuk dan Bibit untuk Petani"
													}
													onChange={(e) => {
														setData({
															...data,
															harapan: e.target.value,
														});
													}}
												/>
												<span className="label-text">
													Tersedianya Pupuk dan Bibit untuk Petani
												</span>
											</label>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-10"
													className="radio checked:bg-red-500"
													value={"Ambulance Gratis"}
													checked={data.harapan === "Ambulance Gratis"}
													onChange={(e) => {
														setData({
															...data,
															harapan: e.target.value,
														});
													}}
												/>
												<span className="label-text">Ambulance Gratis</span>
											</label>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-10"
													className="radio checked:bg-red-500"
													value={"Lainya"}
													checked={data.harapan.includes("Lainya")}
													onChange={(e) => {
														setData({
															...data,
															harapan: e.target.value,
														});
													}}
												/>
												<div className="flex gap-2 items-center">
													<span className="label-text">Lainya</span>
													<input
														type="text"
														placeholder="Input disini"
														className="input input-ghost w-full max-w-xs input-sm"
														style={{ borderBottom: "1px solid #333" }}
														value={formatValuePilihanLainya(
															data.harapan,
															"Lainya",
														)}
														onChange={(e) => {
															setData({
																...data,
																harapan: "Lainya : " + e.target.value,
															});
														}}
													/>
												</div>
											</label>
										</div>
									</div>
								</div>
							</li>
							<li className="flex gap-2">
								<span>2. </span>
								<div>
									Apakah Bapak/Ibu akan mendukung jika{" "}
									<strong>{namaCaleg} </strong>
									berkeinginan membaktikan dirinya mensejahterakan Gowa?
									{errors[`mendukung`] && (
										<p className="text-red-500 text-xs italic pb-3">
											{errors[`mendukung`]}
										</p>
									)}
									<div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-mendukung"
													className="radio checked:bg-red-500"
													value={"Ya, Mendukung"}
													checked={data.mendukung === "Ya, Mendukung"}
													onChange={(e) => {
														setData({
															...data,
															mendukung: e.target.value,
															mensosialisasikan: "Ya, Aktif",
														});
													}}
												/>
												<span className="label-text">Ya, Mendukung (A)</span>
											</label>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-mendukung"
													className="radio checked:bg-red-500"
													value={"Tidak Mendukung"}
													checked={data.mendukung === "Tidak Mendukung"}
													onChange={(e) => {
														if (!e.target.checked) return;

														setData({
															...data,
															mendukung: e.target.value,
														});
													}}
												/>
												<span className="label-text">Tidak Mendukung</span>
											</label>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-mendukung"
													className="radio checked:bg-red-500"
													value={"Mendukung Kandidat Lain"}
													checked={data.mendukung.includes(
														"Mendukung Kandidat Lain",
													)}
													onChange={(e) => {
														setData({
															...data,
															mendukung: e.target.value,
														});
													}}
												/>
												<div className="flex gap-2 items-center">
													<span className="label-text whitespace-nowrap">
														Mendukung Kandidat Lain
													</span>
													<input
														type="text"
														placeholder="-"
														value={formatValuePilihanLainya(
															data.mendukung,
															"Mendukung Kandidat Lain",
														)}
														className="input input-ghost w-full max-w-xs input-sm"
														style={{ borderBottom: "1px solid #333" }}
														onChange={(e) => {
															let value = e.target.value.replace(
																"Mendukung Kandidat Lain : ",
																"",
															);
															setData({
																...data,
																mendukung: "Mendukung Kandidat Lain : " + value,
															});
														}}
													/>
												</div>
											</label>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-mendukung"
													className="radio checked:bg-red-500"
													value={"Belum Memutuskan"}
													checked={data.mendukung === "Belum Memutuskan"}
													onChange={(e) => {
														setData({
															...data,
															mendukung: e.target.value,
														});
													}}
												/>
												<span className="label-text">Belum Memutuskan</span>
											</label>
										</div>

										<p className="italic text-xs">
											(Jika menjawab A, maka No.3 Tidak Ditanyakan)
										</p>
									</div>
								</div>
							</li>
							<li className="flex gap-2">
								<span>3. </span>
								<div>
									Apakah Bapak/Ibu/Sdr Bersedia mensosialisasikan{" "}
									<strong>{namaCaleg} </strong>
									di Masyarakat?
									{errors[`mensosialisasikan`] && (
										<p className="text-red-500 text-xs italic pb-3">
											{errors[`mensosialisasikan`]}
										</p>
									)}
									<div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-mensosialisasikan"
													className="radio checked:bg-red-500"
													value={"Ya, Aktif"}
													checked={data.mensosialisasikan === "Ya, Aktif"}
													onChange={(e) => {
														setData({
															...data,
															mensosialisasikan: e.target.value,
														});
													}}
												/>
												<span className="label-text">Ya, Aktif</span>
											</label>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-mensosialisasikan"
													className="radio checked:bg-red-500"
													value={"Ya, Tapi Pasif"}
													checked={data.mensosialisasikan === "Ya, Tapi Pasif"}
													onChange={(e) => {
														setData({
															...data,
															mensosialisasikan: e.target.value,
														});
													}}
												/>
												<span className="label-text">Ya, Tapi Pasif</span>
											</label>
										</div>
										<div className="form-control">
											<label className="label cursor-pointer justify-normal gap-2">
												<input
													type="radio"
													name="radio-mensosialisasikan"
													className="radio checked:bg-red-500"
													value={"Tidak Bersedia"}
													checked={data.mensosialisasikan === "Tidak Bersedia"}
													onChange={(e) => {
														setData({
															...data,
															mensosialisasikan: e.target.value,
														});
													}}
												/>
												<span className="label-text">Tidak Bersedia</span>
											</label>
										</div>
									</div>
								</div>
							</li>
						</ul>
						<div className="flex gap-4">
							<div className="w-1/2">
								<FormGroup
									id={`namaRelawan`}
									name={`namaRelawan`}
									label={`Nama Relawan`}
									value={data.namaRelawan}
									onChange={(e) =>
										setData({ ...data, namaRelawan: e.target.value })
									}
									classNameParent="w-full"
									error={errors[`namaRelawan`]}
								/>
							</div>
							<div className="w-1/2">
								<FormGroup
									id={`kontakRelawan`}
									name={`kontakRelawan`}
									label={`Kontak Relawan`}
									value={formatPhone(data.kontakRelawan)}
									onChange={(e) => {
										const input = e.target.value.replace(/\D/g, "");
										setData({ ...data, kontakRelawan: input });
									}}
									classNameParent="w-full"
									error={errors[`kontakRelawan`]}
								/>
							</div>
						</div>
						<div className="flex justify-center">
							<button
								type="submit"
								disabled={loadingAdd}
								className="btn bg-gray-800 hover:bg-gray-700 text-white"
							>
								Tambah
							</button>
						</div>
					</form>
				</div>
			</div>
		</dialog>
	);
}
