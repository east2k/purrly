import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { ClerkProvider, Show, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import TabNav from "@/app/_components/TabNav";
import Footer from "@/app/_components/Footer";
import UserMenu from "@/app/_components/UserMenu";
import { IdentityPreferenceProvider } from "@/app/_context/IdentityPreferenceContext";
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
    <ClerkProvider>
        <html suppressHydrationWarning lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
            <body className="bg-sand-50 text-sand-900 font-body antialiased min-h-screen">
                <IdentityPreferenceProvider>
                <div className="max-w-160 mx-auto px-4 pb-24">
                    <header className="relative text-center py-8">
                        <div className="flex items-center justify-center gap-3 mb-1">
                            <Image src="/logo.png" alt="Purrly logo" width={48} height={48} priority />
                            <h1 className="font-display font-bold text-[32px] tracking-tight text-sand-900">
                                purr<span className="text-terracotta-400">ly</span>
                            </h1>
                        </div>
                        <p className="text-sm text-sand-600 font-light">
                            curl up. let it out. take care of you.
                        </p>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <Show when="signed-in">
                                <UserMenu />
                            </Show>
                            <Show when="signed-out">
                                <SignInButton mode="modal">
                                    <button className="text-sm font-medium text-terracotta-400 hover:text-terracotta-500 transition-colors cursor-pointer">
                                        Sign in
                                    </button>
                                </SignInButton>
                            </Show>
                        </div>
                    </header>
                    <TabNav />
                    {children}
                    <Footer />
                </div>
                </IdentityPreferenceProvider>
            </body>
        </html>
    </ClerkProvider>
);

export default RootLayout;
