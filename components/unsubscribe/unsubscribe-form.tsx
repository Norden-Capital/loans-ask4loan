"use client";

/* Unsubscribe form (design: LMS/design/brand-unsubscribe/ask4loan, made from the
   approved LoanHero page). Card, fields and button use the same classes as
   components/contact/contact-form.tsx.
   States: form, form + "Other" text box, wrong email, server error, success.
   Sends to /api/unsubscribe, which passes it on to the LMS. */

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UNSUBSCRIBE_OTHER_MAX, UNSUBSCRIBE_REASONS } from "@/lib/unsubscribe";

/* ── Site styling — the only part that differs between sites ───────────── */
const STYLES = {
  card: "rounded-2xl p-6 sm:p-8 shadow-lg border border-[#E2E8F0] bg-white flex flex-col gap-5",
  label: "block text-sm font-medium text-[#1F2937]",
  field:
    "w-full h-12 px-4 rounded-md border-[#E2E8F0] bg-white text-[#1F2937] focus-visible:ring-2 focus-visible:ring-emerald-500/10 focus-visible:border-emerald-500",
  bad: "!border-[#f87171] !bg-[#fef2f2]",
  button:
    "w-full px-6 py-3 text-base font-medium rounded-md bg-[#10B981] text-white transition-all duration-300 ease-out hover:bg-[#059669] hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 inline-flex items-center justify-center gap-2",
  reason:
    "relative flex items-center gap-2.5 min-h-11 px-3.5 border rounded-md text-[14px] font-medium cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-200",
  reasonOff: "border-[#E2E8F0] bg-white text-[#1F2937]",
  reasonOn: "border-[#10B981] bg-[#ecfdf5] text-[#065f46]",
  dotOff: "border-[1.5px] border-[#CBD5E1]",
  dotOn: "border-[5px] border-[#10B981]",
  muted: "text-[#64748B]",
};
/* ─────────────────────────────────────────────────────────────────────── */

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

type Status = "idle" | "sending" | "badEmail" | "serverError" | "done";

function AlertIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className="flex-none mt-px">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

export function UnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [other, setOther] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [doneEmail, setDoneEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const cleanEmail = email.trim();
    if (!isEmail(cleanEmail)) {
      setStatus("badEmail");
      return;
    }

    const company = (e.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";
    setStatus("sending");

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          reason,
          otherText: reason === "Other" ? other.trim() : "",
          company,
        }),
      });
      if (res.ok) {
        setDoneEmail(cleanEmail);
        setStatus("done");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { field?: string };
      setStatus(res.status === 400 && data.field === "email" ? "badEmail" : "serverError");
    } catch {
      setStatus("serverError");
    }
  }

  if (status === "done") {
    return (
      <div className={STYLES.card}>
        <div className="text-center pt-3 pb-1" role="status">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#ecfdf5] text-[#10B981]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4 12 14.01l-3-3" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937] mb-2">You&rsquo;re unsubscribed</h2>
          <p className={`text-[14px] max-w-[340px] mx-auto leading-[1.6] ${STYLES.muted}`}>We will not send you more emails.</p>
          <span className="inline-block mt-4 mb-1 px-3 py-1.5 rounded-full bg-[#F1F5F9] text-[#1F2937] text-[13px] font-semibold">{doneEmail}</span>
          <br />
          <a className="inline-block mt-5 text-[13px] font-semibold underline underline-offset-4 hover:opacity-80 text-[#059669]" href="/">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  const badEmail = status === "badEmail";

  return (
    <form onSubmit={handleSubmit} noValidate className={STYLES.card}>
      <div className="flex flex-col gap-5">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937]">Stop our emails</h2>

        {status === "serverError" && (
          <div role="alert" className="flex gap-2.5 items-start px-3.5 py-3 rounded-md bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-[13px] leading-normal">
            <AlertIcon size={18} />
            <div>
              <b className="block text-[#991b1b]">Something went wrong.</b>Please try again in a minute.
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="ub-email" className={STYLES.label}>
            Email address
          </label>
          <Input
            id="ub-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            placeholder="your@email.com"
            className={`${STYLES.field}${badEmail ? ` ${STYLES.bad}` : ""}`}
            value={email}
            aria-invalid={badEmail || undefined}
            aria-describedby={badEmail ? "ub-email-help" : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              if (badEmail) setStatus("idle");
            }}
          />
          {/* Always in the page (hidden when not needed), as in the design: keeps the same spacing. */}
          <p id="ub-email-help" className={badEmail ? "flex items-center gap-1.5 mt-1.5 text-[12.5px] text-[#dc2626]" : "hidden"}>
            <AlertIcon size={14} />
            Please enter a valid email.
          </p>
        </div>

        <div className="space-y-2" role="radiogroup" aria-labelledby="ub-reason-label">
          <p id="ub-reason-label" className={`select-none ${STYLES.label}`}>
            Why are you leaving? <span className={`font-normal ${STYLES.muted}`}>(optional)</span>
          </p>
          <div className="grid gap-2">
            {UNSUBSCRIBE_REASONS.map((r) => {
              const on = reason === r;
              return (
                <label key={r} className={`${STYLES.reason} ${on ? STYLES.reasonOn : STYLES.reasonOff}`}>
                  <input type="radio" name="reason" value={r} checked={on} onChange={() => setReason(r)} className="absolute opacity-0 pointer-events-none" />
                  <span className={`w-4 h-4 rounded-full bg-white flex-none ${on ? STYLES.dotOn : STYLES.dotOff}`} />
                  {r}
                </label>
              );
            })}
          </div>
          <div className={reason === "Other" ? "mt-2" : "hidden"}>
            <Textarea
              name="otherText"
              rows={3}
              aria-label="Tell us more (optional)"
              placeholder="Tell us more (optional)"
              maxLength={UNSUBSCRIBE_OTHER_MAX}
              className={`${STYLES.field} field-sizing-fixed min-h-16 h-auto py-3 resize-none`}
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />
          </div>
        </div>

        {/* Honeypot: hidden from people; bots often fill it. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute w-px h-px -left-[9999px] opacity-0 pointer-events-none"
        />

        <button type="submit" disabled={status === "sending"} className={STYLES.button}>
          {status === "sending" && <Loader2 size={16} className="animate-spin" />}
          Unsubscribe
        </button>
        <p className={`text-center text-[12px] m-0 ${STYLES.muted}`}>It only takes a second. You can sign up again any time.</p>
      </div>
    </form>
  );
}

export default UnsubscribeForm;
