import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "JanAwaaz",
  description: "AI-powered platform to transform citizen feedback into actionable infrastructure development insights.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased`}>

      <body className="min-h-full flex flex-col">{children}</body>

    </html>
  );
}
