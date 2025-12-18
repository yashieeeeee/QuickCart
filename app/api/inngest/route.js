import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";
import { helloWorld, syncUserCreation, syncUserDeletion, syncUserUpdation, } from "@/config/inngest";
import { createUserOrder } from "@/config/inngest";


export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
        syncUserCreation, syncUserUpdation, syncUserDeletion, createUserOrder
    ],
});
