import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SwrProvider } from "@/components/layout/swr-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Daily Tracker",
  description: "Personal GATE 2027, DSA, skills, fitness and projects tracker",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SwrProvider>
          <TooltipProvider delay={150}>
            {children}
            <Toaster richColors position="bottom-right" theme="dark" />
          </TooltipProvider>
        </SwrProvider>
      </body>
    </html>
  );
}
