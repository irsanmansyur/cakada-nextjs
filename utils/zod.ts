export interface ValidationError {
  [key: string]: string;
}

export const parseErrors = <T extends ValidationError>(response: any): T => {
  const errArr = {} as T;

  if (response.error && Array.isArray(response.error.errors)) {
    const { errors: err } = response.error;
    for (let i = 0; i < err.length; i++) {
      const key = err[i].path[0];
      const message = err[i].message;
      (errArr as any)[key] = message;
    }
  }

  return errArr;
};
