"use client";

import { useUser } from "@clerk/nextjs";
import WhispersTab from "@/app/_components/Whispers/WhispersTab";
import SignupNudge from "@/app/_components/SignupNudge";
import { MOCK_CURRENT_USER_ID } from "@/app/_constants";

const WhispersPage = () => {
    const { isSignedIn, user } = useUser();

    if (!isSignedIn) {
        return (
            <div className="bg-white rounded-2xl border border-sand-300 shadow-card">
                <SignupNudge message="Sign up to start whispering. Connect with someone who gets it. 💬" />
            </div>
        );
    }

    return <WhispersTab currentUserId={user?.id ?? MOCK_CURRENT_USER_ID} />;
};

export default WhispersPage;
