import { model } from "mongoose";
import {UserSchema} from "../../schemas/users/schema";

export const UserModel = model("User", UserSchema,  process.env.MONGODB_USER_COLLECTION);