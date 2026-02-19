import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/telegram",
  method: "POST",
  handler: httpAction(async (_, req) => {
    console.log("Webhook called!");
    return new Response("OK");
  }),
});

export default http;
