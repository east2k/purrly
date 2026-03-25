import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — Purrly",
    description: "How Purrly collects, uses, and protects your information.",
};

const LAST_UPDATED = "March 25, 2026";

const PrivacyPage = () => (
    <div className="max-w-2xl mx-auto">
        <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-sand-900 mb-1">Privacy Policy</h2>
            <p className="text-xs text-sand-400">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-sm text-sand-700 leading-relaxed">
            <section>
                <h3 className="font-semibold text-sand-900 mb-2">1. Who we are</h3>
                <p>
                    Purrly is a safe-space venting and wellness app. We are committed to protecting
                    your privacy and handling your data with care and transparency.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">2. Information we collect</h3>
                <ul className="space-y-2 list-disc list-inside text-sand-600">
                    <li><span className="text-sand-700 font-medium">Account information</span> — when you sign in via Clerk, we receive your email address and a unique user ID.</li>
                    <li><span className="text-sand-700 font-medium">Posts and comments</span> — content you submit, including mood, language, and whether your identity is hidden.</li>
                    <li><span className="text-sand-700 font-medium">Whisper messages</span> — private messages between users are stored to enable the chat feature.</li>
                    <li><span className="text-sand-700 font-medium">Reactions and reports</span> — hugs, report actions, and content flags you submit.</li>
                    <li><span className="text-sand-700 font-medium">IP address</span> — collected temporarily for anonymous rate limiting. Not linked to your account.</li>
                </ul>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">3. How we use your information</h3>
                <ul className="space-y-2 list-disc list-inside text-sand-600">
                    <li>To provide and operate the Purrly service</li>
                    <li>To enforce community guidelines and prevent abuse</li>
                    <li>To display your anonymous Purrlynonymous ID to other users when relevant</li>
                    <li>To rate-limit anonymous posting to reduce spam</li>
                </ul>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">4. Data sharing</h3>
                <p>
                    We do not sell your personal data. We share data only with the following services
                    necessary to operate Purrly:
                </p>
                <ul className="space-y-2 list-disc list-inside text-sand-600 mt-2">
                    <li><span className="font-medium text-sand-700">Clerk</span> — authentication and account management</li>
                    <li><span className="font-medium text-sand-700">Neon</span> — database hosting</li>
                    <li><span className="font-medium text-sand-700">Pusher</span> — real-time messaging</li>
                    <li><span className="font-medium text-sand-700">Vercel</span> — application hosting</li>
                </ul>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">5. Data retention</h3>
                <p>
                    Posts and comments are retained until you delete them. Whisper conversations expire
                    automatically based on their timer. Anonymous rate limit records are stored by date
                    and are not linked to any account.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">6. Your rights</h3>
                <p>
                    Depending on your location, you may have rights to access, correct, or delete your
                    personal data. To make a request, contact us at the email below. We will respond
                    within 30 days.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">7. Children</h3>
                <p>
                    Purrly is intended for users aged 13 and older. We do not knowingly collect
                    personal information from children under 13. If you believe a child under 13 has
                    provided us with personal data, please contact us and we will delete it promptly.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">8. Changes to this policy</h3>
                <p>
                    We may update this policy from time to time. We will update the &quot;last updated&quot;
                    date above and, where appropriate, notify users within the app.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">9. Contact</h3>
                <p>
                    If you have any questions about this policy, please contact us at{" "}
                    <span className="text-terracotta-500 font-medium">privacy@purrly.app</span>.
                </p>
            </section>
        </div>
    </div>
);

export default PrivacyPage;
