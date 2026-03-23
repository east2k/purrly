import Link from "next/link";

const Footer = () => (
    <footer className="mt-16 pb-8 text-center">
        <div className="flex items-center justify-center gap-1 text-xs text-sand-600">
            <Link href="/resources" className="hover:text-terracotta-400 transition-colors">
                Resources
            </Link>
            <span className="mx-1">·</span>
            <Link href="/privacy" className="hover:text-terracotta-400 transition-colors">
                Privacy Policy
            </Link>
            <span className="mx-1">·</span>
            <Link href="/terms" className="hover:text-terracotta-400 transition-colors">
                Terms of Service
            </Link>
        </div>
        <p className="text-[11px] text-sand-600 mt-2">© {new Date().getFullYear()} Purrly. All rights reserved.</p>
    </footer>
);

export default Footer;
