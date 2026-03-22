import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    display: "swap",
});

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-dm-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Purrly - curl up. let it out. don't hold back.",
    description: "A cozy, safe-space app to vent and track self-care.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
    <html suppressHydrationWarning lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
        <body className="bg-sand-50 text-sand-900 font-body antialiased min-h-screen">
            {children}
        </body>
    </html>
);

export default RootLayout;
