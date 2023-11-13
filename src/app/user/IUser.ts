//Elysia Model

import { Elysia, t } from "elysia";

//Objects

const SignIn = t.Object({
  email: t.String({ format: "email" }),
  password: t.String(),
  name: t.Optional(t.String()),
});

const ChangePassword = t.Object({
  oldPassword: t.String(),
  newPassword: t.String(),
});

const UserResponseData = t.Object({
  id: t.String(),
  email: t.String({ format: "email" }),
  name: t.String(),
  password: t.String(),
  role: t.Enum({
    USER: "USER",
    ADMIN: "ADMIN",
  }),
  posts: t.Array(t.Any()),
  createdAt: t.String({ format: "date-time" }),
  updatedAt: t.String({ format: "date-time" }),
});

const  ResponseObject =  t.Object({
  status:t.Number(),
  error: t.Boolean(),
  result: UserResponseData,
  message: t.String(),
  total: t.Optional(t.Number())
});


//types

export type ISignIn = (typeof SignIn)["static"];
export type IChangePassword = (typeof ChangePassword)["static"];

//models
export const UserAuthModel = new Elysia().model({
  sign: SignIn,
  changePassword: ChangePassword,
  response: ResponseObject
});
