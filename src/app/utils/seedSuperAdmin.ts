/* eslint-disable no-console */
import { envVariables } from "../config/env";
import { User } from "../modules/user/user.model";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVariables.SUPER_ADMIN_MAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super Admin Already Exist!");
      return;
    }

    console.log("Trying to create super admin!");

    const authSuperAdmin: IAuthProvider = {
      provider: "credentials",
      providerId: envVariables.SUPER_ADMIN_MAIL,
    };

    const hashPassword = await bcrypt.hash(
      envVariables.SUPER_ADMIN_PASS,
      Number(envVariables.BCRYPT_SALT_ROUND)
    );

    const superAdminPayload: IUser = {
      name: envVariables.SUPER_ADMIN_NAME,
      email: envVariables.SUPER_ADMIN_MAIL,
      password: hashPassword,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      auths: [authSuperAdmin],
    };

    const superAdmin = await User.create(superAdminPayload);
    console.log("Creating super admin is done!");
    return superAdmin;
  } catch (error) {
    console.log(error);
  }
};
