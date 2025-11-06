
const CALENDLY_INLINE_URL = import.meta.env.VITE_CALENDLY_URL || "";
const HUBSPOT_WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "";

import React, { useMemo, useState, useEffect } from 'react'
import { Filter, Search, CheckCircle2, MapPin, GraduationCap, Phone, Mail, Calendar, Upload } from 'lucide-react'

// ---------- CONFIG (EDIT THESE) ----------
const HUBSPOT_WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || "";
const FILE_UPLOAD_ENDPOINT = import.meta.env.VITE_UPLOAD_ENDPOINT || "";
const CALENDLY_INLINE_URL = import.meta.env.VITE_CALENDLY_URL || "https://calendly.com/your-team/intro-call";
const CHAT_WIDGET_SCRIPT = "";

// ---------- MOCK DATA (REPLACE WITH YOURS) ----------
const PROGRAMS = [
  {
    id: 1,
    institution: "Riga Tech University",
    country: "Latvia",
    city: "Riga",
    level: "Undergraduate",
    field: "Computer Science",
    program_name: "BSc Computer Science",
    duration: "3 years",
    tuition_per_year: 5500,
    application_fee: 50,
    intake_months: ["September", "February"],
    language: "English",
    IELTS_min: 6.0,
    TOEFL_min: 80,
    requirements: "High school diploma, transcript, passport copy, IELTS/TOEFL",
    scholarships: true,
    application_link: "#apply",
    last_updated: "2025-10-01",
  },
  {
    id: 2,
    institution: "Vilnius Business School",
    country: "Lithuania",
    city: "Vilnius",
    level: "Postgraduate",
    field: "Business",
    program_name: "MBA International Management",
    duration: "1.5 years",
    tuition_per_year: 7800,
    application_fee: 90,
    intake_months: ["September"],
    language: "English",
    IELTS_min: 6.5,
    TOEFL_min: 90,
    requirements: "Bachelor degree, CV, motivation letter, two references",
    scholarships: false,
    application_link: "#apply",
    last_updated: "2025-09-12",
  },
  {
    id: 3,
    institution: "University of Gdańsk",
    country: "Poland",
    city: "Gdańsk",
    level: "Undergraduate",
    field: "Engineering",
    program_name: "BEng Mechanical Engineering",
    duration: "3.5 years",
    tuition_per_year: 4200,
    application_fee: 60,
    intake_months: ["October"],
    language: "English",
    IELTS_min: 5.5,
    TOEFL_min: 72,
    requirements: "High school diploma with math/physics, passport",
    scholarships: false,
    application_link: "#apply",
    last_updated: "2025-08-28",
  },
];

const COUNTRIES = [...new Set(PROGRAMS.map(p => p.country))];
const LEVELS = [...new Set(PROGRAMS.map(p => p.level))];
const FIELDS = [...new Set(PROGRAMS.map(p => p.field))];

function currency(n) { return new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(n); }

function Section({ id, title, children, bg="bg-bg" }) {
  return (
    <section id={id} className={`${bg} py-16`}>
      <div className="mx-auto max-w-7xl px-4">
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        {children}
      </div>
    </section>
  );
}

function Card({ className="", children }) {
  return <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>{children}</div>;
}
function CardHeader({ children }) { return <div className="border-b p-4">{children}</div>; }
function CardTitle({ children }) { return <div className="text-lg font-semibold">{children}</div>; }
function CardContent({ children, className="" }) { return <div className={`p-4 ${className}`}>{children}</div>; }
function Button({ children, className="", ...props }) {
  return <button {...props} className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium hover:opacity-90 ${className}`}>{children}</button>;
}
function Input(props){ return <input {...props} className={"w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring " + (props.className||"")} /> }
function Textarea(props){ return <textarea {...props} className={"w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring " + (props.className||"")} /> }
function Select({ value, onChange, children, placeholder }){
  return (
    <select value={value} onChange={e=>onChange?.(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm">
      <option value="">{placeholder||"Select"}</option>
      {children}
    </select>
  );
}
function Badge({ children }){ return <span className="rounded-full border px-2 py-1 text-xs">{children}</span> }

function Dialog({ open, onClose, children }){
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4">
        <div className="flex justify-end">
          <button className="rounded-full px-2 text-2xl" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  ) : null;
}

// ---------- NAVBAR ----------
function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="#home" className="text-xl font-bolWd"><img
  src="/logo.png"
  alt="WeGuideAbroad Logo"
  className="h-10 w-auto"
/>
</a>
        <div className="hidden gap-6 md:flex">
          <a href="#programs" className="text-sm hover:opacity-80">Programs</a>
          <a href="#howto" className="text-sm hover:opacity-80">How to Apply</a>
          <a href="#destinations" className="text-sm hover:opacity-80">Destinations</a>
          <a href="#services" className="text-sm hover:opacity-80">Services</a>
          <a href="#testimonials" className="text-sm hover:opacity-80">function Testimonials() {
  const t = [
    { 
      n: "Adesh Goud Mallati", 
      img: "/testimonials/adesh.jpg", 
      q: "From Nizamabad to RNU — completed Bachelor's in Business Administration in Tourism. Smooth process, guided every step."
    },
    { 
      n: "Suryateja Gajendrawar", 
      img: "/testimonials/suryateja.jpg", 
      q: "From Nizamabad to RTU — pursuing Masters in Aviation Engineering. Visa and admission support were on point."
    },
    { 
      n: "Vinaykumar Karakanti", 
      img: "/testimonials/vinay.jpg", 
      q: "From Warangal to TSI University — Masters in Computer Science. Fast responses and transparent guidance."
    }
  ];

  return (
    <section id="testimonials" className="bg-card py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-3xl font-bold text-text">Our Students’ Journeys</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {t.map(x => (
            <div key={x.n} className="rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="mb-4 flex items-center gap-3">
                <img src={x.img} alt={x.n} className="h-12 w-12 rounded-full object-cover" />
                <div className="font-semibold text-text">{x.n}</div>
              </div>
              <p className="text-text/80 text-sm">“{x.q}”</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-text/60 text-sm">And many more success stories from WeGuideAbroad students across Europe.</p>
      </div>
    </section>
  );
}
</a>
          <a href="#contact" className="text-sm hover:opacity-80">Contact</a>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-black text-white" onClick={()=>setOpen(true)}>Quick Application</Button>
          <a href="#book"><Button>Book a Call</Button></a>
        </div>
      </div>
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <div className="px-2 pb-6">
          <h3 className="mb-4 text-xl font-semibold">Quick Application</h3>
          <QuickApplyForm onDone={()=>setOpen(false)} />
        </div>
      </Dialog>
    </div>
  );
}

// ---------- HERO ----------
function Hero() {
  const [open, setOpen] = useState(false);
  return (
    <section id="home" className="bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">Study abroad, without the chaos.</h1>
          <p className="mb-6 text-slate-600">Search programs, apply once, track everything. We guide you end‑to‑end—admissions, visas, housing, and more.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#programs"><Button className="bg-black text-white">Find Programs</Button></a>
            <Button onClick={()=>setOpen(true)}>Quick Application</Button>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Trusted partners</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Fast response</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Document checklist</div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle><span className="inline-flex items-center gap-2"><Filter className="h-5 w-5"/> Program Finder</span></CardTitle>
          </CardHeader>
          <CardContent>
            <ProgramSearch compact />
          </CardContent>
        </Card>
      </div>
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <div className="px-2 pb-6">
          <h3 className="mb-4 text-xl font-semibold">Quick Application</h3>
          <QuickApplyForm onDone={()=>setOpen(false)} />
        </div>
      </Dialog>
    </section>
  );
}
<a href="tel:+37125722769" className="inline-flex items-center rounded-2xl border border-[#6F7D48] px-4 py-2 text-[#6F7D48] hover:bg-[#6F7D48]/10">
  Call: +371 25722769
</a>

// ---------- PROGRAM SEARCH ----------
function ProgramSearch({ compact = false }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [field, setField] = useState("");
  const [maxTuition, setMaxTuition] = useState("");

  const results = useMemo(() => {
    return PROGRAMS.filter(p =>
      (!query || p.program_name.toLowerCase().includes(query.toLowerCase()) || p.institution.toLowerCase().includes(query.toLowerCase())) &&
      (!country || p.country === country) &&
      (!level || p.level === level) &&
      (!field || p.field === field) &&
      (!maxTuition || p.tuition_per_year <= Number(maxTuition))
    );
  }, [query, country, level, field, maxTuition]);

  return (
    <div>
      <div className={`grid gap-3 ${compact ? "md:grid-cols-2" : "md:grid-cols-5"}`}>
        <div className="md:col-span-2 relative">
          <Input placeholder="Search program or institution" value={query} onChange={e=>setQuery(e.target.value)} className="pl-9" />
          <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-slate-500"/>
        </div>
        <Select value={country} onChange={setCountry} placeholder="Country">
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={level} onChange={setLevel} placeholder="Level">
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </Select>
        <Select value={field} onChange={setField} placeholder="Field">
          {FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
        </Select>
        <Input placeholder="Max tuition (€)" value={maxTuition} onChange={e=>setMaxTuition(e.target.value)} />
      </div>

      {!compact && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map(p => <ProgramCard key={p.id} p={p} />)}
          {results.length === 0 && <div className="text-sm text-slate-500">No results. Loosen filters.</div>}
        </div>
      )}
    </div>
  );
}

function ProgramCard({ p }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{p.program_name}</CardTitle>
        <div className="text-sm text-slate-600">{p.institution} • {p.city}, {p.country}</div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge><span className="inline-flex items-center gap-1"><GraduationCap className="h-3 w-3"/>{p.level}</span></Badge>
          <Badge><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3"/>{p.field}</span></Badge>
          {p.scholarships && <Badge>Scholarships</Badge>}
        </div>
        <div className="text-sm">Tuition: <strong>{currency(p.tuition_per_year)}/year</strong></div>
        <div className="text-sm">Intakes: {p.intake_months.join(", ")}</div>
        <div className="text-sm">Language: {p.language}</div>
        <div className="text-xs text-slate-500">Last updated: {p.last_updated}</div>
        <div className="mt-auto flex gap-2 pt-2">
          <Button className="bg-black text-white" onClick={()=>setOpen(true)}>Apply</Button>
          <a href={p.application_link} className="flex-1"><Button className="w-full">Details</Button></a>
        </div>
      </CardContent>
      <Dialog open={open} onClose={()=>setOpen(false)}>
        <div className="px-2 pb-6">
          <h3 className="mb-4 text-xl font-semibold">Apply – {p.program_name}</h3>
          <QuickApplyForm preset={{ program_name: p.program_name, institution: p.institution, country: p.country }} onDone={()=>setOpen(false)} />
        </div>
      </Dialog>
    </Card>
  );
}

// ---------- QUICK APPLY FORM ----------
function QuickApplyForm({ preset, onDone }) {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true); setErr(""); setOk(false);

    try {
      let uploadedUrl = null;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch(FILE_UPLOAD_ENDPOINT, { method: "POST", body: fd });
        if (!up.ok) throw new Error("Upload failed");
        const js = await up.json();
        uploadedUrl = js.url || null;
      }

      const data = Object.fromEntries(new FormData(e.currentTarget));
      const payload = { ...data, uploaded_docs: uploadedUrl, source_page: window.location.href, submitted_at: new Date().toISOString() };
      if (!HUBSPOT_WEBHOOK_URL) { console.warn("No webhook set; printing payload", payload); }
      const r = await fetch(HUBSPOT_WEBHOOK_URL || "/__debug", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error("Submit failed");
      setOk(true);
      e.currentTarget.reset();
      setFile(null);
      onDone && onDone();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input name="name" placeholder="Full name" required />
        <Input type="email" name="email" placeholder="Email" required />
        <Input name="phone" placeholder="Phone/WhatsApp" />
        <select name="level" className="w-full rounded-xl border px-3 py-2 text-sm" defaultValue={preset?.level || ""}>
          <option value="">Target level</option>
          <option>Undergraduate</option>
          <option>Postgraduate</option>
          <option>Diploma/Certificate</option>
        </select>
        <Input name="field" placeholder="Field of study" defaultValue={preset?.field || ""} />
        <Input name="country" placeholder="Target country" defaultValue={preset?.country || ""} />
        <Input name="program_name" placeholder="Program (optional)" defaultValue={preset?.program_name || ""} />
        <Input name="institution" placeholder="Institution (optional)" defaultValue={preset?.institution || ""} />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input name="budget" placeholder="Budget per year (€)" />
        <Input name="start_term" placeholder="Preferred intake (e.g., Sept 2026)" />
        <Input name="english_score" placeholder="IELTS/TOEFL score (if any)" />
      </div>
      <Textarea name="notes" placeholder="Tell us anything important (gaps, visas, scholarships)" />
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <Upload className="h-4 w-4" /> <span>Upload transcript/IELTS (optional)</span>
      </label>
      <Input type="file" onChange={e=>setFile(e.target.files?.[0])} />
      <div className="text-xs text-slate-500">By submitting you consent to processing your data for admissions guidance. See our Privacy Policy.</div>
      <div className="flex items-center gap-3">
        <Button type="submit" className="bg-black text-white" disabled={submitting}>{submitting ? "Submitting…" : "Submit"}</Button>
        {ok && <span className="text-sm text-emerald-600">Thanks! We'll contact you shortly.</span>}
        {err && <span className="text-sm text-red-600">{err}</span>}
      </div>
    </form>
  );
}

// ---------- OTHER SECTIONS ----------
function HowToApply() {
  const steps = [
    { t: "Profile & Goals", d: "Tell us your background, budget, and timeline." },
    { t: "Shortlist Programs", d: "We match you to eligible programs and scholarships." },
    { t: "Documents & Application", d: "We prepare and submit your applications." },
    { t: "Offer & Visa", d: "Accept offer, pay fees, and complete visa." },
    { t: "Accommodation & Flight", d: "We help you land smoothly and settle in." },
  ];
  return (
    <Section id="howto" title="How to Apply" bg="bg-white">
      <div className="grid gap-4 md:grid-cols-5">
        {steps.map((s, i) => (
          <Card key={i}><CardHeader><CardTitle>{i+1}. {s.t}</CardTitle></CardHeader><CardContent className="text-sm text-slate-600">{s.d}</CardContent></Card>
        ))}
      </div>
    </Section>
  );
}

function Destinations() {
  const dests = [
    { c: "Latvia", blurb: "Tech-friendly, affordable tuition, Schengen." },
    { c: "Lithuania", blurb: "Strong business programs, modern campuses." },
    { c: "Poland", blurb: "Wide program choice, budget-friendly." },
  ];
  return (
    <Section id="destinations" title="Top Destinations" bg="bg-card">
      <div className="grid gap-4 md:grid-cols-3">
        {dests.map(d => (
          <Card key={d.c}><CardHeader><CardTitle>{d.c}</CardTitle></CardHeader><CardContent className="text-sm text-slate-600">{d.blurb}</CardContent></Card>
        ))}
      </div>
    </Section>
  );
}

function Services() {
  const items = [
    { t: "Admissions Coaching", d: "Eligibility check, shortlisting, SOP review." },
    { t: "Application Handling", d: "Submit to universities with zero guesswork." },
    { t: "Visa Support", d: "Document checklist and prep for interviews." },
    { t: "Accommodation & Arrival", d: "Housing, airport pickup, bank account." },
  ];
  return (
    <Section id="services" title="Services" bg="bg-white">
      <div className="grid gap-4 md:grid-cols-4">
        {items.map(i => (
          <Card key={i.t}><CardHeader><CardTitle>{i.t}</CardTitle></CardHeader><CardContent className="text-sm text-slate-600">{i.d}</CardContent></Card>
        ))}
      </div>
    </Section>
  );
}

function Testimonials() {
  const t = [
    { n: "Aisha", q: "Got my Latvia admit in 4 weeks. Super clear process." },
    { n: "Rahul", q: "They fixed my document gaps and I still got an offer." },
    { n: "Diana", q: "Visa support was the game-changer for me." },
  ];
  return (
    <Section id="testimonials" title="What students say" bg="bg-slate-50">
      <div className="grid gap-4 md:grid-cols-3">
        {t.map(x => (
          <Card key={x.n}><CardContent className="p-6"><p className="mb-3 text-slate-700">“{x.q}”</p><div className="text-sm font-semibold">{x.n}</div></CardContent></Card>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  return (
    <>
      {/* Volunteers */}
      <section id="volunteers" className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-3xl font-bold text-text">Become a Volunteer</h2>
          <p className="mb-4 text-sm text-text/70">
            Already studying abroad? Help new students with airport pickup, accommodation, and settling in — free or paid.
          </p>

          <form
            action="mailto:sanjaybolla@gmail.com"
            method="post"
            encType="text/plain"
            className="grid gap-3"
          >
            <input name="name" placeholder="Full name" className="rounded-xl border border-border px-3 py-2" required />
            <div className="grid gap-3 md:grid-cols-2">
              <input name="country" placeholder="Country" className="rounded-xl border border-border px-3 py-2" required />
              <input name="city" placeholder="City" className="rounded-xl border border-border px-3 py-2" required />
            </div>
            <input name="whatsapp" placeholder="WhatsApp number" className="rounded-xl border border-border px-3 py-2" required />
            <input name="email" type="email" placeholder="Email" className="rounded-xl border border-border px-3 py-2" />
            <select name="type" className="rounded-xl border border-border px-3 py-2" required>
              <option value="">Free or Paid?</option>
              <option>Free</option>
              <option>Paid</option>
            </select>
            <input name="hourly_rate" placeholder="Hourly rate (€) if paid" className="rounded-xl border border-border px-3 py-2" />
            <input name="services" placeholder="Services (comma separated)" className="rounded-xl border border-border px-3 py-2" />
            <textarea name="bio" placeholder="Short description (optional)" className="rounded-xl border border-border px-3 py-2" />
            <button className="rounded-2xl bg-olive px-4 py-2 text-white hover:bg-olivedk">Submit</button>
          </form>

          <p className="mt-4 text-xs text-text/60">
            Prefer WhatsApp? Message us at +371 25722769 with your city and services.
          </p>
        </div>
      </section>

      {/* Contact */}
      <Section id="contact" title="Talk to us" bg="bg-white">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Book a call
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div id="book" className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  title="Calendly"
                  src={CALENDLY_INLINE_URL}
                  className="h-full w-full"
                  frameBorder="0"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <Mail className="h-5 w-5" /> Message us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const data = Object.fromEntries(new FormData(e.currentTarget));
                  await fetch(HUBSPOT_WEBHOOK_URL || "/__debug", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      ...data,
                      form: "contact",
                      source_page: window.location.href,
                    }),
                  });
                  e.currentTarget.reset();
                  alert("Thanks! We'll reply soon.");
                }}
              >
                <Input name="name" placeholder="Name" required />
                <Input type="email" name="email" placeholder="Email" required />
                <Input name="phone" placeholder="Phone/WhatsApp" />
                <Textarea name="message" placeholder="How can we help?" required />
                <Button className="bg-olive hover:bg-olivedk text-white" type="submit">
                  Send
                </Button>
              </form>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Phone className="h-4 w-4" /> +371 25722769
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}


function Footer() {
  return (
    <footer className="border-border-t bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <div className="text-sm text-slate-600">© {new Date().getFullYear()} WeGuideAbroad. All rights reserved.</div>
        <div className="flex gap-4 text-sm">
          <a href="#privacy" className="hover:underline">Privacy</a>
          <a href="#terms" className="hover:underline">Terms</a>
        </div>
      </div>
    </footer>
  );
}

function ChatWidget() {
  useEffect(()=>{
    if (!CHAT_WIDGET_SCRIPT) return;
    const s = document.createElement("script");
    s.innerHTML = CHAT_WIDGET_SCRIPT;
    document.body.appendChild(s);
    return ()=>{ document.body.removeChild(s); };
  },[]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen scroll-smooth bg-white text-text">
      <ChatWidget />
      <NavBar />
      <Hero />
      <Section id="programs" title="Explore Programs" bg="bg-white">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">{PROGRAMS.length} programs</div>
        </div>
        <ProgramSearch />
      </Section>
      <HowToApply />
      <Destinations />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
