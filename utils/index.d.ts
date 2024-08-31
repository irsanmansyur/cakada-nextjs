export type PropsPage<T = unknown, E = object> = {
  params: { lang: string } & T;
  searchParams: { page?: string } & E;
};

export type TApi<T = unknown, E = object> = {
  message: string;
  data: T;
} & E;
export type TMeta = {
  total: number;
  limit: number;
  currentPage: number;
  page: number;
  totalPages: number;
  totalPage: number;
};
export type TApiPaginate<T> = TApi<T[]> & {
  meta: TMeta;
};
