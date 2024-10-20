import { InputErrorMessage } from "@/components/form/input-error";
import { TKecamatan } from "@/utils/type/kecamatan";
import {
	Description,
	Dialog,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { z } from "zod";

export default function EditKecamatan({
	kecamatan,
	onSuccess,
}: {
	kecamatan: TKecamatan;
	onSuccess: (kec: TKecamatan) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [data, setData] = useState(kecamatan);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const validate = validateSchema(data);
		if (validate !== true) {
			return setErrors(validate);
		}

		setLoading(true);
		Swal.fire({
			title: "Akan ditutup jika berhasil!",
			timerProgressBar: true,
			timer: 10000,
			didOpen: async () => {
				await axios
					.put(`/api/kecamatan/${kecamatan.wilId}`, data)
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
						onSuccess(data);
						Swal.close();
					})
					.finally(() => {
						setLoading(false);
						setIsOpen(false);
					});
			},
		});
	};
	return (
		<form onSubmit={onSubmit}>
			<button
				type="button"
				className="btn btn-outline btm-nav-sm btn-primary flex whitespace-nowrap"
				onClick={() => setIsOpen(!isOpen)}
			>
				EDIT
			</button>
			<Dialog
				open={isOpen}
				onClose={() => setIsOpen(false)}
				className="relative z-50"
			>
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gray-900 bg-opacity-40 backdrop-blur">
					<DialogPanel className="max-w-xl space-y-4 border rounded bg-white p-4 shadow">
						<DialogTitle className="font-bold">EDIT KECAMATAN</DialogTitle>
						<Description>
							Edit data Kecamatan jika tidak ada data yang sesuai.
						</Description>
						<form className="space-y-3" onSubmit={onSubmit}>
							<div className="mb-4 md:flex md:justify-between gap-3">
								<div className="w-full md:w-1/2">
									<div>
										<label
											className="block mb-2 text-sm font-bold text-gray-700"
											htmlFor="namaKec"
										>
											Nama
										</label>
										<input
											className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
											id="namaKec"
											type="text"
											placeholder="Nama"
											value={data.kecNama}
											onChange={(e) =>
												setData({ ...data, kecNama: e.target.value })
											}
										/>
									</div>
									<InputErrorMessage error={errors.kecNama} />
								</div>
								<div className="w-full md:w-1/2">
									<div>
										<label
											className="block mb-2 text-sm font-bold text-gray-700"
											htmlFor="targetKec"
										>
											Nama
										</label>
										<input
											className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
											id="targetKec"
											type="number"
											placeholder="Target"
											value={data.target || 10}
											min={10}
											onChange={(e) =>
												setData({ ...data, target: +e.target.value })
											}
										/>
									</div>
									<InputErrorMessage error={errors.target} />
								</div>
							</div>

							<div className="flex gap-4">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setIsOpen(false)}
								>
									Cancel
								</button>
								<button
									disabled={loading}
									className="btn btn-primary"
									type="submit"
								>
									Submit
								</button>
							</div>
						</form>
					</DialogPanel>
				</div>
			</Dialog>
		</form>
	);
}

function validateSchema(data: { kecNama: string; target: number }) {
	const editKecSchema = z.object({
		target: z.number().int().min(10, { message: "Target harus lebih dari 10" }),
		kecNama: z
			.string({ message: "Harus Isi Nama Kecamatan" })
			.min(1, { message: "Harus Isi Nama Kecamatan" }),
	});
	const { error } = editKecSchema.safeParse(data);
	if (error) {
		return error.errors.reduce((acc: any, error: any) => {
			const [key] = error.path;
			acc[key] = error.message;
			return acc;
		}, {});
	}
	return true;
}
