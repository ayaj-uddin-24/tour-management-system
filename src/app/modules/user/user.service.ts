import { IUser } from "./user.interface";
import { User } from "./user.model";

// Create User Service
const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({ name, email });
  return user;
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

export const userServices = { createUser, getAllUsers };
