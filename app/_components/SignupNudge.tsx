"use client";

import { SignInButton } from "@clerk/nextjs";

type SignupNudgeProps = {
    message: string;
};

const SignupNudge = ({ message }: SignupNudgeProps) => (
    <div className="text-center py-8 px-6">
        <p className="text-sm text-sand-600 mb-4 leading-relaxed">{message}</p>
        <SignInButton mode="modal">
            <button className="px-6 py-2.5 bg-terracotta-400 text-white text-sm font-semibold rounded-[10px] hover:bg-terracotta-500 transition-colors cursor-pointer font-body">
                Sign up
            </button>
        </SignInButton>
    </div>
);

export default SignupNudge;
