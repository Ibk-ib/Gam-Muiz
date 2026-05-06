import { useState } from "react";
import axios from "axios";

// ── API SETUP ─────────────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ── WHATSAPP ──────────────────────────────────────────────────────────────────
const WHATSAPP_URL = "https://wa.me/2347034673942?text=Hello%20GAM%20MUIZ%20CONCEPTS";

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // background: "linear-gradient(135deg, #ffffff 0%, #14532d 0%, #166534 0%)",
    padding: "20px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: 20,
    padding: "36px 32px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  logoWrap: {
    textAlign: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 900,
    fontSize: 24,
    margin: "0 auto 12px",
  },
  brandName: {
    fontSize: 18,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
  },
  brandSub: {
    fontSize: 13,
    color: "#6b7280",
    margin: "4px 0 0",
  },
  tabRow: {
    display: "flex",
    background: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: (active) => ({
    flex: 1,
    background: active ? "#ffffff" : "transparent",
    border: "none",
    borderRadius: 9,
    padding: "10px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    color: active ? "#111827" : "#9ca3af",
    boxShadow: active ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
    transition: "all 0.15s",
    fontFamily: "inherit",
  }),
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  successBox: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#16a34a",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid #e5e7eb",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    background: "#f9fafb",
    transition: "border 0.15s",
  },
  submitBtn: (loading) => ({
    width: "100%",
    background: loading ? "#86efac" : "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 11,
    padding: "14px",
    fontWeight: 700,
    fontSize: 15,
    cursor: loading ? "not-allowed" : "pointer",
    marginTop: 6,
    fontFamily: "inherit",
    transition: "background 0.2s",
  }),
  divider: {
    textAlign: "center",
    color: "#d1d5db",
    fontSize: 13,
    margin: "18px 0",
    position: "relative",
  },
  waBtn: {
    width: "100%",
    background: "#25d366",
    color: "#fff",
    border: "none",
    borderRadius: 11,
    padding: "12px",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    textDecoration: "none",
    fontFamily: "inherit",
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 18,
  },
};

// ── WHATSAPP ICON ─────────────────────────────────────────────────────────────
const WAIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// ── MAIN AUTH COMPONENT ───────────────────────────────────────────────────────
export default function AuthPage({ onAuthSuccess }) {
  const [tab, setTab] = useState("login"); // "login" or "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setForm({ name: "", email: "", password: "" });
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (tab === "signup" && !form.name.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!form.password) {
      setError("Please enter your password.");
      return false;
    }
    if (tab === "signup" && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = tab === "signup" ? "/auth/signup" : "/auth/login";
      const payload =
        tab === "signup"
          ? { name: form.name.trim(), email: form.email.trim(), password: form.password }
          : { email: form.email.trim(), password: form.password };

      const response = await API.post(endpoint, payload);
      const { token, user, msg } = response.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess(msg || (tab === "signup" ? "Account created! Redirecting..." : "Login successful! Redirecting..."));

      // Wait 1 second then redirect
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(user);
      }, 1000);

    } catch (err) {
      // Show exact error message from backend
      const msg = err.response?.data?.msg || "Something went wrong. Please try again.";
      setError(msg);
    }

    setLoading(false);
  };

  // Allow pressing Enter to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* LOGO */}
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}>G</div>
          <p style={styles.brandName}>GAM MUIZ CONCEPTS</p>
          <p style={styles.brandSub}>Educational Services Platform</p>
        </div>

        {/* TABS */}
        <div style={styles.tabRow}>
          <button style={styles.tab(tab === "login")} onClick={() => switchTab("login")}>
            Log In
          </button>
          <button style={styles.tab(tab === "signup")} onClick={() => switchTab("signup")}>
            Sign Up
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div style={styles.errorBox}>
            ❌ {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div style={styles.successBox}>
            ✅ {success}
          </div>
        )}

        {/* FORM FIELDS */}
        {tab === "signup" && (
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g. Aminu Ibrahim"
              value={form.name}
              onChange={update("name")}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Email Address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="e.g. aminu@gmail.com"
            value={form.email}
            onChange={update("email")}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Password {tab === "signup" && <span style={{ color: "#9ca3af", fontWeight: 400 }}>(min 6 characters)</span>}</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={update("password")}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          style={styles.submitBtn(loading)}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : tab === "login"
            ? "Log In to My Account"
            : "Create My Account"}
        </button>

        {/* DIVIDER */}
        <div style={styles.divider}>── or ──</div>

        {/* WHATSAPP BUTTON */}
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" style={styles.waBtn}>
          <WAIcon /> Chat with us on WhatsApp
        </a>

        {/* HINT */}
        <p style={styles.hint}>
          {tab === "login"
            ? "Don't have an account? Click Sign Up above."
            : "Already have an account? Click Log In above."}
        </p>

      </div>
    </div>
  );
}