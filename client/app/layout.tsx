import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "JanAwaaz — Voice of the People",
  description:
    "A multilingual AI platform that aggregates citizen development requests and helps governments build what matters most. Amplifying citizen voices for infrastructure development across BRICS nations.",
  openGraph: {
    title: "JanAwaaz — Voice of the People",
    description:
      "A multilingual AI platform that aggregates citizen development requests and helps governments build what matters most.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans text-black bg-white">
        {children}
      </body>
    </html>
  );
}
