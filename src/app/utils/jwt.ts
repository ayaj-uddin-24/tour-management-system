import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(jwtPayload, secret, { expiresIn } as SignOptions);

  return token;
};

export const verifyToken = (token: string, secret: string) => {
  const verifiedToken = jwt.verify(token, secret);
  return verifiedToken;
};
