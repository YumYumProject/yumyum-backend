import { Document } from "mongoose";
// import { QueryResult } from "../paginate/paginate";
// import { AccessAndRefreshTokens } from "../token/token.interfaces";

export interface IUser extends Document {
  username: string;
  password: string;
  display_name: string;
  healthy_concern: Enumerator;
  food_allergen: string;
}

// export interface IUserDoc extends IUser, Document {
//   isPasswordMatch(password: string): Promise<boolean>;
// }

// export interface IUserModel extends Model<IUserDoc> {
//   isEmailTaken(
//     email: string,
//     excludeUserId?: mongoose.Types.ObjectId
//   ): Promise<boolean>;
//   paginate(
//     filter: Record<string, any>,
//     options: Record<string, any>
//   ): Promise<QueryResult>;
// }

// export type UpdateUserBody = Partial<IUser>;

// export type NewRegisteredUser = Omit<IUser, "role" | "isEmailVerified">;

// export type NewCreatedUser = Omit<IUser, "isEmailVerified">;

// export interface IUserWithTokens {
//   user: IUserDoc;
//   tokens: AccessAndRefreshTokens;
// }
