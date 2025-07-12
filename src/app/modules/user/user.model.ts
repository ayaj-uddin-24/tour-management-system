import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

// Auth Provider Schema
const authProvider = new Schema<IAuthProvider>({
  provider: { type: String, required: true },
  providerid: { type: String, required: true },
});

// User Schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: {
      type: String,
      enum: Object.keys(Role),
      default: Role.USER,
    },
    isActive: {
      type: String,
      enum: Object.keys(IsActive),
      default: IsActive.ACTIVE,
    },
    auths: [authProvider],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model("User", userSchema);
