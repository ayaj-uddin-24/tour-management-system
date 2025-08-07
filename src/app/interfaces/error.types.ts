export interface IErrorResources {
  path: string;
  message: string;
}

export interface IGenericErrorResponse {
  statusCode: number;
  message: string;
  errorSources?: IErrorResources[];
}
