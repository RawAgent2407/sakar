import type { Metadata } from "next";
import { Nunito_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: 'swap',
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "The Real Estate Universe",
  description: "The Real Estate Universe - Unlock the value of your dreams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/faviconn.png" type="image/png" />
      </head>
      <body
        className={`${nunitoSans.variable} ${bricolageGrotesque.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
