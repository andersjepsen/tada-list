import type { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";

export type Context = {
  prisma: PrismaClient;
  user?: { [key: string]: any };
  accessToken?: string;
};

interface ContextProps {
  user?: { [key: string]: any };
  accessToken?: string;
}

export function createContext(props: ContextProps) {
  return async function context(): Promise<Context> {
    return {
      prisma,
      ...props,
    };
  };
}

const client = jwksClient({
  jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, function (error, key) {
    const publicKey = key.getPublicKey();

    console.log({ publicKey });

    callback(null, publicKey);
  });
}

export async function buildContext({ req, res, session }): Promise<Context> {
  const accessToken = session?.accessToken ?? req.headers.authorization;

  console.log({ accessToken });

  const authResult = new Promise((resolve, reject) => {
    jwt.verify(
      accessToken,
      getKey,
      {
        audience: "https://andersjepsen.eu.auth0.com/api/v2/",
        issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,
        algorithms: ["RS256"],
      },
      (error, decoded) => {
        console.log({ error, decoded });
        if (error) {
          reject({ error });
        }
        if (decoded) {
          resolve(decoded);
        }
      }
    );
  });

  return {
    prisma,
    user: session?.user,
    accessToken,
  };
}
