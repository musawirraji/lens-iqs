import type { Metadata } from "next";
import "./globals.scss";

// Google Fonts: Newsreader (serif heads + body), IBM Plex Sans (UI),
// IBM Plex Mono (scores). Loaded via <link> in <head> so the same
// stylesheet works in both server and client components.
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..800;1,6..72,300..800&family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap";

export const metadata: Metadata = {
  title: "Lens — Intelligence Quality Score",
  description:
    "Credibility infrastructure for the news economy. Score any article on 10 dimensions of editorial quality.",
  themeColor: "#0A1628",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_HREF} />
      </head>
      <body>{children}</body>
    </html>
  );
}
