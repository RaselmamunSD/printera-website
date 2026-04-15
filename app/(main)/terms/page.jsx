import React from "react";

const termsSections = [
    {
        title: "1. Acceptance of Terms",
        content:
            "By using Print Era, you agree to these Terms & Conditions, our policies, and all applicable laws. If you do not agree, please do not use this website.",
    },
    {
        title: "2. Orders and Quotations",
        content:
            "All quotes are valid for a limited period and are subject to design details, dimensions, and material availability. We reserve the right to refuse or cancel an order if incorrect pricing or technical issues occur.",
    },
    {
        title: "3. Payments",
        content:
            "Orders may require full or partial advance payment. Production can begin only after payment confirmation. Failed or delayed payments may delay delivery timelines.",
    },
    {
        title: "4. Production and Delivery",
        content:
            "Estimated delivery dates are provided in good faith. Actual timelines can vary based on order complexity, revisions, shipping carrier delays, and force majeure events.",
    },
    {
        title: "5. Returns and Replacements",
        content:
            "Custom printed products are generally non-refundable once approved for production. If your item is defective or differs from approved artwork, contact us within 7 days to request replacement support.",
    },
    {
        title: "6. User Responsibilities",
        content:
            "You are responsible for supplying accurate text, artwork, dimensions, and shipping information. You confirm that your uploaded designs do not violate third-party intellectual property rights.",
    },
    {
        title: "7. Intellectual Property",
        content:
            "All website content, branding, and design assets are owned by or licensed to Print Era. Unauthorized reproduction, redistribution, or commercial use is prohibited.",
    },
    {
        title: "8. Limitation of Liability",
        content:
            "To the maximum extent permitted by law, Print Era is not liable for indirect, incidental, or consequential damages resulting from website use, order delays, or third-party service interruptions.",
    },
    {
        title: "9. Policy Updates",
        content:
            "We may update these Terms from time to time. Updated terms become effective once posted on this page.",
    },
];

export default function TermsPage() {
    return (
        <main className="bg-[#F8FAFC] min-h-screen py-14 px-6 md:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <header className="bg-[#EEF2FF] border-b border-[#DCE5FF] px-8 py-10 md:px-12">
                    <p className="text-sm uppercase tracking-[0.18em] text-[#4B5563]">Legal</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#14141F] mt-2">
                        Terms & Conditions
                    </h1>
                    <p className="text-[#4B5563] mt-4 max-w-3xl">
                        These terms govern your use of our website and services. Please
                        read them carefully before placing any order.
                    </p>
                </header>

                <section className="px-8 py-10 md:px-12 space-y-8">
                    {termsSections.map((section) => (
                        <article key={section.title} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                            <h2 className="text-xl font-bold text-[#14141F]">{section.title}</h2>
                            <p className="mt-3 text-gray-600 leading-7">{section.content}</p>
                        </article>
                    ))}

                    <div className="bg-[#F3F6FF] border border-[#DFE7FF] rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-[#14141F]">Contact for Legal Queries</h3>
                        <p className="text-gray-600 mt-2 leading-7">
                            If you have questions regarding these terms, please contact our support team from the
                            Contact page with your order details.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}
