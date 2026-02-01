import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "장바구니 - 신혼 가전",
  description: "신혼 가전 장바구니 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
