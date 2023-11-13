import { User } from "@prisma/client";
import { DaoClass } from "../../core/dao";
import { IResponse } from "../../models/Result";
import { HttpStatusCode } from "../../core/statusCodes";


export class UserDao extends DaoClass<User> {

  constructor(client: any) {
    super(client);
  }

  public async signIn(email: string, password: string):  Promise<IResponse> {

     const  user:  User  =  await  this.client.findUnique({where: {email: email}});

     if(!user){
        const result: IResponse = {
            error: true,
            status: HttpStatusCode.NO_CONTENT,
            message: 'No  user  with  this email id',
          };
          return result;
     }

    
     

     const result: IResponse = {
        error: false,
        status: HttpStatusCode.OK,
        message: "Found!",
        result: user,
        
      };
      return result;
    
  }
}
