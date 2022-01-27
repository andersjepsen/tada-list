import type { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

type User = { [key: string]: any };

export type Context = {
  prisma: PrismaClient;
  user: User;
};

interface ContextProps {
  user: User;
}

export function createContext(props: ContextProps) {
  return async function context(): Promise<Context> {
    return {
      prisma,
      ...props,
    };
  };
}
