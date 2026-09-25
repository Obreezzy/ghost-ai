import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Real-time collaborative system design workspace",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorBackground: "hsl(var(--background))",
          colorForeground: "hsl(var(--foreground))",
          colorInput: "hsl(var(--input))",
          colorInputForeground: "hsl(var(--foreground))",
          colorMuted: "hsl(var(--muted))",
          colorMutedForeground: "hsl(var(--muted-foreground))",
          colorPrimary: "hsl(var(--primary))",
          colorPrimaryForeground: "hsl(var(--primary-foreground))",
          colorBorder: "hsl(var(--input))",
          colorDanger: "hsl(var(--destructive))",
          colorRing: "hsl(var(--ring))",
          fontFamily:
            "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      >
        <body className="min-h-full bg-background text-foreground">{children}</body>
      </html>
    </ClerkProvider>
  );
}