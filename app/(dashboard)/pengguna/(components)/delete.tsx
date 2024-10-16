import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

export default function DeleteRelawan({ userId }: { userId: number }) {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    Swal.fire({
      title: "Hapus Lokasi",
      text: "Apakah Anda yakin ingin menghapus user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        // Panggilan API untuk menghapus lokasi
        try {
          const response = await axios.delete(`/api/user/relawan/${userId}`);
          return response.data;
        } catch (error) {
          Swal.showValidationMessage("Gagal menghapus user, coba lagi!");
          throw error;
        }
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Terhapus!", "Lokasi telah dihapus.", "success").then(
            () => {
              window.location.reload();
            },
          );
        }
      })
      .catch((err) =>
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        }),
      )
      .finally(() => setLoading(false));
  };
  return (
    <form onSubmit={onSubmit}>
      <button
        disabled={loading}
        type="submit"
        className="btn btn-outline btn-danger"
      >
        Delete
      </button>
    </form>
  );
}
