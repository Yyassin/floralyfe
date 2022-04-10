/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";

import { ToastContainer } from "react-toastify";
import defaultSEOConfig from "../../next-seo.config";
import Layout from "lib/components/layout";
import customTheme from "lib/styles/customTheme";
import "lib/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "lib/components/util/apolloClient";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={customTheme}>
      <ApolloProvider client={client}>
        <ToastContainer />
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <DefaultSeo {...defaultSEOConfig} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </ChakraProvider>
  );
};

export default MyApp;
