import { Elysia, t } from "elysia";
import { UserAuthModel } from "./IUser";
import { UserService } from "./user.service";
import { auth } from "../../auth/lucia";

export function userController(app: Elysia, service: UserService) {
  return app.group("/user", (app) => {
    return (
      app
        .use(UserAuthModel)

        //User get
        .get(
          "",
          async ({ query }) => {
            console.log("query", query);
            return await service.getMany(query);
          },
          {
            detail: {
              tags: ["User"],
            },
          }
        )
        .post(
          "",
          async ({ body }) => {
            return await service.create(body);
          },
          {
            detail: {
              tags: ["User"],
            },
            body: "sign",
          }
        )
        .get(
          "/:id",
          async ({ params: { id } }) => {
            const user = await service.getOne(id);
            return user;
          },
          {
            detail: {
              tags: ["User"],
            },
            params: t.Object({
              id: t.String(),
            }),
          }
        )
        .put("/:id", () => {}, {
          detail: {
            tags: ["User"],
          },
        })
        .post(
          "/signup",
          async({body}) => {
            
          },
          {
            body: "sign",
            detail: {
              tags: ["User"],
            },
          }
        )
        .post(
          "/signin",
          async ({ body }) => {
            return await service.signIn(body.email, body?.password);
          },
          {
            body: "sign",
            detail: {
              tags: ["User"],
            },
          }
        )
    );
  });
}
