import { IGenericErrorResponse } from "../interfaces/error.types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const validationError = (err: any): IGenericErrorResponse => {
  const errorSources: any = [];
  const errors = Object.values(err.errors);
  errors.forEach((errObj: any) =>
    errorSources.push({
      path: errObj.path,
      message: errObj.message,
      enumValues: errObj?.properties?.enumValues,
    })
  );
  return {
    statusCode: 400,
    message: "Validation Error!",
    errorSources,
  };
};
