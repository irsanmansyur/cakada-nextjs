import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { TLokasi } from "..";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function Rended({ lokasi }: { lokasi: TLokasi[] }) {
  const [lokasiList, setLokasiList] = useState(lokasi);
  const customIcon = L.icon({
    iconUrl: "/marker-icon.png", // Path ke ikon kustom
    iconSize: [38, 38], // Ukuran ikon (lebar, tinggi)
    iconAnchor: [19, 38], // Titik penempatan (biasanya setengah dari ukuran)
    popupAnchor: [0, -38], // Lokasi popup saat marker diklik
  });

  const handleDeleteLocation = (id: number) => {
    Swal.fire({
      title: "Hapus Lokasi",
      text: "Apakah Anda yakin ingin menghapus lokasi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        // Panggilan API untuk menghapus lokasi
        try {
          const response = await axios.delete(`/api/lokasi/${id}`);
          return response.data;
        } catch (error) {
          Swal.showValidationMessage("Gagal menghapus lokasi, coba lagi!");
          throw error;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Jika konfirmasi berhasil
        const filteredLokasi = lokasiList.filter(
          (location) => location.id !== id,
        );
        setLokasiList(filteredLokasi);
        Swal.fire("Terhapus!", "Lokasi telah dihapus.", "success");
      }
    });
  };

  return (
    <MapContainer
      center={lokasiList[0].position}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      {lokasiList.map((d, i) => {
        return (
          <div key={i}>
            {/* Menambahkan layer tile menggunakan OpenStreetMap */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            {/* Menambahkan Marker di position */}
            <Marker position={d.position} icon={customIcon}>
              <Popup className="block">
                Lokasi : {d.namaTempat}
                <div>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDeleteLocation(d.id)}
                  >
                    Hapus Lokasi
                  </button>
                </div>
              </Popup>
            </Marker>
            {/* Menambahkan Circle dengan radius di sekitar position */}
            <Circle
              center={d.position}
              radius={d.radius}
              pathOptions={{
                color: "red",
                fillColor: "#f03",
                fillOpacity: 0.2,
              }}
            >
              <Popup>Radius {d.radius} meter dari lokasi.</Popup>
            </Circle>
          </div>
        );
      })}
    </MapContainer>
  );
}
