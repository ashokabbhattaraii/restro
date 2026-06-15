import type { Metadata } from "next";
import { Lato, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const display = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const body = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Nepali Restaurant & Bar | Sulaymaniyah",
  description:
    "Ultra-premium Nepali, Chinese, Indian cuisine and bar in As Sulaymaniyah, Iraq.",
};

const themeScript = `try{var t=localStorage.getItem("restaurant-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        {/* biome-ignore lint: theme flash prevention requires inline script */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "toast",
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
