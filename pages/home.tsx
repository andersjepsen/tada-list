import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { NextPage } from "next";
import Head from "next/head";
import { SidebarLayout } from "../layouts/SidebarLayout";

export const getServerSideProps = withPageAuthRequired();

const Home: NextPage = () => {
  return (
    <SidebarLayout>
      <main className="flex flex-1 min-h-full items-center justify-center">
        <Head>
          <title>🎉 Tada List</title>
        </Head>

        <h1 className="text-8xl font-bold">🎉🎉🎉</h1>
      </main>
    </SidebarLayout>
  );
};

export default Home;
