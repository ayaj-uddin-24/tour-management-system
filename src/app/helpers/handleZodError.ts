import { IGenericErrorResponse } from "../interfaces/error.types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const zodError = (err: any): IGenericErrorResponse => {
  const errorSources: any = [];
  const errors = Object.values(err.issues);
  errors.forEach((errObj: any) =>
    errorSources.push({
      path: errObj.path[0],
      message: errObj.message,
    })
  );

  return {
    statusCode: 400,
    message: "Zod Error",
    errorSources
  };
};
