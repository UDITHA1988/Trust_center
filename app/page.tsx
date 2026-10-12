"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Compliance, made clear",
    copy: "Put GDPR, CCPA and SOC 2 progress in one calm, customer-ready place.",
    tint: "bg-[#e4edd9] text-[#28634d]",
  },
  {
    icon: Globe2,
    title: "Public by design",
    copy: "Give every prospect one permanent link to how you protect their data.",
    tint: "bg-[#e8e9db] text-[#717a39]",
  },
  {
    icon: BadgeCheck,
    title: "Trust that travels",
    copy: "Share a verified trust badge in proposals, product pages and sales calls.",
    tint: "bg-[#e3ecea] text-[#3d7067]",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");

  function startSetup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = companyName.trim();
    if (!trimmedName) return;
    window.sessionStorage.setItem("trust-center-company", trimmedName);
    router.push("/dashboard");
  }

  return (
    <main className="overflow-hidden bg-[#f7f8f5] text-[#17221f]">
      <div className="grain relative bg-[#1e382f] text-white">
        <nav className="relative z-10 mx-auto flex h-[76px] max-w-[1240px] items-center justify-between px-6 lg:px-10">
          <a href="/" className="flex items-center gap-2.5" aria-label="TrustCenter home">
            <span className="grid size-9 place-items-center rounded-xl bg-[#d6f064] text-[#1e382f]"><LockKeyhole size={18} strokeWidth={2.4} /></span>
            <span className="text-[17px] font-semibold tracking-[-.02em]">trustcenter<span className="text-[#d6f064]">.</span></span>
          </a>
          <div className="flex items-center gap-5">
            <a href="#how-it-works" className="hidden text-sm text-white/70 transition hover:text-white sm:block">Why TrustCenter</a>
            <a href="/dashboard" className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium transition hover:border-white/50">Sign in <ArrowUpRight size={15} /></a>
          </div>
        </nav>

        <section className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-6 pb-24 pt-12 md:grid-cols-[1.06fr_.94fr] md:pb-28 md:pt-[70px] lg:px-10">
          <div className="relative z-10 animate-rise">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[.12em] text-[#d6f064]"><Sparkles size={13} /> Built for the next generation of AI</div>
            <h1 className="max-w-[680px] text-[clamp(42px,6.3vw,76px)] font-medium leading-[.99] tracking-[-.055em]">Generate your founder trust center in <span className="font-serif italic text-[#d6f064]">60 seconds.</span></h1>
            <p className="mt-7 max-w-[500px] text-[17px] leading-7 text-white/65">The clear, credible home for your security posture. Answer due diligence before the next customer has to ask.</p>
            <form onSubmit={startSetup} className="mt-9 flex max-w-[510px] flex-col gap-2 rounded-[18px] border border-white/15 bg-white p-2 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor="company-name">Company name</label>
              <input id="company-name" required maxLength={80} value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Company name" className="min-h-12 min-w-0 flex-1 bg-transparent px-4 text-[15px] text-[#17221f] outline-none placeholder:text-[#87918a]" />
              <button type="submit" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d6f064] px-5 text-sm font-semibold text-[#1e382f] transition hover:bg-[#e2fa83]">Create trust center <ArrowRight size={16} /></button>
            </form>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/55"><Check size={14} className="text-[#d6f064]" /> Free to start <span className="text-white/20">·</span> No credit card <span className="text-white/20">·</span> Your data stays yours</div>
          </div>

          <div className="relative animate-rise-delay md:pl-5">
            <div className="absolute -right-14 -top-12 size-52 rounded-full border border-[#d6f064]/10 md:size-72" />
            <div className="absolute -right-1 top-2 size-36 rounded-full border border-[#d6f064]/10 md:size-48" />
            <div className="relative mx-auto max-w-[490px] rounded-[22px] border border-white/15 bg-[#f7f8f5] p-3 shadow-[0_35px_100px_rgba(0,0,0,.28)] sm:p-4">
              <div className="flex items-center gap-2 border-b border-[#e5e9e3] px-3 pb-3 text-[11px] text-[#78827b]"><span className="size-2 rounded-full bg-[#dc8067]" /><span className="size-2 rounded-full bg-[#e7bc57]" /><span className="size-2 rounded-full bg-[#71a77e]" /><div className="ml-auto rounded-md bg-white px-3 py-1.5">portal.acme.ai/trust</div></div>
              <div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-[13px] bg-[#1e382f] text-[#d6f064]"><Sparkles size={20} /></div><div><div className="text-[15px] font-semibold text-[#17221f]">Acme Intelligence</div><div className="mt-1 text-[11px] text-[#818b84]">Trust &amp; Security</div></div></div>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#e5f0e6] px-2.5 py-1.5 text-[10px] font-semibold text-[#317149]"><span className="size-1.5 rounded-full bg-[#4b9a65]" /> All systems go</span>
                </div>
                <div className="mt-6 rounded-[14px] border border-[#e5e9e3] bg-white p-4">
                  <div className="flex items-center justify-between"><div><div className="text-[11px] font-medium text-[#7a857d]">COMPLIANCE OVERVIEW</div><div className="mt-1 text-[13px] text-[#17221f]">Our commitments, at a glance.</div></div><BadgeCheck size={20} className="text-[#628852]" /></div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[['GDPR', 'Enabled'], ['SOC 2', 'In progress'], ['CCPA', 'Enabled']].map(([label, value]) => <div key={label} className="rounded-[10px] bg-[#f6f7f3] p-2.5"><div className="text-[10px] font-semibold text-[#758078]">{label}</div><div className="mt-1.5 text-[10px] font-medium text-[#315a43]">{value}</div></div>)}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-[14px] border border-[#e5e9e3] bg-white p-3.5"><div className="flex items-center gap-2 text-[11px] font-medium text-[#42524a]"><LockKeyhole size={14} className="text-[#628852]" /> Data protection</div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#edf0e9]"><div className="h-full w-[82%] rounded-full bg-[#90aa57]" /></div><div className="mt-2 text-[10px] text-[#7e8980]">AES-256 encryption</div></div>
                  <div className="rounded-[14px] border border-[#e5e9e3] bg-white p-3.5"><div className="flex items-center gap-2 text-[11px] font-medium text-[#42524a]"><Zap size={14} className="text-[#a58b3d]" /> Uptime</div><div className="mt-2 text-[19px] font-semibold text-[#17221f]">99.98%</div><div className="text-[10px] text-[#7e8980]">Last 90 days</div></div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-[#89928c]"><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-[#68a575]" /> Verified trust portal</span><span>Updated just now</span></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-1 hidden items-center gap-3 rounded-[14px] border border-[#e5e9e3] bg-white px-4 py-3 shadow-lg sm:flex md:-left-7"><span className="grid size-9 place-items-center rounded-full bg-[#edf3dd] text-[#506f3c]"><BadgeCheck size={18} /></span><span><span className="block text-xs font-semibold text-[#17221f]">Trust, made tangible</span><span className="mt-1 block text-[10px] text-[#7b867f]">Your security story, always ready</span></span></div>
          </div>
        </section>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
      </div>

      <section id="how-it-works" className="mx-auto max-w-[1240px] px-6 py-[76px] lg:px-10 lg:py-[92px]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><div className="text-xs font-semibold uppercase tracking-[.16em] text-[#6d845d]">One link. More confidence.</div><h2 className="mt-3 max-w-[570px] text-[34px] font-medium leading-tight tracking-[-.04em] sm:text-[43px]">Trust should be easy to verify.</h2></div>
          <p className="max-w-[360px] pb-1 text-[14px] leading-6 text-[#6f7a72]">Replace scattered security answers with a source of truth your whole team can share.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, copy, tint }, index) => <article key={title} className="group border-t border-[#dfe4dc] py-6 transition-colors hover:border-[#8ea64e]"><div className="flex items-center justify-between"><span className={`grid size-11 place-items-center rounded-[13px] ${tint}`}><Icon size={19} /></span><span className="font-mono text-xs text-[#a0a9a1]">0{index + 1}</span></div><h3 className="mt-5 text-[18px] font-semibold tracking-[-.02em]">{title}</h3><p className="mt-2 max-w-[310px] text-[13px] leading-6 text-[#737e76]">{copy}</p></article>)}
        </div>
      </section>

      <section className="mx-6 mb-16 overflow-hidden rounded-[22px] bg-[#e9eddf] sm:mx-10 lg:mx-auto lg:mb-24 lg:max-w-[1160px]">
        <div className="grid items-center gap-7 px-7 py-9 sm:px-10 md:grid-cols-[1fr_auto] md:py-11">
          <div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#64714d]"><CircleHelp size={14} /> Ready when they ask</div><h2 className="mt-3 max-w-[560px] text-[28px] font-medium leading-tight tracking-[-.04em] sm:text-[34px]">Make security a reason they choose you.</h2><p className="mt-3 max-w-[500px] text-sm leading-6 text-[#69736a]">Set up your page once. Let every customer, partner and reviewer find the answers they need.</p></div>
          <a href="#company-name" onClick={(event) => { event.preventDefault(); document.getElementById("company-name")?.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-xl bg-[#1e382f] px-5 text-sm font-semibold text-white transition hover:bg-[#2b4d40] md:self-center">Build your trust page <ChevronRight size={16} /></a>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1240px] flex-col gap-3 border-t border-[#e1e6df] px-6 py-6 text-xs text-[#79847c] sm:flex-row sm:items-center sm:justify-between lg:px-10"><span>© 2026 TrustCenter. Built for better questions.</span><a href="/dashboard" className="inline-flex items-center gap-1.5 transition hover:text-[#28634d]">Founder sign in <ArrowDownRight size={13} /></a></footer>
    </main>
  );
}
