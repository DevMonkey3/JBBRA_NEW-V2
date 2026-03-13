import {
  Fira_Code as FontMono,
  Noto_Serif_JP as FontSerifJp,
  Ubuntu as FontSans,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const fontSerifJp = FontSerifJp({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-serif-jp",
  display: "swap",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
