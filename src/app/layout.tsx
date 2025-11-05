
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/context/auth-context";
import { LogoIcon } from "@/components/icons/logo-icon";

export const metadata: Metadata = {
  title: "BookIt",
  description: "Book your next amazing experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path fill=%22%232f3e8b%22 d=%22M20,5H80A15,15,0,0,1,95,20V80A15,15,0,0,1,80,95H20A15,15,0,0,1,5,80V20A15,15,0,0,1,20,5ZM50,30A5,5,0,1,0,50,40A5,5,0,0,0,50,30ZM50,50V85%22 stroke=%22%232f3e8b%22 stroke-width=%225%22 fill=%22none%22 stroke-linecap=%22round%22/></svg>" />
      </head>
      <body
        className={cn(
          "font-body antialiased min-h-screen flex flex-col",
        )}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
