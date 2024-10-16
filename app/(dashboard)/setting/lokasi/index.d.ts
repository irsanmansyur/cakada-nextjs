export type TLokasi = {
  id: number;
  position: {
    lat: number;
    lng: number;
  };
  radius: number;
  namaTempat: string;
};
