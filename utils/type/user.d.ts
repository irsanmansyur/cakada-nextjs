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
  tokos: TToko[];
  deletedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}
