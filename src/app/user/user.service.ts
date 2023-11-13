import { User } from "@prisma/client";
import { Service } from "../../core/service";
import { UserDao } from "./user.dao";
import { IResponse } from "../../models/Result";

export class UserService extends Service<User> {
    dao:  UserDao
  constructor(dao: UserDao) {
    super(dao);
    this.dao =  dao
  }

  public  async signIn(email:  string,  password:string): Promise<IResponse>{
      return this.dao.signIn(email, password)
  }
}
