import  {lucia}  from  "lucia";

import  {prisma as  LuciaPrisma} from "@lucia-auth/adapter-prisma";

import  {prisma}  from  '../db/prisma';


export  const auth  =  lucia({
    env: 'DEV',
    adapter: LuciaPrisma(prisma,{
        user: "user",
        key: "key",
        session: "session",
        
    })
});



