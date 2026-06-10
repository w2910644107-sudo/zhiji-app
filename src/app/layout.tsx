import type { Metadata } from "next";
import { MainNav } from "@/components/main-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "知机 | 极简国风命理问事",
  description: "以八字为根，合参天时、岁运与象法，为你断一事之机。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <MainNav />
        <main className="mx-auto min-h-[calc(100vh-64px)] max-w-[1180px] px-5 py-8 sm:py-12">
          {children}
          <footer className="mt-12 border-t border-gold-soft/60 pt-6 text-xs leading-6 text-smoke/70">
            知机所给占断、调局与批文，仅供自我观察与生活参考，不替代个人判断、专业咨询或现实行动验证。
          </footer>
        </main>
      </body>
    </html>
  );
}
