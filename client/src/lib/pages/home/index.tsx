import { Box } from "@chakra-ui/react";

import CTASection from "lib/components/samples/CTASection";
import SomeImage from "lib/components/samples/SomeImage";
import SomeText from "lib/components/samples/SomeText";
import WebSocketWrapper from "lib/components/util/WebSocketWrapper";

const Home = () => {
  return (
    <Box>
      <WebSocketWrapper />
      {/* <SomeImage />

      <Box>
        <SomeText />
        <CTASection />
      </Box> */}
    </Box>
  );
};

export default Home;
