import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mind Map IA - Interactive Mind Mapping",
  description: "Create beautiful, interactive mind maps with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
