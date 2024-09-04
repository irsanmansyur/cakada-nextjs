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
  role: Role;
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

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
