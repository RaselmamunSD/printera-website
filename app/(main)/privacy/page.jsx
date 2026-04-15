import React from "react";

const privacySections = [
    {
        title: "1. Information We Collect",
        content:
            "We may collect your name, email, phone number, shipping address, billing details, and order-related design files to process and deliver your printing requests.",
    },
    {
        title: "2. How We Use Your Information",
        content:
            "Your information is used to create quotes, process payments, fulfill orders, provide customer support, and improve service quality. We may also use your email for important order updates.",
    },
    {
        title: "3. Payment and Security",
        content:
            "Payment details are handled through secure payment providers. We apply reasonable safeguards to protect personal information from unauthorized access, alteration, or disclosure.",
    },
    {
        title: "4. Sharing of Data",
        content:
            "We do not sell your personal information. Data may be shared only with trusted service providers such as payment processors, shipping partners, and technical vendors when necessary for operations.",
    },
    {
        title: "5. Cookies and Analytics",
        content:
            "We may use cookies and analytics tools to improve website functionality, remember preferences, and understand usage patterns. You can adjust browser settings to limit cookies.",
    },
    {
        title: "6. Data Retention",
        content:
            "We retain personal data only as long as needed for legal, accounting, and operational purposes, including order history, support records, and dispute handling.",
    },
    {
        title: "7. Your Rights",
        content:
            "You can request access, correction, or deletion of your personal information where legally applicable. You may also request to stop promotional communications at any time.",
    },
    {
        title: "8. Third-Party Links",
        content:
            "Our website may contain links to third-party services. We are not responsible for their privacy practices, and you should review their policies separately.",
    },
    {
        title: "9. Policy Changes",
        content:
            "This Privacy Policy may be updated from time to time. Any changes will be posted on this page with the latest update date.",
    },
];

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-[#F8FAFC] min-h-screen py-14 px-6 md:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <header className="bg-[#EEF2FF] border-b border-[#DCE5FF] px-8 py-10 md:px-12">
                    <p className="text-sm uppercase tracking-[0.18em] text-[#4B5563]">Legal</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#14141F] mt-2">
                        Privacy Policy
                    </h1>
                    <p className="text-[#4B5563] mt-4 max-w-3xl">
                        Your privacy matters to us. This policy explains what data we
                        collect and how we use and protect it.
                    </p>
                </header>

                <section className="px-8 py-10 md:px-12 space-y-8">
                    {privacySections.map((section) => (
                        <article key={section.title} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                            <h2 className="text-xl font-bold text-[#14141F]">{section.title}</h2>
                            <p className="mt-3 text-gray-600 leading-7">{section.content}</p>
                        </article>
                    ))}

                    <div className="bg-[#F3F6FF] border border-[#DFE7FF] rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-[#14141F]">Privacy Support</h3>
                        <p className="text-gray-600 mt-2 leading-7">
                            To request data correction or deletion, please contact our support team and include
                            your registered email and relevant order reference.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
