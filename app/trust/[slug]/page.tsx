import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Check, CircleHelp, Database, Globe2, LockKeyhole, Server, Shield, ShieldCheck, Zap } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

type TrustCenter = {
  company_name: string;
  slug: string;
  logo_url: string | null;
  gdpr_enabled: boolean;
  ccpa_enabled: boolean;
  soc2_status: "not_started" | "in_progress" | "compliant";
  system_status: "operational" | "degraded";
  description: string;
};

const demo: TrustCenter = {
  company_name: "Acme Intelligence",
  slug: "acme-intelligence",
  logo_url: null,
  gdpr_enabled: true,
  ccpa_enabled: true,
  soc2_status: "in_progress",
  system_status: "operational",
  description: "We build thoughtful AI tools that help teams do their best work. Protecting your data is part of that commitment.",
};

async function fetchTrustCenter(slug: string): Promise<TrustCenter> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { ...demo, slug };
  try {
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.from("trust_centers").select("company_name,slug,logo_url,gdpr_enabled,ccpa_enabled,soc2_status,system_status,description").eq("slug", slug).maybeSingle();
    if (error || !data) return { ...demo, slug };
    return data as TrustCenter;
  } catch {
    return { ...demo, slug };
  }
}

const soc2Labels: Record<TrustCenter["soc2_status"], string> = {
  not_started: "Not started",
  in_progress: "In progress",
  compliant: "Compliant",
};

export default async function TrustPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const center = await fetchTrustCenter(slug);
  const operational = center.system_status === "operational";

  return (
    <main className="min-h-screen bg-[#f6f8f5] text-[#18231f]">
      <header className="border-b border-[#e4e9e2] bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1040px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-[#1e382f] text-[#d6f064]"><LockKeyhole size={17} /></span><span className="text-[14px] font-semibold tracking-[-.02em]">trustcenter<span className="text-[#71934e]">.</span></span></Link>
          <span className="flex items-center gap-2 rounded-full border border-[#dce9dc] bg-[#f3f8f1] px-3 py-1.5 text-[11px] font-semibold text-[#3d7650]"><BadgeCheck size={14} /> Verified Trust Portal</span>
        </div>
      </header>

      <section className="mx-auto max-w-[940px] px-5 pb-14 pt-11 sm:px-8 sm:pb-16 sm:pt-14">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="flex items-start gap-4">
            {center.logo_url ? <img src={center.logo_url} alt={`${center.company_name} logo`} className="size-[58px] rounded-[16px] border border-[#e1e7de] bg-white object-contain p-2" /> : <div className="grid size-[58px] shrink-0 place-items-center rounded-[16px] bg-[#203c31] text-[#d6f064]"><ShieldCheck size={24} /></div>}
            <div><div className="text-xs font-semibold uppercase tracking-[.13em] text-[#758471]">Trust &amp; Security</div><h1 className="mt-2 text-[32px] font-medium leading-tight tracking-[-.045em] sm:text-[42px]">{center.company_name}</h1><p className="mt-2 max-w-[580px] text-sm leading-6 text-[#758078]">{center.description || "Our approach to security, privacy and reliability."}</p></div>
          </div>
          <div className={`flex shrink-0 items-center gap-2 self-start rounded-full px-3.5 py-2 text-xs font-semibold ${operational ? "bg-[#e7f1e6] text-[#39704c]" : "bg-[#fbefd9] text-[#916b28]"}`}><span className={`size-2 rounded-full ${operational ? "bg-[#4c9b66]" : "bg-[#d99b38]"}`} />{operational ? "All systems operational" : "Degraded performance"}</div>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2">
          <section className="rounded-[13px] border border-[#e2e8e0] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[13px] font-semibold"><Shield size={16} className="text-[#638351]" /> Compliance &amp; certifications</div><span className="text-[10px] text-[#929c94]">OUR PROGRAM</span></div>
            <div className="mt-5 space-y-3">
              <ComplianceLine label="GDPR" detail="Data protection regulation" active={center.gdpr_enabled} activeText="Enabled" />
              <ComplianceLine label="CCPA" detail="California privacy rights" active={center.ccpa_enabled} activeText="Enabled" />
              <div className="flex items-center justify-between gap-3 border-t border-[#edf0eb] pt-3"><div><div className="text-xs font-semibold">SOC 2</div><div className="mt-1 text-[10px] text-[#8b958e]">Independent controls audit</div></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${center.soc2_status === "compliant" ? "bg-[#e7f1e6] text-[#39704c]" : "bg-[#f5f0df] text-[#867136]"}`}>{soc2Labels[center.soc2_status]}</span></div>
            </div>
          </section>

          <section className="rounded-[13px] border border-[#e2e8e0] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[13px] font-semibold"><LockKeyhole size={16} className="text-[#638351]" /> Data protection</div><span className="text-[10px] text-[#929c94]">ENCRYPTION</span></div>
            <p className="mt-4 text-xs leading-5 text-[#77827a]">We apply encryption and access controls to protect customer information throughout its lifecycle.</p>
            <div className="mt-4 divide-y divide-[#edf0eb] rounded-[10px] border border-[#edf0eb] px-3.5">
              <DetailRow icon={<LockKeyhole size={14} />} label="In transit" value="TLS encryption" />
              <DetailRow icon={<Database size={14} />} label="At rest" value="AES-256 encryption" />
              <DetailRow icon={<ShieldCheck size={14} />} label="Access" value="Least privilege" />
            </div>
          </section>

          <section className="rounded-[13px] border border-[#e2e8e0] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[13px] font-semibold"><Globe2 size={16} className="text-[#638351]" /> Security practices</div><span className="text-[10px] text-[#929c94]">OUR APPROACH</span></div>
            <p className="mt-4 text-xs leading-5 text-[#77827a]">Security is integrated into how we build and operate our services, with regular reviews of our controls and infrastructure.</p>
            <div className="mt-4 space-y-3">
              <Practice icon={<Check size={13} />} text="Regular vulnerability monitoring" />
              <Practice icon={<Check size={13} />} text="Role-based access controls" />
              <Practice icon={<Check size={13} />} text="Subprocessor oversight" />
            </div>
            <p className="mt-5 text-[11px] text-[#6f7b70]">Request a current subprocessor list directly from the company.</p>
          </section>

          <section className="rounded-[13px] border border-[#e2e8e0] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[13px] font-semibold"><Server size={16} className="text-[#638351]" /> Infrastructure status</div><span className="text-[10px] text-[#929c94]">OWNER-REPORTED</span></div>
            <div className="mt-5 flex items-center gap-3 rounded-[10px] bg-[#f3f7f1] p-3.5"><span className={`grid size-9 place-items-center rounded-full ${operational ? "bg-[#e1efdf] text-[#428054]" : "bg-[#f6ebd8] text-[#a77c2e]"}`}><Zap size={17} /></span><div><div className="text-xs font-semibold">{operational ? "Operational" : "Degraded performance"}</div><div className="mt-1 text-[10px] text-[#828d84]">Status set in company settings</div></div></div>
            <p className="mt-4 text-[11px] leading-5 text-[#828d84]">Automated uptime telemetry is not connected.</p>
          </section>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-[11px] border border-[#e4e9e1] bg-[#f0f3ed] px-4 py-3.5 text-[11px] leading-5 text-[#737e75]"><CircleHelp size={15} className="mt-0.5 shrink-0 text-[#788e5d]" /><p>For security documentation or a current subprocessor list, contact the company through your established channel.</p></div>
      </section>

      <footer className="border-t border-[#e4e9e2] bg-white"><div className="mx-auto flex max-w-[940px] flex-col items-center justify-between gap-2 px-5 py-5 text-[11px] text-[#8a958d] sm:flex-row sm:px-8"><span>© {new Date().getFullYear()} {center.company_name} · Trust &amp; Security</span><Link href="/" className="inline-flex items-center gap-1 font-medium text-[#637955] transition hover:text-[#2e5b3d]">Powered by TrustCenter.so <span>·</span> Create yours for free <ArrowUpRight size={12} /></Link></div></footer>
    </main>
  );
}

function ComplianceLine({ label, detail, active, activeText }: { label: string; detail: string; active: boolean; activeText: string }) {
  return <div className="flex items-center justify-between gap-3 border-t border-[#edf0eb] pt-3"><div><div className="text-xs font-semibold">{label}</div><div className="mt-1 text-[10px] text-[#8b958e]">{detail}</div></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${active ? "bg-[#e7f1e6] text-[#39704c]" : "bg-[#f1f2ee] text-[#7c857e]"}`}>{active ? activeText : "Not enabled"}</span></div>;
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center justify-between gap-2 py-3"><span className="flex items-center gap-2 text-[11px] text-[#78837b]">{icon}{label}</span><span className="text-[11px] font-medium text-[#425148]">{value}</span></div>;
}

function Practice({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex items-center gap-2.5 text-[11px] text-[#627168]"><span className="grid size-[19px] place-items-center rounded-full bg-[#e8f0e3] text-[#4e8155]">{icon}</span>{text}</div>;
}
