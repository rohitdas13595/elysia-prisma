import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { prisma } from "./db/prisma";
import { cors } from "@elysiajs/cors";
import { userController } from "./app/user/user.controller";
import { UserDao } from "./app/user/user.dao";
import { UserService } from "./app/user/user.service";

const app = new Elysia();
app.use(cors());

app.use(
  swagger({
   path: '/docs',
    documentation: {
      info: {
        title: "Learning Elysia",
        version: "0.0.1",
      },
      tags: [{ name: "App", description: "General  Endpoints" }],
    },
  })
);


app.get(
  "/",
  async () => {
    const users = await prisma.user.findMany();
    return users;
  },
  {
    detail: {
      tags: ["App"],
    },
    
  }
);


const  userDao  =  new  UserDao(prisma.user);
const  userService =  new  UserService(userDao)






app.use(userController(app, userService))

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
