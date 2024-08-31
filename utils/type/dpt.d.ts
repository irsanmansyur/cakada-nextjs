import { TDtdoor } from "./dtdoor";

export type TDpt = {
  idDpt: number;
  idKec: number;
  idKel: number;
  noTps: number;
  dtdoor: TDtdoor;
  namaKec: string;
  namaKel: string;
  namaTps: string;
  nama: string;
  nik: string | null;
  jenisKelamin: "P" | "L";
  createdAt: string; // or Date, depending on how you plan to use it
  updatedAt: string; // or Date, depending on how you plan to use it
  kelId: number;
  id: number;
  usia: number;
  alamat: string;
  rt: string;
  rw: string;
  hidup: number; // assuming 1 for alive, 0 for deceased
  isKk: boolean;
  dtdoor: string | null;
  gotv: string | null;
};

export type TTipePemilih = {
  id: number;
  nama: string;
};
