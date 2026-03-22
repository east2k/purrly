"use client";

import { useUser } from "@clerk/nextjs";
import WhispersTab from "@/app/_components/Whispers/WhispersTab";
import SignupNudge from "@/app/_components/SignupNudge";

const WhispersPage = () => {
    const { isSignedIn, isLoaded, user } = useUser();

    if (!isLoaded) return null;

    if (!isSignedIn) {
        return (
            <div className="bg-white rounded-2xl border border-sand-300 shadow-card">
                <SignupNudge message="Sign up to start whispering. Connect with someone who gets it. 💬" />
            </div>
        );
    }

    return <WhispersTab currentUserId={user!.id} />;
};

export default WhispersPage;
