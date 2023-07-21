import { Mongoose } from "mongoose";
import userModel from "../models/user.model";
import { IUser } from "../Interfaces/user.interface";
import { IUserRepository } from ".";
import { Db } from "mongodb";

export function newUserRepository(Db: Mongoose): IUserRepository {
  return new UserRepository(Db);
}
class UserRepository implements IUserRepository {
  async findByUsername(username: string): Promise<IUser | null> {
    return userModel.findOne({ username }).exec();
  }
  async createUser(userData: IUser): Promise<IUser> {
    return userModel.create(userData);
  }
}

export default UserRepository;
