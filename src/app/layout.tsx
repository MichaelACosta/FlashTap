import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@/presentation/theme";
import { ErrorBoundary } from "@/presentation/error-boundary";
import { AnalyticsGate } from "@/presentation/analytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

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
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
        <AntdRegistry>
          <ThemeProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
            <AnalyticsGate />
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
