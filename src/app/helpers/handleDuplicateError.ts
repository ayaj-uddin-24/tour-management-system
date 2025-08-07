/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGenericErrorResponse } from "../interfaces/error.types";

export const duplicateError = (err: any): IGenericErrorResponse => {
  const matchedArray = err.message.match(/"([^"]*)"/);
  return {
    statusCode: 401,
    message: `${matchedArray[1]} already exist!`,
  };
};
