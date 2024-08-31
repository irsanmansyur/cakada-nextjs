import { TTipePemilih } from "./dpt";
import { TPilihanPileg, TProgramBantuan } from "./kabupaten";

export type TDtdoor = {
  id: number;
  nik: string;
  namaLengkap: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  tps: string;
  rt: string;
  rw: string;
  jenisKelamin: string;
  noTelpon: string;
  jumlahWajibPilih: number;
  programBantuan1: string;
  programBantuan2: string;
  programBantuan3: string;
  jenisDtdoor: number;
  jumlahDtdoor: number;
  marchendise: string;
  namaRelawan: string;
  kontakRelawan: string;
  idDpt: string;
  kabId: number;
  kelId: number;
  statusId: number;
  statusDtdoor: string;
  kategoriId: number;
  kepalaKeluarga: string;
  kepalaKeluargaId: number;
  jumlahWajibPilih: number;
  kunjungans: TKunjungan[];
  createdAt: Date;
  updatedAt: Date;
};

export type TKunjungan = {
  id: number;
  image: string;
  tipePemilihId: string;
  noTelponRelawan: string;
  pilihanPilegId: string;
  programBantuanId: string;
  merchendise: string;
  namaRelawan: string;
  kontakRelawan: string;
  tipePemilih: TTipePemilih;
  pilihanPileg: TPilihanPileg;
  position: {
    latitude: number;
    longitude: number;
  };
  programBantuan: TProgramBantuan;
};
