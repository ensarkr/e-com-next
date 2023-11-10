// * almost all functions or http requests uses this type

export type doubleReturn<T> =
  | {
      status: false;
      message: string;
    }
  | {
      status: true;
      value: T;
    };
