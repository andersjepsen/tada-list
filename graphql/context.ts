import type { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

export type Context = {
  prisma: PrismaClient;
  user?: { [key: string]: any };
};

interface ContextProps {
  user?: { [key: string]: any };
}

export function createContext(props: ContextProps) {
  return async function context(): Promise<Context> {
    return {
      prisma,
      ...props,
    };
  };
}
