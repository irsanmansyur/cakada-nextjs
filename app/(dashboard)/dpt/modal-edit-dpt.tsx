import { KecamatanSelect2024 } from "@/components/kecamatans/s";
import { KelurahanSelect2024 } from "@/components/kelurahan/select-kelurahan";
import { TDpt } from "@/utils/type/dpt";
import { TKecamatan, TKelurahan } from "@/utils/type/kecamatan";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import useAxios from "axios-hooks";
import { useState } from "react";

type DptAddModalProps = {
  kabKode: number;
  dpt: TDpt;
  onSucces?: (dptNew: TDpt) => void;
};
export function DptEditModal({
  kabKode,
  dpt,
  onSucces = (dptNew: TDpt) => dptNew,
}: DptAddModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    ...dpt,
    jenisKelamin: dpt.jenisKelamin,
    tempatLahir: dpt.alamat,
  });
  const [kecamatan, setKecamatan] = useState<
    | TKecamatan
    | {
        value: number;
        label: string;
      }
    | null
  >({
    value: dpt.idKec,
    label: dpt.namaKec,
  });
  const [kelurahan, setKelurahan] = useState<
    | TKelurahan
    | {
        value: number;
        label: string;
      }
    | null
  >({
    value: dpt.idKel,
    label: dpt.namaKel,
  });
  const [{ loading }, postDpt] = useAxios(
    {
      url:
        process.env.NEXT_PUBLIC_DOMAIN +
        `/api/dpt/edit/${kabKode}/${dpt.idDpt}`,
      method: "PUT",
    },
    { manual: true },
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || !kecamatan || !kelurahan) return;
    const dptNew = {
      ...data,
      idKec: kecamatan.value,
      idKel: kelurahan.value,
    };
    postDpt({ data: dptNew })
      .then((res) => {
        if (res.status < 300) {
          onSucces(res.data["data"]);
          setIsOpen(false);
        }
      })
      .catch(({ response }) => {});
  };

  return (
    <>
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
            <DialogTitle className="font-bold">EDIT DPT</DialogTitle>
            <Description>
              Edit data DPT jika tidak ada data yang sesuai.
            </Description>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="flex gap-3 flex-col md:flex-row">
                <div className="w-full">
                  <label>Pilih Kecamatan</label>
                  <KecamatanSelect2024
                    kabId={kabKode}
                    onChange={(kec) => {
                      setKecamatan(kec);
                      setKelurahan(null);
                    }}
                    kecamatan={kecamatan}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-3 flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                  <label>Pilih Kelurahan</label>
                  <KelurahanSelect2024
                    kecId={kecamatan?.value}
                    kelurahan={kelurahan}
                    kabId={kabKode}
                    onChange={(kel) => {
                      setKelurahan(kel);
                    }}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label htmlFor="namaTps">Pilih TPS</label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="namaTps"
                    type="text"
                    value={data.namaTps}
                    onChange={(e) =>
                      setData({ ...data, namaTps: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mb-4 md:flex md:justify-between gap-3">
                <div className="w-full md:w-1/2">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="name"
                  >
                    Nama
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Nama"
                    value={data.nama}
                    onChange={(e) => setData({ ...data, nama: e.target.value })}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="nik"
                  >
                    NIK
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="nik"
                    type="text"
                    placeholder="73xxxx"
                    max={16}
                    value={data.nik + ""}
                    onChange={(e) => setData({ ...data, nik: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-4 md:flex md:justify-between gap-3">
                <div className="w-full md:w-1/2">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="rt"
                  >
                    RT
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="rt"
                    type="text"
                    placeholder="001"
                    value={data.rt}
                    onChange={(e) => setData({ ...data, rt: e.target.value })}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="rw"
                  >
                    RW
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="rw"
                    type="text"
                    placeholder="00"
                    max={16}
                    value={data.rw}
                    onChange={(e) => setData({ ...data, rw: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-4 md:flex md:justify-between gap-3">
                <div className="w-full md:w-1/2">
                  <label
                    className="block mb-2 text-sm font-bold text-gray-700"
                    htmlFor="tempatLahir"
                  >
                    Tempat Lahir
                  </label>
                  <input
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    id="tempatLahir"
                    type="text"
                    value={data.tempatLahir}
                    onChange={(e) =>
                      setData({ ...data, tempatLahir: e.target.value })
                    }
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label
                    htmlFor="jenisKl"
                    className="block mb-2 text-sm font-bold text-gray-700"
                  >
                    Jenis Kelamin
                  </label>
                  <select
                    id="jenisKl"
                    defaultValue={data["jenisKelamin"]}
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    value={data.jenisKelamin}
                    onChange={(e) =>
                      setData({
                        ...data,
                        jenisKelamin: e.target.value as "P" | "L",
                      })
                    }
                  >
                    <option value="" disabled>
                      Pilih
                    </option>
                    <option value="P">Perempuan</option>
                    <option value="L">Laki Laki</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
