import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@auth0/nextjs-auth0";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { SidebarLayout } from "../layouts/SidebarLayout";
import client from "../lib/apollo";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApolloProvider client={client}>
        <Head>
          <title>🎉 Tada List</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <SidebarLayout>
          <Component {...pageProps} />
        </SidebarLayout>
      </ApolloProvider>
    </UserProvider>
  );
}

export default MyApp;
