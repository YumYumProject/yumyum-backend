import mongoose, { Model, Mongoose } from "mongoose";
// import { IUser } from "../Interfaces/user.interface";
import { userSchema } from "../models/user.model";
import "dotenv/config";
import { IRepositoryUser } from ".";
import { ICreateUser, IUser } from "../Interfaces/user.interface";
// import { ObjectId } from "mongodb";

mongoose.set("strictQuery", true);

mongoose.connect(
  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.58yc13x.mongodb.net/yumyum?retryWrites=true&w=majority`
);

export function newRepositoryUser(db: Mongoose): IRepositoryUser {
  return new RepositoryUser(db);
}
class RepositoryUser implements IRepositoryUser {
  private db: Mongoose;
  private userModel: Model<IUser>;

  constructor(db: Mongoose) {
    this.db = db;
    this.userModel = this.db.model<IUser>("user", userSchema);
  }

  async createUser(user: ICreateUser): Promise<IUser> {
    return await this.userModel
      .create({
        username: user.username,
        password: user.password,
        display_name: user.display_name,
      })
      .catch((err) =>
        Promise.reject(`failed to create user ${user.username}: ${err}`)
      );
    // const newUser = new this.userModel({
    //   username: user.username,
    //   password: user.password,
    //   display_name: user.display_name,
    //   healthy_concern: user.healthy_concern,
    //   food_allergen: user.food_allergen,
    // });
    // newUser.save();
    // console.log("User created successfully");
  }
  async getUser(username: string): Promise<IUser> {
    return await this.userModel.findOne({ username }).then((username) => {
      if (!username) {
        return Promise.reject(`no such user ${username}`);
      }
      return Promise.resolve(username);
    });
  }
  async getDataUserById(id: string): Promise<IUser | null> {
    return await this.userModel.findById(id);
  }
}

// createUser();
