import { IGenericErrorResponse } from "../interfaces/error.types";

export const castError = (): IGenericErrorResponse => {
  return {
    statusCode: 400,
    message: "Invalid MongoDB ObjectID!",
  };
};
