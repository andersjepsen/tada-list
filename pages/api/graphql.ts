import { getSession } from "@auth0/nextjs-auth0";
import { ApolloServer } from "apollo-server-micro";
import Cors from "micro-cors";
import { buildContext, createContext } from "../../graphql/context";
import { schema } from "../../graphql/schema";

const cors = Cors();

export default cors(async function handler(req, res) {
  const session = getSession(req, res);

  const apolloServer = new ApolloServer({
    schema: schema,
    context: ({ req, res }) => buildContext({ req, res, session }),
    // context: ({ req, res }) => {
    //   return {
    //     prisma,
    //     user: session?.user,
    //     accessToken: session?.accessToken ?? req.headers.authorization,
    //   };
    // },
  });

  const startServer = apolloServer.start();
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;

  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
