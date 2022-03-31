import React from "react";
import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box transition="0.5s ease-out">
      <Box>
        <Header />
        <Box as="main" marginY={22}>
          {children}
        </Box>
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default Layout;
