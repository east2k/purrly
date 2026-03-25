import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — Purrly",
    description: "The terms and conditions for using Purrly.",
};

const LAST_UPDATED = "March 25, 2026";

const TermsPage = () => (
    <div className="max-w-2xl mx-auto">
        <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-sand-900 mb-1">Terms of Service</h2>
            <p className="text-xs text-sand-400">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-sm text-sand-700 leading-relaxed">
            <section>
                <h3 className="font-semibold text-sand-900 mb-2">1. Acceptance of terms</h3>
                <p>
                    By accessing or using Purrly, you agree to be bound by these Terms of Service.
                    If you do not agree, please do not use the app. We reserve the right to update
                    these terms at any time.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">2. Eligibility</h3>
                <p>
                    You must be at least 13 years old to use Purrly. By using the app, you confirm
                    that you meet this requirement. If you are under 18, you should have the permission
                    of a parent or guardian.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">3. Community guidelines</h3>
                <p className="mb-2">By posting on Purrly, you agree not to:</p>
                <ul className="space-y-2 list-disc list-inside text-sand-600">
                    <li>Share personal information about others without their consent (doxxing)</li>
                    <li>Post malicious, spam, or phishing links</li>
                    <li>Use hate speech, slurs, or discriminatory language</li>
                    <li>Harass, threaten, or target specific individuals</li>
                    <li>Post content that encourages or glorifies self-harm or suicide</li>
                    <li>Impersonate other users or public figures</li>
                    <li>Post content that is illegal in your jurisdiction</li>
                </ul>
                <p className="mt-2">
                    Violation of these guidelines may result in content removal or account suspension.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">4. User content</h3>
                <p>
                    You retain ownership of the content you post. By submitting content to Purrly,
                    you grant us a non-exclusive, royalty-free license to display and distribute it
                    within the app. We do not claim ownership of your content.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">5. Anonymous identity</h3>
                <p>
                    Purrly assigns each user a Purrlynonymous ID that may be displayed to others in
                    certain contexts (such as whispers). While the app is designed for anonymity,
                    we cannot guarantee complete anonymity in all circumstances. Do not share
                    identifying information about yourself or others.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">6. Not a substitute for professional help</h3>
                <p>
                    Purrly is a peer support and venting platform. It is not a substitute for
                    professional mental health care. If you are in crisis, please contact a crisis
                    line or mental health professional. See our{" "}
                    <a href="/resources" className="text-terracotta-500 hover:underline">resources page</a>{" "}
                    for crisis support lines.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">7. Disclaimer of warranties</h3>
                <p>
                    Purrly is provided &quot;as is&quot; without any warranties, express or implied. We do not
                    guarantee that the service will be uninterrupted, error-free, or free of harmful
                    content posted by other users.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">8. Limitation of liability</h3>
                <p>
                    To the fullest extent permitted by law, Purrly shall not be liable for any
                    indirect, incidental, or consequential damages arising from your use of the app
                    or content posted by other users.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">9. Termination</h3>
                <p>
                    We reserve the right to suspend or terminate accounts that violate these terms,
                    at our sole discretion and without prior notice.
                </p>
            </section>

            <section>
                <h3 className="font-semibold text-sand-900 mb-2">10. Contact</h3>
                <p>
                    For questions about these terms, contact us at{" "}
                    <span className="text-terracotta-500 font-medium">legal@purrly.app</span>.
                </p>
            </section>
        </div>
    </div>
);

export default TermsPage;
