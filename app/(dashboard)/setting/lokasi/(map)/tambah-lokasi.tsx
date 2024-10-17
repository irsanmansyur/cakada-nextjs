import ErrorInput from "@/components/form/error";
import { MdiRefresh } from "@/components/icons/MdiRefresh";
import { ValidationError } from "@/utils/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import Swal from "sweetalert2";
import { z } from "zod";
import L from "leaflet";

const MapWithDraggableMarker = ({
	position,
}: {
	position: { lat: number; lng: number };
}) => {
	const customIcon = L.icon({
		iconUrl: "/marker-icon.png", // Path ke ikon kustom
		iconSize: [38, 40], // Ukuran ikon (lebar, tinggi)
		iconAnchor: [19, 38], // Titik penempatan (biasanya setengah dari ukuran)
		popupAnchor: [0, -38], // Lokasi popup saat marker diklik
	});
	const router = useRouter();
	const [markerPosition, setMarkerPosition] = useState(position);
	const [radius, setRadius] = useState(100);
	const [loading, setLoading] = useState(false);
	const [namaTempat, setNamaTempat] = useState("");
	const [errors, setErrors] = useState<ValidationError>({});

	// Fungsi untuk mengupdate posisi marker saat digeser
	const updateMarkerPosition = (e: any) => {
		setMarkerPosition(e.target.getLatLng()); // Update lokasi marker
	};

	// Fungsi untuk mengupdate radius saat pengguna mengubah radius (misal melalui input)
	const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event) setRadius(Number(event.target.value)); // Update radius berdasarkan input
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const data = { position: markerPosition, radius, namaTempat };
		const lokasiSchema = z.object({
			namaTempat: z.string().min(3, { message: "nama Tempat harus diisi" }),
			radius: z.number().min(1, { message: "Radius tidak boleh kosong" }),
		});
		setErrors({});

		const { error } = lokasiSchema.safeParse(data);
		if (error) {
			return setErrors(
				error.errors.reduce((acc, cur) => {
					acc[cur.path[0]] = cur.message;
					return acc;
				}, {} as ValidationError),
			);
		}

		axios
			.post("/api/lokasi", data)
			.then(() => {
				Swal.fire({
					icon: "success",
					title: "Berhasil",
					text: "Input Lokasi Sukses",
				}).then(() => {
					router.back();
				});
			})
			.finally(() => setLoading(false))
			.catch((e) => {
				if (e.response.data?.errors) return setErrors(e.response.data.errors);
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Something went wrong!",
				});
			});
	};
	return (
		<>
			<MapContainer
				center={markerPosition}
				zoom={20}
				className="w-full overflow-hidden"
				style={{ height: "500px", width: "100%" }}
			>
				{/* Tile layer untuk peta */}
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
				/>

				{/* Marker yang bisa digeser (draggable) */}
				<Marker
					position={markerPosition}
					icon={customIcon}
					draggable={true}
					eventHandlers={{
						dragend: updateMarkerPosition, // Update posisi ketika marker digeser
					}}
				>
					<Popup>Geser marker untuk menentukan lokasi baru.</Popup>
				</Marker>

				{/* Lingkaran dengan radius yang dinamis */}
				<Circle
					center={markerPosition}
					radius={radius}
					pathOptions={{ color: "red", fillColor: "#f03", fillOpacity: 0.5 }}
				>
					<Popup>Radius {radius} meter dari lokasi.</Popup>
				</Circle>
			</MapContainer>
			<MdiRefresh
				className="cursor-pointer"
				onClick={() => {
					setMarkerPosition(position);
					router.refresh();
				}}
			/>
			<div className="bg-white border rounded shadow p-4 space-y-4">
				<div className="flex gap-4">
					<div>
						<label className="input input-bordered flex items-center gap-2">
							<span className="text-gray-400">Radius (Meter) : </span>

							<input
								type="number"
								className="grow"
								value={radius}
								onChange={handleRadiusChange}
							/>
						</label>
						<ErrorInput message={errors["radius"]} />
					</div>
					<div>
						<label className="input input-bordered flex items-center gap-2 ">
							<span className="!text-gray-400">Nama Tempat : </span>
							<input
								className="grow"
								placeholder="Input Nama Tempat (Gedung A)"
								value={namaTempat}
								onChange={(e) => {
									setNamaTempat(e.target.value);
								}}
							/>
						</label>
						<ErrorInput message={errors["namaTempat"]} />
					</div>
				</div>
				<form onSubmit={onSubmit}>
					<button disabled={loading} className="btn btn-primary">
						Submit
					</button>
				</form>
			</div>
		</>
	);
};

export default MapWithDraggableMarker;
