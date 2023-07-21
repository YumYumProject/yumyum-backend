import { Request, Response } from "express";
import UserRepository from "../repositories/test";
import { hashPassword } from "../utils/bcrypt";
import { IUserRepository } from "../repositories";
import { IUserHandler } from ".";

export function newUserHandler(repo: IUserRepository): IUserHandler {
  return new UserHandler();
}

class UserHandler implements IUserHandler {
  private userRepository = new UserRepository();

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password, display_name } = req.body;

      const existingUser = await this.userRepository.findByUsername(username);
      if (existingUser) {
        res.status(400).json({ message: "username has been activated" });
        return;
      }

      const newUser = await this.userRepository.createUser({
        username,
        display_name,
        password: hashPassword,
      });

      res.status(201).json({ message: "successful registration" });
    } catch (error) {
      console.error("there was an error registering:", error);
      res.status(500).json({ message: "there was an error registering" });
    }
  }
}

export default UserHandler;
