import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVariables } from "../config/env";

export const generateToken = (jwtPayload: JwtPayload) => {
  const token = jwt.sign(jwtPayload, envVariables.JWT_SECRET, {
    expiresIn: envVariables.JWT_EXPIRES,
  } as SignOptions);

  return token;
};

export const verifyToken = (token: string) => {
  const verifiedToken = jwt.verify(token, envVariables.JWT_SECRET);
  return verifiedToken;
};
