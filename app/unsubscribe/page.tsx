import { ChevronRight, MailX } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { UnsubscribeForm } from "@/components/unsubscribe/unsubscribe-form";

// Same page frame as /contact (app/contact/ContactClient.tsx); design: LMS/design/brand-unsubscribe/ask4loan.
export const metadata: Metadata = {
  title: "Unsubscribe | Ask4Loan Canada",
  description: "Stop Ask4Loan emails. Enter your email address and we will stop sending you emails.",
  alternates: {
    canonical: "/unsubscribe",
  },
};

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Oval Gradient Background - Above Everything */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 800px 400px at center top, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 40%, transparent 70%)`,
          zIndex: 5,
        }}
      />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="py-4" style={{ backgroundColor: "transparent" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-sm justify-center">
              <Link href="/" className="transition-colors hover:text-emerald-500" style={{ color: "#64748B" }}>
                Home
              </Link>
              <ChevronRight className="w-4 h-4" style={{ color: "#64748B" }} />
              <span style={{ color: "#1F2937" }}>Unsubscribe</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="py-12 sm:py-12 pb-12 sm:pb-12" style={{ backgroundColor: "transparent" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.15)" }}
            >
              <MailX className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: "#10B981" }} />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: "#1F2937" }}>
              Unsubscribe
            </h1>

            <p className="text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0 leading-relaxed" style={{ color: "#64748B" }}>
              Enter your email and we will stop sending you emails.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-8 sm:py-16 -mt-8 sm:-mt-12">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <UnsubscribeForm />
          </div>
        </section>
      </div>
    </div>
  );
}
