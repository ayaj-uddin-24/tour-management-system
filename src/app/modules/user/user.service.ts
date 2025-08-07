import AppError from "../../error/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVariables } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// Create User Service
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVariables.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
    auths: [authProvider],
  });
  return user;
};

// Update User
const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User doesn't exist!");
  }

  if (payload.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || Role.GUIDE) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVariables.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });
  return newUpdateUser;
};

// Get All Users Data
const getAllUsers = async () => {
  const data = await User.find();
  const totalUsers = await User.countDocuments();
  return {
    data,
    totalUsers,
  };
};

export const userServices = { createUser, getAllUsers, updateUser };
