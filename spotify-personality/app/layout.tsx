import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoundSelf",
  description: "Your music personality analyzer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}