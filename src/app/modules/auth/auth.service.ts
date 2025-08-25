/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../error/AppError";
import { IAuthProvider, IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVariables } from "../../config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

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
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password doesn't match");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVariables.BCRYPT_SALT_ROUND)
  );

  user?.save();
};

// Set password
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (
    user.password &&
    user.auths.some((provider) => provider.provider == "google")
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You've already set a password. You can change the password from your profile!"
    );
  }

  const hashPassword = await bcrypt.hash(
    plainPassword,
    Number(envVariables.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };

  const auths: IAuthProvider[] = [...user.auths, authProvider];

  user.password = hashPassword;
  user.auths = auths;

  await user.save();
};

// Forgot password
const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  if (!user.isVerified) {
    throw new AppError(httpStatus.NOT_FOUND, "User is not verified!");
  }

  if (
    user.isActive === IsActive.INACTIVE ||
    user.isActive === IsActive.BLOCKED
  ) {
    throw new AppError(httpStatus.NOT_FOUND, `User is ${user.isActive}`);
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User is deleted!");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };

  const resetToken = await jwt.sign(
    jwtPayload,
    envVariables.JWT_ACCESS_SECRET,
    { expiresIn: "10m" }
  );

  const resetUILink = `${envVariables.FRONTEND_URL}/reset-password/id=${user._id}&token=${resetToken}`;

  sendEmail({
    to: user.email,
    templateName: "forgetPassword",
    subject: "Forget Password",
    templateData: {
      name: user.name,
      resetUILink,
    },
  });
};

export const authServices = {
  getNewAccessToken,
  resetPassword,
  setPassword,
  forgotPassword,
};
