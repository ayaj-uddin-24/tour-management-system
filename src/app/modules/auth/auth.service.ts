/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../error/AppError";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVariables } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// User login
// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { password, email } = payload;

//   const isUserExist = await User.findOne({ email });
//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
//   }

//   const isPasswordMatch = await bcrypt.compare(
//     password as string,
//     isUserExist.password as string
//   );
//   if (!isPasswordMatch) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password!");
//   }

//   const userTokens = createUserTokens(isUserExist);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: pass, ...rest } = isUserExist.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     data: rest,
//   };
// };

// Create new access token
const getNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVariables.JWT_REFRESH_SECRET
  ) as JwtPayload;
  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }

  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVariables.JWT_ACCESS_SECRET,
    envVariables.JWT_ACCESS_EXPIRES
  );

  return { accessToken };
};

// Reset the password
const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.userId);

  const isPasswordMatch = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password doesn't mathch");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVariables.BCRYPT_SALT_ROUND)
  );

  user?.save();
};

export const authServices = {
  getNewAccessToken,
  resetPassword,
};
