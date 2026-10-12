"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, CircleAlert, Copy, LoaderCircle, LockKeyhole, LogOut, Save, ShieldCheck } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

type Soc2Status = "not_started" | "in_progress" | "compliant";
type SystemStatus = "operational" | "degraded";
type TrustCenter = {
  id: string;
  user_id: string;
  company_name: string;
  slug: string;
  logo_url: string | null;
  gdpr_enabled: boolean;
  ccpa_enabled: boolean;
  soc2_status: Soc2Status;
  system_status: SystemStatus;
  description: string;
};
type FormState = Omit<TrustCenter, "id" | "user_id" | "slug" | "logo_url">;

const emptyForm: FormState = {
  company_name: "",
  gdpr_enabled: true,
  ccpa_enabled: false,
  soc2_status: "in_progress",
  system_status: "operational",
  description: "",
};

function makeSlug(name: string) {
  const base = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 45) || "trust-center";
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function DashboardPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const supabase = getSupabaseClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!active) return;
        if (!session?.user) {
          const pendingName = window.sessionStorage.getItem("trust-center-company") || "";
          setForm((current) => ({ ...current, company_name: pendingName }));
          setLoading(false);
          return;
        }
        setUserEmail(session.user.email || "");
        const { data, error: queryError } = await supabase.from("trust_centers").select("*").eq("user_id", session.user.id).maybeSingle();
        if (queryError) throw queryError;
        if (data && active) {
          const center = data as TrustCenter;
          setSlug(center.slug);
          setForm({ company_name: center.company_name, gdpr_enabled: center.gdpr_enabled, ccpa_enabled: center.ccpa_enabled, soc2_status: center.soc2_status, system_status: center.system_status, description: center.description || "" });
        }
      } catch (caught) {
        if (active) {
          const text = caught instanceof Error ? caught.message : "Could not connect to Supabase.";
          if (text.includes("Set NEXT_PUBLIC_SUPABASE")) setConfigured(false);
          else setError(text);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, []);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSendingLink(true);
    try {
      const supabase = getSupabaseClient();
      const redirectTo = `${window.location.origin}/dashboard`;
      const { error: authError } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      if (authError) throw authError;
      setMessage("Sign-in link sent. Check your email to continue.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not send sign-in link.");
    } finally {
      setSendingLink(false);
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error("Your session expired. Sign in again to save your page.");
      const nextSlug = slug || makeSlug(form.company_name);
      const { data, error: saveError } = await supabase.from("trust_centers").upsert({
        user_id: user.id,
        company_name: form.company_name.trim(),
        slug: nextSlug,
        gdpr_enabled: form.gdpr_enabled,
        ccpa_enabled: form.ccpa_enabled,
        soc2_status: form.soc2_status,
        system_status: form.system_status,
        description: form.description.trim(),
      }, { onConflict: "user_id" }).select("slug").single();
      if (saveError) throw saveError;
      setSlug(data.slug);
      window.sessionStorage.removeItem("trust-center-company");
      setMessage("Your trust center has been saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your trust center.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    const { error: signOutError } = await getSupabaseClient().auth.signOut();
    if (signOutError) setError(signOutError.message);
    else window.location.reload();
  }

  const publicUrl = slug ? `${typeof window !== "undefined" ? window.location.origin : ""}/trust/${slug}` : "";

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#17221f]">
      <header className="border-b border-[#e5e9e3] bg-white">
        <div className="mx-auto flex h-[70px] max-w-[1120px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-[#1e382f] text-[#d6f064]"><LockKeyhole size={17} /></span><span className="font-semibold tracking-[-.02em]">trustcenter<span className="text-[#71934e]">.</span></span></Link>
          {userEmail && <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#718078] transition hover:bg-[#f2f4ef] hover:text-[#17221f]"><LogOut size={15} /> Sign out</button>}
        </div>
      </header>

      <div className="mx-auto max-w-[900px] px-5 pb-16 pt-9 sm:px-8 sm:pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-[#768179] transition hover:text-[#28634d]"><ArrowLeft size={14} /> Back to home</Link>
        <div className="mt-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.14em] text-[#718653]"><ShieldCheck size={14} /> Founder workspace</div><h1 className="mt-2 text-[32px] font-medium tracking-[-.045em] sm:text-[38px]">Your trust center</h1><p className="mt-2 text-sm text-[#77827a]">Keep your security story accurate and ready to share.</p></div>{userEmail && <span className="text-xs text-[#78847c]">Signed in as <strong className="font-medium text-[#45554b]">{userEmail}</strong></span>}</div>

        {!configured ? <div className="mt-8 rounded-[16px] border border-[#e6d8af] bg-[#fbf7e9] p-5 text-sm text-[#5e5438]"><div className="flex gap-3"><CircleAlert size={18} className="mt-0.5 shrink-0" /><div><p className="font-semibold">Connect your Supabase project</p><p className="mt-1 leading-6">Add the Supabase URL and anon key from <span className="font-mono text-xs">.env.local</span>, then run <span className="font-mono text-xs">schema.sql</span> in the Supabase SQL editor.</p></div></div></div> : loading ? <div className="mt-10 flex items-center gap-2 text-sm text-[#718078]"><LoaderCircle size={17} className="animate-spin" /> Loading workspace…</div> : !userEmail ? <section className="mt-8 max-w-[520px] rounded-[16px] border border-[#e3e8e1] bg-white p-6 shadow-[0_8px_35px_rgba(28,45,37,.04)] sm:p-8"><div className="grid size-11 place-items-center rounded-[13px] bg-[#eaf0df] text-[#426a4b]"><LockKeyhole size={19} /></div><h2 className="mt-5 text-xl font-semibold tracking-[-.025em]">Sign in to set up your page</h2><p className="mt-2 text-sm leading-6 text-[#77827a]">We’ll email you a secure sign-in link. No password to remember.</p><form onSubmit={signIn} className="mt-6"><label htmlFor="email" className="mb-2 block text-xs font-semibold text-[#48584e]">Work email</label><div className="flex flex-col gap-2 sm:flex-row"><input id="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="h-12 min-w-0 flex-1 rounded-xl border border-[#dfe5dd] bg-white px-3.5 text-sm outline-none transition focus:border-[#809c56]" /><button disabled={sendingLink} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1e382f] px-5 text-sm font-semibold text-white transition hover:bg-[#2d5042] disabled:opacity-60">{sendingLink ? <LoaderCircle size={16} className="animate-spin" /> : null}Send sign-in link</button></div></form>{message && <p role="status" className="mt-4 text-sm text-[#32744d]">{message}</p>}{error && <p role="alert" className="mt-4 text-sm text-[#b44c3a]">{error}</p>}</section> : <>
          {slug && <div className="mt-7 flex flex-col gap-3 rounded-[14px] border border-[#d9e5d6] bg-[#eef4e9] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div><div className="text-[11px] font-semibold uppercase tracking-[.1em] text-[#54744f]">Your live trust page</div><a href={`/trust/${slug}`} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 break-all text-sm font-medium text-[#28583d] hover:underline">{publicUrl}<ArrowUpRight size={14} className="shrink-0" /></a></div><button type="button" onClick={() => void navigator.clipboard?.writeText(publicUrl)} className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#d6e0d2] bg-white px-3 text-xs font-medium text-[#425c48] transition hover:bg-[#f9fbf8]"><Copy size={14} /> Copy link</button></div>}

          <form onSubmit={save} className="mt-7 space-y-5">
            <section className="rounded-[14px] border border-[#e4e8e2] bg-white p-5 sm:p-6"><div className="flex items-center justify-between border-b border-[#edf0eb] pb-4"><div><h2 className="text-[15px] font-semibold">Company profile</h2><p className="mt-1 text-xs text-[#808b83]">The essentials customers see first.</p></div><span className="grid size-9 place-items-center rounded-[11px] bg-[#f1f4ed] text-[#5c7650]"><ShieldCheck size={17} /></span></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label htmlFor="company" className="mb-2 block text-xs font-semibold text-[#526057]">Company name</label><input id="company" required maxLength={80} value={form.company_name} onChange={(event) => setForm({ ...form, company_name: event.target.value })} className="h-11 w-full rounded-lg border border-[#dfe5dd] px-3 text-sm outline-none focus:border-[#809c56]" /></div><div><label htmlFor="system-status" className="mb-2 block text-xs font-semibold text-[#526057]">System status</label><select id="system-status" value={form.system_status} onChange={(event) => setForm({ ...form, system_status: event.target.value as SystemStatus })} className="h-11 w-full rounded-lg border border-[#dfe5dd] bg-white px-3 text-sm outline-none focus:border-[#809c56]"><option value="operational">Operational</option><option value="degraded">Degraded performance</option></select></div><div className="sm:col-span-2"><label htmlFor="description" className="mb-2 block text-xs font-semibold text-[#526057]">Description</label><textarea id="description" rows={3} maxLength={400} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="A short introduction to your company and its approach to trust." className="w-full resize-y rounded-lg border border-[#dfe5dd] px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#809c56]" /><div className="mt-1 text-right text-[10px] text-[#9aa39c]">{form.description.length}/400</div></div></div></section>

            <section className="rounded-[14px] border border-[#e4e8e2] bg-white p-5 sm:p-6"><div className="border-b border-[#edf0eb] pb-4"><h2 className="text-[15px] font-semibold">Compliance posture</h2><p className="mt-1 text-xs text-[#808b83]">Share where you are today, and update as you progress.</p></div><div className="divide-y divide-[#edf0eb]">
              <ToggleRow title="GDPR" detail="General Data Protection Regulation" checked={form.gdpr_enabled} onChange={(checked) => setForm({ ...form, gdpr_enabled: checked })} />
              <ToggleRow title="CCPA" detail="California Consumer Privacy Act" checked={form.ccpa_enabled} onChange={(checked) => setForm({ ...form, ccpa_enabled: checked })} />
              <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium">SOC 2</p><p className="mt-1 text-xs text-[#879189]">Service Organization Control 2</p></div><select aria-label="SOC 2 status" value={form.soc2_status} onChange={(event) => setForm({ ...form, soc2_status: event.target.value as Soc2Status })} className="h-10 w-full rounded-lg border border-[#dfe5dd] bg-white px-3 text-xs font-medium text-[#42534a] outline-none focus:border-[#809c56] sm:w-[190px]"><option value="not_started">Not started</option><option value="in_progress">In progress</option><option value="compliant">Compliant</option></select></div>
            </div></section>

            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"><div className="min-h-5">{message && <p role="status" className="flex items-center gap-1.5 text-xs text-[#32744d]"><Check size={14} />{message}</p>}{error && <p role="alert" className="flex items-center gap-1.5 text-xs text-[#b44c3a]"><CircleAlert size={14} />{error}</p>}</div><button disabled={saving || !form.company_name.trim()} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1e382f] px-5 text-sm font-semibold text-white transition hover:bg-[#2d5042] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"><Save size={16} />{saving ? "Saving…" : "Save trust center"}</button></div>
          </form>
        </>}
        <footer className="mt-14 border-t border-[#e3e8e1] pt-5 text-[11px] text-[#879189]">Your information is controlled by you. Update your public page whenever your posture changes.</footer>
      </div>
    </main>
  );
}

function ToggleRow({ title, detail, checked, onChange }: { title: string; detail: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-[#879189]">{detail}</p></div><button type="button" role="switch" aria-checked={checked} aria-label={`${title} enabled`} onClick={() => onChange(!checked)} className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors ${checked ? "bg-[#47734f]" : "bg-[#cbd2ca]"}`}><span className={`absolute top-[3px] size-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[23px]" : "translate-x-[3px]"}`} /></button></div>;
}
