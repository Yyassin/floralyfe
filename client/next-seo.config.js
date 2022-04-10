/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: "floralyfe",
  titleTemplate: "%s | Plant Monitor",
  defaultTitle: "floralyfe",
  description: "Remote plant monitoring system.",
  canonical: "https://floralyfe.sznm.dev",
  openGraph: {
    url: "https://floralyfe.sznm.dev",
    title: "nextarter-chakra",
    description: "Next.js + chakra-ui + TypeScript template",
    images: [
      {
        url: "https://raw.githubusercontent.com/AbdallaAbdelhadi/SYSC3010W22_L3_G5/main/assets/logo.png?token=GHSAT0AAAAAABS52LN4O6F6YJE35EZDLSYEYSOE2PA",
        alt: "floralyfe.sznm.dev og-image",
      },
    ],
    site_name: "floralyfe",
  },
  twitter: {
    handle: "@floralyfe",
    cardType: "summary_large_image",
  },
};

export default defaultSEOConfig;
