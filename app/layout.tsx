import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tovs Kavo World",
  description: "Your little world. Your big imagination. A private playful dollhouse adventure.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
