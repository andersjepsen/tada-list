import { useUser } from "@auth0/nextjs-auth0";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user]);

  return (
    <main className="flex flex-1 min-h-full items-center justify-center">
      <Head>
        <title>🎉 Tada List</title>
      </Head>
      <div className="flex flex-col items-center ">
        <h1 className="text-8xl font-bold pb-6">🎉 Tada List</h1>
        <Link href="/api/auth/login" passHref>
          <h2 className="text-xl font-bold border rounded-lg bg-blue-600 text-white px-4 py-1 shadow-sm hover:bg-blue-500 hover:shadow-md cursor-pointer">
            Login
          </h2>
        </Link>
      </div>
    </main>
  );
};

export default Home;
