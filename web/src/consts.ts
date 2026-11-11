export const SITE_TITLE = "Public repo hub";
export const SITE_DESCRIPTION =
  "Public learning tools and admin references — hub and AB-650 study portal.";

export const GITHUB_URL = "https://github.com/gryteklut/Public_repo";

export const SITE_METADATA = {
  title: {
    default: "Public repo hub",
    template: "%s | Public repo",
  },
  description:
    "Static GitHub Pages hub for learning tools. Includes the AB-650 study portal.",
  keywords: [
    "AB-650",
    "Microsoft 365",
    "Copilot",
    "study portal",
    "Astro",
    "GitHub Pages",
  ],
  authors: [{ name: "gryteklut" }],
  creator: "gryteklut",
  publisher: "gryteklut",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "48x48" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: [{ url: "/favicon/favicon.ico" }],
  },
  openGraph: {
    title: "Public repo hub",
    description:
      "Static GitHub Pages hub for learning tools. Includes the AB-650 study portal.",
    siteName: "Public repo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Public repo hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Public repo hub",
    description:
      "Static GitHub Pages hub for learning tools. Includes the AB-650 study portal.",
    images: ["/og-image.jpg"],
    creator: "@gryteklut",
  },
};
