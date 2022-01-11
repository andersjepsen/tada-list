import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import { SidebarLayout } from "../layouts/SidebarLayout";
import client from "../lib/apollo";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>🎉 Tada List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SidebarLayout>
        <Component {...pageProps} />
      </SidebarLayout>
    </ApolloProvider>
  );
}

export default MyApp;
