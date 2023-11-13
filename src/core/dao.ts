import { IResponse } from "../models/Result";
import { HttpStatusCode } from "./statusCodes";
import * as lodash from "lodash";
import { prisma } from "../db/prisma";

export type DaoType = {
  client: any;
};

export class DaoClass<T> implements DaoType {
  client: any;
  constructor(client:any) {
    this.client = client
  }

  private async parseFilter1(where: any) {
    if (where instanceof Array) {
      where.forEach(() => this.parseFilter1(where));
    }
    Object.keys(where).forEach((key) => {
      if ((where as any)[key] instanceof Array) {
        (where as any)[key] = { in: where[key] };
      }
      if ((where as any)[key] === "true") {
        (where as any)[key] = true;
      }
      if ((where as any)[key] === "false") {
        (where as any)[key] = false;
      }
      if (key.indexOf(".") >= 0) {
        const temp = lodash.set({}, key, (where as any)[key]);
        where = { ...temp, ...where };
        delete (where as any)[key];
      }
    });
    return where;
  }

  public async deleteOne(id: string | number): Promise<IResponse> {
    try {
      const response = await this.client.delete({
        where: { id: String(id) },
      });
      if (response) {
        const result: IResponse = {
          error: false,
          status: HttpStatusCode.OK,
          message: "deleted",
          result: response,
        };
        return result;
        
      }

      const result: IResponse = {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "error in deleting",
      };

      return result;
    } catch (error: any) {
      const result: IResponse = {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "error in creating",
      };

      return result;
    }
  }

  public async getOne(id: string | number): Promise<IResponse> {
    console.log("dao.getOne", id);
    try {
      const response = await this.client.findUnique({
        where: { id: String(id) },
      });
      console.log("here.....", response);
      if (response?.id) {
        const result: IResponse = {
          error: false,
          status: HttpStatusCode.OK,
          message: "Found!",
          result: response,
        };
        return result;
      }

      const result: IResponse = {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "not found",
      };

      return result;
    } catch (error: any) {
      const result: IResponse = {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message,
      };

      return result;
    }
  }

  public async updateOne(id: string |  number ,  body: Partial<T>): Promise<IResponse> {
    try {
      const response = await this.client.update({
        data: body,
        where: { id: String(id) },
      });
      if (response?.id) {
        const result: IResponse = {
          error: false,
          status: HttpStatusCode.OK,
          message: "updated",
          result: response,
        };
        return result;
      }

      const result: IResponse = {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "error in updating",
      };

      return result;
    } catch (error: any) {
      const result: IResponse = {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message,
      };

      return result;
    }
  }

  public async create(body: Partial<T>): Promise<IResponse> {
    try {
      const response = await this.client.create({
        data: body,
      });
      if (response) {
        const result: IResponse = {
          error: false,
          status: HttpStatusCode.CREATED,
          message: "created",
          result: response,
        };
        return result;
      }

      const result: IResponse = {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "error in creating",
      };

      return result;
    } catch (error: any) {
      const result: IResponse = {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message,
      };

      return result;
    }
  }

  public async getMany(query: any): Promise<IResponse> {
    // const { searchParams } = new URL(queryUrl);
    // let query: any = {};
    // const keys = searchParams.keys();
    // let result = keys.next();
    // while (!result.done) {
    //   // console.log(result.value); // 1 3 5 7 9
    //   query[`${result.value}`] = searchParams.get(`${result.value}`);
    //   result = keys.next();
    // }

    let findOptions: any = {};

    //page
    if (query?.page && query?.count) {
      findOptions["take"] = Number(query?.count);
      findOptions["skip"] = (Number(query?.page) - 1) * Number(query?.count);
      delete query.count;
      delete query.page;
    }
    if (!query?.page || !query?.count) {
      if (query.count) {
        delete query.count;
      }
      if (query.page) {
        delete query.page;
      }
    }

    //sort
    if (query?.orderBy && query?.order) {
      let ob: any = {};
      ob[`${query?.orderBy}`] = String(query?.order).toLowerCase();
      findOptions["orderBy"] = ob;
      delete query?.orderBy;
      delete query?.order;
    }

    if (!query?.orderBy || query?.order) {
      if (query?.orderBy) {
        delete query?.orderBy;
      }
      if (query?.order) {
        delete query?.order;
      }
    }
    let wh: any = {};

    findOptions["where"] = await this.parseFilter1(query);

    console.log("findOptions", findOptions);

    try {
      const [data, total] = await prisma.$transaction([
        this.client.findMany(findOptions),
        this.client.count(findOptions),
      ]);
      // const students = await prisma.admin.findMany(findOptions);+
      const result: IResponse = {
        error: false,
        status: HttpStatusCode.OK,
        message: "Found!",
        result: data,
        total: total,
      };
      return result;
    } catch (error: any) {
      const result: IResponse = {
        error: true,
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message,
      };
      return result;
    }
  }
}
