import { useState, useEffect } from "react";
import API from './api';
import AuthPage from './Authpage';

// ─── PALETTE & CONSTANTS ────────────────────────────────────────────────────
const WHATSAPP_NUMBER = "2347034673942"; // ← replace with real number
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20GAM%20MUIZ%20CONCEPTS%2C%20I%20need%20assistance.`;
// const API = "http://localhost:5000/api";
const getCategoryFromId = (id) => {
  if (!id) return "other";
  const prefix = id.slice(0, 2);
  if (prefix === "ol") return "olevel";
  if (prefix === "st") return "state";
  if (prefix === "jb") return "jamb";
  if (prefix === "al") return "alevel";
  return "other";
};
const SERVICES = {
  olevel: {
    label: "O'Level Services",
    icon: "📋",
    color: "#16a34a",
    items: [
      { id: "ol1", title: "WAEC Scratch Card / Result Checker", desc: "Get your WAEC result checker pin quickly and securely.", price: "₦500" },
      { id: "ol2", title: "NECO Token", desc: "Obtain your NECO token for result checking.", price: "₦400" },
      { id: "ol3", title: "NABTEB Checker", desc: "NABTEB result checking token delivered promptly.", price: "₦400" },
      { id: "ol4", title: "NBAIS Checker", desc: "Access your NBAIS result checker with ease.", price: "₦400" },
      { id: "ol5", title: "WAEC Verification PIN", desc: "Official WAEC result verification for institutions.", price: "Contact" },
      { id: "ol6", title: "NECO e-Verification", desc: "Electronic verification of your NECO results.", price: "Contact" },
      { id: "ol7", title: "Certificate Processing", desc: "Full processing assistance for your certificates.", price: "Contact" },
      { id: "ol8", title: "Result Checking Assistance", desc: "Step-by-step help checking your results online.", price: "Free" },
    ],
  },
  state: {
    label: "State of Origin & Birth Certificates",
    icon: "🏛️",
    color: "#0d9488",
    items: [
      { id: "st1", title: "State of Origin Certificate (North West)", desc: "Kano, Kaduna, Katsina, Zamfara, Sokoto, Kebbi, Jigawa.", price: "Contact" },
      { id: "st2", title: "State of Origin Certificate (North East)", desc: "Borno, Yobe, Bauchi, Gombe, Adamawa, Taraba.", price: "Contact" },
      { id: "st3", title: "State of Origin Certificate (North Central)", desc: "FCT, Niger, Kogi, Benue, Plateau, Nasarawa, Kwara.", price: "Contact" },
      { id: "st4", title: "State of Origin Certificate (South West)", desc: "Lagos, Ogun, Oyo, Osun, Ekiti, Ondo.", price: "Contact" },
      { id: "st5", title: "State of Origin Certificate (South East)", desc: "Enugu, Anambra, Imo, Abia, Ebonyi.", price: "Contact" },
      { id: "st6", title: "State of Origin Certificate (South South)", desc: "Rivers, Delta, Edo, Bayelsa, Akwa Ibom, Cross River.", price: "Contact" },
      { id: "st7", title: "Birth Certificate Processing", desc: "Official birth certificate from National Population Commission.", price: "Contact" },
    ],
  },
  jamb: {
    label: "JAMB Services",
    icon: "🎓",
    color: "#2563eb",
    items: [
      { id: "jb1", title: "Direct Entry e-PIN", desc: "Get your JAMB Direct Entry e-PIN for higher institutions.", price: "Contact" },
      { id: "jb2", title: "Result Printing", desc: "Print your JAMB result slip easily.", price: "₦200" },
      { id: "jb3", title: "Admission Letter", desc: "Download and print your JAMB admission letter.", price: "₦200" },
      { id: "jb4", title: "Reprinting Services", desc: "Reprint exam slips, result slips and related documents.", price: "₦200" },
      { id: "jb5", title: "Profile Code Retrieval", desc: "Retrieve lost or forgotten JAMB profile code.", price: "₦500" },
      { id: "jb6", title: "Reg Number Retrieval", desc: "Recover your JAMB registration number.", price: "₦500" },
      { id: "jb7", title: "Matriculation List Fix", desc: "Resolve issues with your name on matriculation list.", price: "Contact" },
    ],
  },
  alevel: {
    label: "A'Level Services",
    icon: "🏫",
    color: "#7c3aed",
    items: [
      { id: "al1", title: "IJMB Registration", desc: "Interim Joint Matriculation Board registration assistance.", price: "Contact" },
      { id: "al2", title: "JUPEB Registration", desc: "Joint Universities Preliminary Examinations Board.", price: "Contact" },
      { id: "al3", title: "Diploma Programmes", desc: "Diploma course registration and processing.", price: "Contact" },
      { id: "al4", title: "Cambridge Exams", desc: "Cambridge A-Level and related exam registration.", price: "Contact" },
      { id: "al5", title: "IELTS / TOEFL / SAT / GRE", desc: "International exams registration and preparation guidance.", price: "Contact" },
    ],
  },
  other: {
    label: "Other Services",
    icon: "⚡",
    color: "#ea580c",
    items: [
      { id: "ot1", title: "Post-UTME Form Filling", desc: "Accurate, stress-free Post-UTME form completion.", price: "₦1,000" },
      { id: "ot2", title: "Educational Consultation", desc: "One-on-one expert guidance on your educational journey.", price: "₦2,000" },
      { id: "ot3", title: "Admission Processing", desc: "Full admission processing and followup for universities.", price: "Contact" },
      { id: "ot4", title: "NIN Services", desc: "NIN enrollment linkage and related services.", price: "Contact" },
    ],
  },
};

const ALL_SERVICES = Object.entries(SERVICES).flatMap(([cat, { items }]) =>
  items.map((s) => ({ ...s, category: cat }))
);

// ─── ICONS ──────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    whatsapp: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>,
    shield: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    grid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  };

  return icons[name] || null;
};

// ─── SHARED COMPONENTS ──────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const map = { Pending: ["#fef3c7", "#92400e"], "In Progress": ["#dbeafe", "#1e40af"], Completed: ["#dcfce7", "#166534"] };
  const [bg, color] = map[status] || ["#f3f4f6", "#374151"];
  return <span style={{ background: bg, color, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{status}</span>;
};

const WhatsAppFloat = () => (
  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
    style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, background: "#25d366", color: "#fff", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,0.5)", transition: "transform .2s, box-shadow .2s", textDecoration: "none" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(37,211,102,0.6)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,0.5)"; }}>
    <Icon name="whatsapp" size={28} />
  </a>
);

// ─── SERVICE CARD ────────────────────────────────────────────────────────────
const ServiceCard = ({ service, catColor, onRequest, compact }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${hov ? catColor : "#e5e7eb"}`, padding: compact ? "16px" : "22px", display: "flex", flexDirection: "column", gap: 10, transition: "border .18s, box-shadow .18s, transform .18s", boxShadow: hov ? `0 8px 30px ${catColor}22` : "0 2px 8px rgba(0,0,0,.06)", transform: hov ? "translateY(-3px)" : "none", cursor: "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: compact ? 14 : 15, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.35 }}>{service.title}</h3>
        <span style={{ background: catColor + "18", color: catColor, borderRadius: 6, padding: "2px 9px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>{service.price}</span>
      </div>
      {!compact && <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.55 }}>{service.desc}</p>}
      <button onClick={() => onRequest(service)}
        style={{ marginTop: "auto", background: catColor, color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, justifyContent: "center", transition: "opacity .15s" }}
        onMouseEnter={e => e.currentTarget.style.opacity = ".85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
        Request Service <Icon name="arrow" size={14} />
      </button>
    </div>
  );
};

// ─── REQUEST MODAL ──────────────────────────────────────────────────────────
const RequestModal = ({ service, onClose, onSubmit }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", details: "" });
  const [submitted, setSubmitted] = useState(false);
  const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = () => {
    if (!form.name || !form.phone) return alert("Name and phone are required.");
    onSubmit({ ...form, service: service.title, serviceId: service.id, status: "Pending", date: new Date().toISOString() });
    setSubmitted(true);
  };
  const inp = { width: "100%", padding: "11px 13px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#f9fafb" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: 18, padding: "28px 24px", width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto" }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#16a34a", margin: "0 0 8px" }}>Request Sent!</h2>
            <p style={{ color: "#6b7280", fontSize: 14 }}>We'll contact you via WhatsApp or phone within 24 hours.</p>
            <button onClick={onClose} style={{ marginTop: 18, background: "#16a34a", color: "#fff", border: "none", borderRadius: 9, padding: "11px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>Request Service</h2>
              <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="close" size={16} /></button>
            </div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", marginBottom: 18 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#15803d" }}>📌 {service.title}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Full Name *</label>
                <input style={inp} placeholder="e.g. Aminu Ibrahim" value={form.name} onChange={up("name")} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Phone Number *</label>
                <input style={inp} placeholder="e.g. 08012345678" value={form.phone} onChange={up("phone")} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Email Address</label>
                <input style={inp} placeholder="optional" value={form.email} onChange={up("email")} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>Additional Details</label>
                <textarea style={{ ...inp, height: 90, resize: "vertical" }} placeholder="Any extra info we should know..." value={form.details} onChange={up("details")} />
              </div>
              <button onClick={submit} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4 }}>
                Submit Request
              </button>
              {/* <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25d366", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
                <Icon name="whatsapp" size={18} /> Chat on WhatsApp Instead
              </a> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
const Navbar = ({ page, setPage, user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const links = [{ id: "home", label: "Home" }, { id: "services", label: "Services" }, { id: "contact", label: "Contact" }];
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 900, background: "rgba(255,255,255,.97)", backdropFilter: "blur(10px)", borderBottom: "1.5px solid #e5e7eb", padding: "0 20px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <img 
    src="/Gam logo.png" 
    alt="GAM MUIZ CONCEPTS Logo" 
    style={{ 
      width: 90, 
      height: 50, 
      borderRadius: 9,
      objectFit: "contain"
    }} 
  />
        </button>
        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)}
              style={{ background: page === l.id ? "#f0fdf4" : "none", color: page === l.id ? "#16a34a" : "#374151", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              {l.label}
            </button>
          ))}
          {user ? (
            <>
              <button onClick={() => setPage(user.role === "admin" ? "admin" : "dashboard")}
                style={{ background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}>
                <Icon name="user" size={15} /> {user.role === "admin" ? "Admin" : "My Requests"}
              </button>
              <button onClick={onLogout} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", padding: "7px 8px", display: "flex", alignItems: "center" }}>
                <Icon name="logout" size={18} />
              </button>
            </>
          ) : (
            <button onClick={() => setPage("login")}
              style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 9, padding: "8px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Login
            </button>
          )}
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setOpen(o => !o)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 4 }} className="hamburger">
          <Icon name={open ? "close" : "menu"} size={24} />
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div style={{ borderTop: "1px solid #e5e7eb", padding: "12px 0 16px", display: "flex", flexDirection: "column", gap: 4 }} className="mobile-menu">
          {links.map(l => (
            <button key={l.id} onClick={() => { setPage(l.id); setOpen(false); }}
              style={{ background: page === l.id ? "#f0fdf4" : "none", color: page === l.id ? "#16a34a" : "#374151", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 600, fontSize: 15, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
              {l.label}
            </button>
          ))}
          {user ? (
            <>
              <button onClick={() => { setPage(user.role === "admin" ? "admin" : "dashboard"); setOpen(false); }}
                style={{ background: "#f0fdf4", color: "#16a34a", border: "none", borderRadius: 8, padding: "10px 16px", fontWeight: 600, fontSize: 15, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                {user.role === "admin" ? "Admin Dashboard" : "My Requests"}
              </button>
              <button onClick={() => { onLogout(); setOpen(false); }}
                style={{ background: "none", border: "none", color: "#ef4444", padding: "10px 16px", fontWeight: 600, fontSize: 15, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => { setPage("login"); setOpen(false); }}
              style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 9, padding: "10px 16px", fontWeight: 700, fontSize: 15, cursor: "pointer", margin: "4px 8px", fontFamily: "inherit" }}>
              Login / Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

// ─── HOME PAGE ───────────────────────────────────────────────────────────────
const HomePage = ({ setPage, onRequest }) => {
  const stats = [{ n: "5,000+", l: "Students Served" }, { n: "99%", l: "Success Rate" }, { n: "24/7", l: "Support Available" }, { n: "30+", l: "Services Offered" }];
  const features = [
    { icon: "⚡", title: "Fast & Reliable", desc: "Most services completed within 24 hours. We value your time." },
    { icon: "🔒", title: "Secure & Trusted", desc: "Your data and documents are handled with utmost confidentiality." },
    { icon: "💬", title: "Always Available", desc: "Reach us on WhatsApp anytime. Real humans, real answers." },
    { icon: "💰", title: "Affordable Prices", desc: "Transparent pricing with no hidden charges. Value for your money." },
  ];
  const testimonials = [
    { name: "Fatima A.", loc: "Kano", text: "They helped me sort my WAEC result checker in minutes. Very professional!", rating: 5 },
    { name: "Emeka O.", loc: "Enugu", text: "Got my JAMB admission letter printed same day. Excellent service!", rating: 5 },
    { name: "Hauwa M.", loc: "Kaduna", text: "State of origin certificate was ready in 3 days. Highly recommended.", rating: 5 },
  ];
  const topServices = ["WAEC Scratch Card", "JAMB Result Printing", "Post-UTME Form Filling", "NECO Token", "Admission Letter", "NIN Services"];
  return (
    <div>
      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg,#052e16 0%,#14532d 40%,#166534 100%)", color: "#fff", padding: "72px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%,rgba(255,255,255,.05) 0%,transparent 60%),radial-gradient(circle at 80% 20%,rgba(255,255,255,.05) 0%,transparent 50%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,.12)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 30, padding: "5px 18px", fontSize: 13, fontWeight: 600, marginBottom: 22, letterSpacing: ".5px" }}>🇳🇬 Nigeria's Trusted Educational Partner</div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(28px,5vw,50px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.15, letterSpacing: "-1px" }}>
            GAM MUIZ <span style={{ color: "#4ade80" }}>CONCEPTS</span>
          </h1>
          <p style={{ fontSize: "clamp(16px,2.5vw,20px)", color: "#bbf7d0", margin: "0 0 10px", fontWeight: 500, fontStyle: "italic" }}>"Reliable assistance. Proper guidance. No confusion."</p>
          <p style={{ fontSize: 15, color: "#86efac", margin: "0 0 36px", lineHeight: 1.6 }}>Your one-stop solution for all educational and academic services in Nigeria — from O'Level to university admission and beyond.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("services")}
              style={{ background: "#4ade80", color: "#052e16", border: "none", borderRadius: 11, padding: "14px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: "0 4px 20px rgba(74,222,128,.4)" }}>
              View All Services →
            </button>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
              style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,.25)", borderRadius: 11, padding: "14px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="whatsapp" size={18} /> Chat With Us
            </a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "#f0fdf4", borderBottom: "1px solid #dcfce7" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16, textAlign: "center" }}>
          {stats.map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 30, fontWeight: 900, color: "#16a34a" }}>{s.n}</div>
              <div style={{ fontSize: 13, color: "#4b5563", fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR SERVICES */}
      <section style={{ padding: "52px 20px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(22px,3.5vw,32px)", fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Popular Services</h2>
          <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>Quick access to our most requested services</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
          {topServices.map(s => {
            const found = ALL_SERVICES.find(a => a.title.includes(s));
            const cat = found ? SERVICES[found.category] : null;
            return (
              <button key={s} onClick={() => found && onRequest(found)}
                style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "16px 14px", textAlign: "center", cursor: "pointer", fontFamily: "inherit", transition: "border .15s, box-shadow .15s", color: "#111827" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat?.color || "#16a34a"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{cat?.icon || "📌"}</div>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}>{s}</div>
              </button>
            );
          })}
        </div>
        <div style={{ textAlign: "center" }}>
          <button onClick={() => setPage("services")} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            View All 30+ Services →
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#f9fafb", padding: "52px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(22px,3.5vw,30px)", fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Why Choose Us?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "52px 20px", maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(22px,3.5vw,30px)", fontWeight: 800, color: "#111827", textAlign: "center", marginBottom: 32 }}>What Students Say</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
          {testimonials.map(t => (
            <div key={t.name} style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                {[...Array(t.rating)].map((_, i) => <span key={i} style={{ color: "#fbbf24" }}><Icon name="star" size={15} /></span>)}
              </div>
              <p style={{ fontSize: 14, color: "#374151", margin: "0 0 14px", lineHeight: 1.6, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{t.name} <span style={{ color: "#9ca3af", fontWeight: 400 }}>— {t.loc}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", padding: "48px 20px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>Ready to Get Started?</h2>
        <p style={{ color: "#bbf7d0", fontSize: 15, margin: "0 0 24px" }}>Contact us today — no stress, no confusion. Just results.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("services")} style={{ background: "#fff", color: "#16a34a", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Browse Services</button>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" style={{ background: "#25d366", color: "#fff", borderRadius: 10, padding: "12px 24px", fontWeight: 700, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7 }}>
            <Icon name="whatsapp" size={16} /> WhatsApp Us Now
          </a>
        </div>
      </section>
    </div>
  );
};

// ─── SERVICES PAGE ───────────────────────────────────────────────────────────
const ServicesPage = ({ onRequest }) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const cats = [{ id: "all", label: "All Services" }, ...Object.entries(SERVICES).map(([id, { label, icon }]) => ({ id, label: icon + " " + label }))];
  const filtered = ALL_SERVICES.filter(s => {
    const matchCat = activeTab === "all" || s.category === activeTab;
    const matchQ = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });
  const grouped = Object.entries(SERVICES).filter(([id]) => activeTab === "all" || activeTab === id);
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 20px 60px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Our Services</h1>
        <p style={{ color: "#6b7280", margin: 0, fontSize: 15 }}>Browse and request from our full range of educational services.</p>
      </div>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 420 }}>
        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}><Icon name="search" size={18} /></span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..."
          style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>
      {/* Category tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => { setActiveTab(c.id); setSearch(""); }}
            style={{ background: activeTab === c.id ? "#16a34a" : "#f3f4f6", color: activeTab === c.id ? "#fff" : "#374151", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "background .15s" }}>
            {c.label}
          </button>
        ))}
      </div>
      {/* Results */}
      {search ? (
        <div>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16 }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
            {filtered.map(s => <ServiceCard key={s.id} service={s} catColor={SERVICES[s.category].color} onRequest={onRequest} />)}
          </div>
          {!filtered.length && <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}><p style={{ fontSize: 40, margin: "0 0 12px" }}>🔍</p><p>No services found. Try a different search.</p></div>}
        </div>
      ) : (
        grouped.map(([catId, cat]) => (
          <section key={catId} style={{ marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 12, borderBottom: `2px solid ${cat.color}22` }}>
              <span style={{ fontSize: 24 }}>{cat.icon}</span>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(17px,2.5vw,22px)", fontWeight: 800, color: "#111827", margin: 0 }}>{cat.label}</h2>
              <span style={{ background: cat.color + "18", color: cat.color, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{cat.items.length} services</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
              {cat.items.map(s => <ServiceCard key={s.id} service={s} catColor={cat.color} onRequest={onRequest} />)}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

// ─── CONTACT PAGE ────────────────────────────────────────────────────────────
const ContactPage = () => (
  <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 60px" }}>
    <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(22px,4vw,34px)", fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Contact Us</h1>
    <p style={{ color: "#6b7280", margin: "0 0 32px", fontSize: 15 }}>We're here to help. Reach us through any of these channels.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 32 }}>
      {[
        { icon: "whatsapp", label: "WhatsApp", val: "+234 703 467 3942", href: WHATSAPP_URL, color: "#25d366", bg: "#f0fdf4" },
        { icon: "phone", label: "Call / SMS", val: "+234 703 467 3942", href: "tel:+2348000000000", color: "#2563eb", bg: "#eff6ff" },
        { icon: "mail", label: "Email", val: "gammuiz52@gmail.com", href: "mailto:gammuiz52@gmail.com", color: "#7c3aed", bg: "#faf5ff" },
      ].map(c => (
        <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
          style={{ background: c.bg, borderRadius: 14, padding: "22px 20px", textDecoration: "none", border: `1.5px solid ${c.color}30`, display: "flex", alignItems: "center", gap: 14, transition: "box-shadow .15s" }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 20px ${c.color}30`}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
          <div style={{ background: c.color, color: "#fff", width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={c.icon} size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{c.label}</div>
            <div style={{ color: "#6b7280", fontSize: 13 }}>{c.val}</div>
          </div>
        </a>
      ))}
    </div>
    {/* Hours */}
    <div style={{ background: "#f9fafb", borderRadius: 14, padding: "22px 20px", border: "1px solid #e5e7eb", marginBottom: 24 }}>
      <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, color: "#111827", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="clock" size={18} /> Business Hours
      </h3>
      {[["Monday – Friday", "8:00 AM – 6:00 PM"], ["Saturday", "9:00 AM – 3:00 PM"], ["Sunday / Public Holidays", "WhatsApp only"]].map(([d, t]) => (
        <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e5e7eb", fontSize: 14 }}>
          <span style={{ color: "#374151" }}>{d}</span>
          <span style={{ color: "#16a34a", fontWeight: 600 }}>{t}</span>
        </div>
      ))}
    </div>
    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#25d366", color: "#fff", borderRadius: 12, padding: "16px", fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,.4)" }}>
      <Icon name="whatsapp" size={22} /> Start a WhatsApp Chat
    </a>
  </div>
);

// ─── USER DASHBOARD ──────────────────────────────────────────────────────────
const UserDashboard = ({ user, requests, setPage }) => {
  const myReqs = requests.filter((r) => 
  r.userEmail?.toLowerCase() === user.email?.toLowerCase()
);
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "#111827", margin: "0 0 4px" }}>My Requests</h1>
          <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>Hello, {user.name}! Track your service requests here.</p>
        </div>
        <button onClick={() => setPage("services")} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          + New Request
        </button>
      </div>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 28 }}>
        {[{ label: "Total", val: myReqs.length, color: "#111827", bg: "#f9fafb" },
          { label: "Pending", val: myReqs.filter(r => r.status === "Pending").length, color: "#92400e", bg: "#fef3c7" },
          { label: "In Progress", val: myReqs.filter(r => r.status === "In Progress").length, color: "#1e40af", bg: "#dbeafe" },
          { label: "Completed", val: myReqs.filter(r => r.status === "Completed").length, color: "#166534", bg: "#dcfce7" }].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</div>
          </div>
        ))}
      </div>
      {myReqs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <p style={{ fontSize: 16, marginBottom: 16 }}>No requests yet.</p>
          <button onClick={() => setPage("services")} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Browse Services</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myReqs.map((r, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#111827", fontSize: 15, marginBottom: 4 }}>{r.service}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {r.createdAt || r.date 
                    ? new Date(r.createdAt || r.date).toLocaleDateString("en-NG", { dateStyle: "medium" })
                    : "Date unavailable"}
                </div>
                {r.details && <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{r.details.slice(0, 60)}{r.details.length > 60 ? "…" : ""}</div>}
              </div>
              <Badge status={r.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
const AdminDashboard = ({ requests, onUpdateStatus, onDelete }) => {
  const [filter, setFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("requests");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await API.get("/auth/users");
        setUsers(res.data);
      } catch (err) {
        console.log("Could not load users:", err.message);
      }
    };
    loadUsers();
  }, []);

  const statuses = ["All", "Pending", "In Progress", "Completed"];
  const shown = requests.filter(r => {
    const matchStat = filter === "All" || r.status === filter;
    const matchCat = catFilter === "all" || r.category === catFilter;
    return matchStat && matchCat;
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>

      {/* TITLE */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(20px,4vw,28px)", fontWeight: 900, color: "#111827", margin: "0 0 4px" }}>Admin Dashboard</h1>
        <p style={{ color: "#6b7280", margin: 0, fontSize: 14 }}>Manage all service requests from students.</p>
      </div>

      {/* TAB BUTTONS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab("requests")}
          style={{ background: activeTab === "requests" ? "#16a34a" : "#f3f4f6", color: activeTab === "requests" ? "#fff" : "#374151", border: "none", borderRadius: 9, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
        >
          📋 Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          style={{ background: activeTab === "users" ? "#16a34a" : "#f3f4f6", color: activeTab === "users" ? "#fff" : "#374151", border: "none", borderRadius: 9, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
        >
          👥 Users ({users.length})
        </button>
      </div>

      {/* REQUESTS TAB */}
      {activeTab === "requests" ? (
        <div>
          {/* SUMMARY CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Total", val: requests.length, color: "#111827", bg: "#f9fafb" },
              { label: "Pending", val: requests.filter(r => r.status === "Pending").length, color: "#92400e", bg: "#fef3c7" },
              { label: "In Progress", val: requests.filter(r => r.status === "In Progress").length, color: "#1e40af", bg: "#dbeafe" },
              { label: "Completed", val: requests.filter(r => r.status === "Completed").length, color: "#166534", bg: "#dcfce7" },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Plus Jakarta Sans',sans-serif", color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{ background: filter === s ? "#111827" : "#f3f4f6", color: filter === s ? "#fff" : "#374151", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >
                {s}
              </button>
            ))}
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e5e7eb", fontSize: 13, fontFamily: "inherit", cursor: "pointer", background: "#f3f4f6" }}
            >
              <option value="all">All Categories</option>
              {Object.entries(SERVICES).map(([id, { label }]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>

          {/* REQUESTS LIST */}
          {shown.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p>No requests found.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {shown.map((r, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#111827", fontSize: 15 }}>{r.service}</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{r.name} · {r.phone} {r.email ? "· " + r.email : ""}</div>
                      {r.details && <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>{r.details}</div>}
                      <div style={{ fontSize: 12, color: "#d1d5db", marginTop: 4 }}>
                        {r.createdAt || r.date
                          ? new Date(r.createdAt || r.date).toLocaleString("en-NG")
                          : "Date unavailable"}
                      </div>
                    </div>
                    <Badge status={r.status} />
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {["Pending", "In Progress", "Completed"].map((s) => (
                      <button
                        key={s}
                        onClick={() => onUpdateStatus(i, s)}
                        disabled={r.status === s}
                        style={{ background: r.status === s ? "#f3f4f6" : "#fff", color: r.status === s ? "#9ca3af" : "#374151", border: "1.5px solid #e5e7eb", borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: r.status === s ? "default" : "pointer", fontFamily: "inherit" }}
                      >
                        {s}
                      </button>
                    ))}
                    
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20${encodeURIComponent(r.name)}%2C%20regarding%20your%20${encodeURIComponent(r.service)}%20request.`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ background: "#25d366", color: "#fff", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}
                    <a href="">
                      <Icon name="whatsapp" size={13} /> Reply
                    </a>
                    <button
                      onClick={() => onDelete(i)}
                      style={{ background: "#fef2f2", color: "#dc2626", border: "1.5px solid #fecaca", borderRadius: 7, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#fee2e2"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "#fef2f2"}
                    >
                      <Icon name="trash" size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      ) : (

        // USERS TAB
        <div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, fontWeight: 800, color: "#111827", marginBottom: 16 }}>
            Registered Users
          </h2>
          {users.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
              <p>No users registered yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {users.map((u, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#111827", fontSize: 15 }}>{u.name}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{u.email}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                      Joined: {new Date(u.createdAt).toLocaleDateString("en-NG", { dateStyle: "medium" })}
                    </div>
                  </div>
                  <span style={{ background: u.role === "admin" ? "#dbeafe" : "#f0fdf4", color: u.role === "admin" ? "#1e40af" : "#16a34a", borderRadius: 999, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
                    {u.role === "admin" ? "Admin" : "User"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────────────
const Footer = ({ setPage }) => (
  <footer style={{ background: "#052e16", color: "#86efac", padding: "40px 20px 24px" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 28, marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: 18, color: "#fff", marginBottom: 8 }}>GAM MUIZ CONCEPTS</div>
          <p style={{ fontSize: 13, color: "#4ade80", lineHeight: 1.7, margin: "0 0 14px" }}>Reliable assistance. Proper guidance. No confusion.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#25d366", color: "#fff", borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            <Icon name="whatsapp" size={16} /> Chat Now
          </a>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontSize: 14 }}>Quick Links</div>
          {["Home", "Services", "Contact"].map(l => (
            <button key={l} onClick={() => setPage(l.toLowerCase())}
              style={{ display: "block", background: "none", border: "none", color: "#86efac", fontSize: 13, padding: "4px 0", cursor: "pointer", fontFamily: "inherit" }}>
              {l}
            </button>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontSize: 14 }}>Services</div>
          {["O'Level Services", "JAMB Services", "A'Level Services", "State Certificates", "Other Services"].map(s => (
            <div key={s} style={{ fontSize: 13, color: "#86efac", padding: "3px 0" }}>{s}</div>
          ))}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontSize: 14 }}>Contact</div>
          <div style={{ fontSize: 13, color: "#86efac", lineHeight: 1.8 }}>
            <div>📱 +234 703 467 3942</div>
            <div>📧 gammuiz52@gmail.com</div>
            <div>⏰ Mon–Fri: 8AM – 6PM</div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, fontSize: 12, color: "#4ade80" }}>
        <span>© {new Date().getFullYear()} GAM MUIZ CONCEPTS. All rights reserved.</span>
        <span>Made by I❤️B❤️K</span>
      </div>
    </div>
  </footer>
);

// ─── GLOBAL STYLES INJECTION ─────────────────────────────────────────────────
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: #fff; -webkit-font-smoothing: antialiased; }
      input:focus, textarea:focus, select:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,.12) !important; }
      @media (max-width: 700px) {
        .desktop-nav { display: none !important; }
        .hamburger { display: flex !important; }
        .mobile-menu { display: flex !important; }
      }
      @media (min-width: 701px) {
        .hamburger { display: none !important; }
        .mobile-menu { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

// ─── DEMO SEED DATA ──────────────────────────────────────────────────────────
// const SEED_REQUESTS = [
//   { name: "Aminu Ibrahim", phone: "08012345678", email: "admin@example.com", service: "WAEC Scratch Card / Result Checker", serviceId: "ol1", category: "olevel", status: "Completed", details: "Need for 2023 results", date: new Date(Date.now() - 864e5 * 3).toISOString(), userEmail: "admin@example.com" },
//   { name: "Fatima Yusuf", phone: "08087654321", email: "user@example.com", service: "JAMB Result Printing", serviceId: "jb2", category: "jamb", status: "In Progress", details: "UTME 2024", date: new Date(Date.now() - 864e5).toISOString(), userEmail: "user@example.com" },
//   { name: "Emeka Obi", phone: "07011223344", email: "emeka@example.com", service: "Post-UTME Form Filling", serviceId: "ot1", category: "other", status: "Pending", details: "UNIZIK", date: new Date().toISOString(), userEmail: "emeka@example.com" },
// ];
// ─── APP ROOT ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [modal, setModal] = useState(null); // selected service
  // Load requests from backend on startup
useEffect(() => {
  const loadRequests = async () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return;

      const currentUser = JSON.parse(savedUser);

      if (currentUser.role === "admin") {
        // Admin loads ALL requests
        const res = await API.get("/requests");
        setRequests(res.data);
      } else {
        // Regular user loads ONLY their own requests
        const res = await API.get("/requests/mine");
        setRequests(res.data);
      }
    } catch (err) {
      console.log("Could not load requests:", err.message);
      setRequests([]);
    }
  };

  loadRequests();
}, [user]); // ← re-runs whenever user changes

// Load saved user from localStorage
// Load user from localStorage on startup
useEffect(() => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);

// Load requests whenever user changes (login/logout)
useEffect(() => {
  const loadRequests = async () => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) {
        setRequests([]);
        return;
      }

      const currentUser = JSON.parse(savedUser);

      if (currentUser.role === "admin") {
        // Admin loads ALL requests
        const res = await API.get("/requests");
        setRequests(res.data);
      } else {
        // Regular user loads only their own
        const res = await API.get("/requests/mine");
        setRequests(res.data);
      }
    } catch (err) {
      console.log("Could not load requests:", err.message);
      setRequests([]);
    }
  };

  loadRequests();
}, [user]); // ← re-runs every time user logs in or out

  const handleRequest = (service) => {
  if (!user) {
    alert("Please log in to request a service.");
    setPage("login");
    return;
  }
  setModal(service);
};
  const handleSubmitRequest = async (data) => {
  try {
    // Make sure user is logged in before submitting
    if (!user || !user.email) {
      alert("Please log in to submit a request.");
      setPage("login");
      return;
    }

    const payload = {
      ...data,
      userEmail: user.email, // ← always use real email
      category: getCategoryFromId(data.serviceId),
    };

    const res = await API.post("/requests", payload);

    // Add new request to list
    setRequests((r) => [res.data.request, ...r]);
  } catch (err) {
    console.error("Submit error:", err);
    alert("Failed to submit request. Please try again.");
  }
};
  
const handleDeleteRequest = async (idx) => {
  const request = requests[idx];

  // Check if request has a valid ID
  if (!request._id) {
    alert("Cannot delete this request. Please refresh the page and try again.");
    return;
  }

  const confirmed = window.confirm(`Delete request for "${request.service}"? This cannot be undone.`);
  if (!confirmed) return;

  try {
    await API.delete(`/requests/${request._id}`);
    setRequests((r) => r.filter((_, i) => i !== idx));
  } catch (err) {
    console.error("Delete error:", err.message);
    alert("Failed to delete. Make sure backend is running.");
  }
};
  const handleUpdateStatus = async (idx, status) => {
    try {
      const request = requests[idx];
      await API.put(`/requests/${request._id}`, { status });
      setRequests(r => r.map((req, i) => i === idx ? { ...req, status } : req));
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update status.");
    }
  };
  const handleAuth = (u) => {
  setUser(u);
  localStorage.setItem("user", JSON.stringify(u));
  if (u.role === "admin") {
    setPage("admin");
  } else {
    setPage("dashboard");
  }
};
  const handleLogout = () => {
  setUser(null);
  setRequests([]); // ← clear requests on logout
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setPage("home");
};

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} onRequest={handleRequest} />;
      case "services": return <ServicesPage onRequest={handleRequest} />;
      case "contact": return <ContactPage />;
      case "login": return <AuthPage mode="login" onAuthSuccess={handleAuth} />;
      case "signup": return <AuthPage mode="signup" onAuthSuccess={handleAuth} />;
      case "dashboard":
        if (!user) { setPage("login"); return null; }
        return <UserDashboard user={user} requests={requests} setPage={setPage} />;
      case "admin":
        if (!user || user.role !== "admin") { setPage("login"); return null; }
        return <AdminDashboard requests={requests} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteRequest} />;
      default: return <HomePage setPage={setPage} onRequest={handleRequest} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <GlobalStyles />
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>{renderPage()}</main>
      {page !== "login" && page !== "signup" && <Footer setPage={setPage} />}
      <WhatsAppFloat />
      {modal && <RequestModal service={modal} onClose={() => setModal(null)} onSubmit={d => { handleSubmitRequest(d); }} />}
    </div>
  );
}
