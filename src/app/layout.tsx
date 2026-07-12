import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@/presentation/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlashTap",
  description:
    "Jogo de memória e reflexo: memorize a sequência, reproduza no menor tempo possível.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AntdRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
