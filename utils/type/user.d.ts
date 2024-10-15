import { TToko } from "./kecamatan";

export interface TUser {
  id: number;
  username: string;
  email: string;
  name: string;
  gender: string;
  password: string;
  status: TUserStatus;
  image: string;
  roleId: number;
  relawan: TUserRelawan;
  role: Role;
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

export type TUserRelawan = TUser & {
  nik: string;
  dusun: string;
  noTelp: string;
  kabKode: number;
  kabName: string;
  kecKode: number;
  kecName: string;
  kelKode: number;
  kelName: string;
  dusun: string;
  target: number;
  kontak: string;
};

export type TPayloadUser = TUser & {
  relawan: TUserRelawan;
  role: Role;
  exp: number;
};

export type TRole = {
  id: number;
  name: ERole;
};

export enum ERole {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  REL_KAB = "relawan kabupaten",
  REL_KEC = "relawan kecamatan",
  REL_KEL = "relawan kelurahan",
}
