import { IResponse } from "../models/Result";
import { DaoClass } from "./dao";



export  class  Service<T> {
    dao: DaoClass<T>

    constructor(dao: DaoClass<T>){
         this.dao  =  dao;
    }

    public async deleteOne(id: string | number): Promise<IResponse>{
        return   await  this.dao.deleteOne(id);
    }

    public async getOne(id: string | number): Promise<IResponse>{
        return  await  this.dao.getOne(id);
    }

    public async updateOne(id: string |  number ,  body: Partial<T>): Promise<IResponse>{
        return  await  this.dao.updateOne(id , body )
    }

    public async create(body: Partial<T>): Promise<IResponse> {
        return  await  this.dao.create(body);
    }

    public async getMany(query: any): Promise<IResponse>{
         return  await this.dao.getMany(query);
    }

     
}