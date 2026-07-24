import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mind Map IA — Posez un thème, la carte se dessine",
  description:
    "Générez une carte mentale complète à partir d'un simple thème grâce à l'IA, ajustez-la en drag & drop et exportez-la en PNG ou PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={bricolage.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
