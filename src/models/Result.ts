import {Elysia, t}  from  'elysia'
import { type } from 'os';


const  ResponseObject =  t.Object({
    status:t.Number(),
    error: t.Boolean(),
    result: t.Optional(t.Any()),
    message: t.String(),
    total: t.Optional(t.Number())
  });

export type  IResponse  =  (typeof  ResponseObject)['static']



export const  ResultModel = new Elysia().model({
    response:  ResponseObject,
     
  });