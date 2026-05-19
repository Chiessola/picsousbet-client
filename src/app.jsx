import { useState, useEffect } from "react";

// ============================================================
// 🔑 CONFIGURATION SUPABASE
// Remplacez ces deux valeurs par les vôtres
// ============================================================
const SUPABASE_URL = "https://nleerfuyjgvxbczymmna.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZWVyZnV5amd2eGJjenltbW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDI2MzYsImV4cCI6MjA5NDc3ODYzNn0.VMJOTUmsvSYWNLY56tir4B4qMAJ7JG2WM-wrJXetzNc";

const CONFIG = {
  PROMO_CODE: "PICSOUS",
  REGISTER_URL: "https://bit.ly/3JNdHCk",
  WHATSAPP_URL: "https://chat.whatsapp.com/J7r4OBafUWOKviJTeoVkWI", // 🔑 Remplacez
};

// ============================================================
// CLIENT SUPABASE
// ============================================================
async function dbGet(table, filter = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}?order=created_at.desc${filter}`;
  const res = await fetch(url, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error("Erreur base de données");
  return res.json();
}

// ============================================================
// CONSTANTES
// ============================================================
const SPORT_EMOJI = { football: "⚽", basketball: "🏀", tennis: "🎾" };
const SPORT_COLOR = { football: "#e94560", basketball: "#ff6b35", tennis: "#aadd00", all: "#e94560" };

const C = {
  bg: "#07080f", card: "#0f1019", border: "#1c1c2e",
  red: "#e94560", gold: "#f5a623", green: "#25d366",
  blue: "#4a9eff", text: "#fff", muted: "#8892a4", dim: "#2a2a3a",
};

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function daysAgo(d) {
  if (!d) return 99;
  return Math.floor((Date.now() - new Date(d)) / 86400000);
}

// ============================================================
// STYLES
// ============================================================
const S = {
  app: { fontFamily: "'Bebas Neue', Impact, sans-serif", background: C.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", overflowX: "hidden" },
  header: { background: "linear-gradient(160deg,#0d0d1f,#111128,#0a1628)", padding: "18px 14px 12px", borderBottom: `2px solid ${C.red}`, position: "sticky", top: 0, zIndex: 100 },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  logoWrap: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,${C.red},${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 },
  logoText: { fontSize: 24, color: C.text, letterSpacing: 3 },
  logoSub: { fontSize: 9, color: C.muted, fontFamily: "monospace", letterSpacing: 2, display: "block", marginTop: -2 },
  liveTag: { background: C.red, color: "#fff", fontSize: 9, padding: "4px 9px", borderRadius: 4, letterSpacing: 2, animation: "pulse 2s infinite" },
  promoBar: { background: `linear-gradient(90deg,${C.red},${C.gold})`, borderRadius: 8, padding: "9px 13px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" },
  promoBarTxt: { color: "#fff", fontSize: 12, fontFamily: "monospace", letterSpacing: 1 },
  promoCode: { background: "rgba(255,255,255,0.22)", color: "#fff", padding: "3px 10px", borderRadius: 4, fontSize: 13, letterSpacing: 4 },
  tabs: { display: "flex", background: "#0d0d18", borderBottom: `1px solid ${C.border}` },
  tab: { flex: 1, padding: "11px 2px", textAlign: "center", cursor: "pointer", fontSize: 9, color: C.dim, letterSpacing: 1, fontFamily: "monospace", borderBottom: "2px solid transparent", transition: "all 0.2s" },
  tabActive: { color: C.red, borderBottom: `2px solid ${C.red}` },
  sportFilter: { display: "flex", background: "#0b0b14", borderBottom: `1px solid ${C.border}`, padding: "6px 10px", gap: 8, overflowX: "auto" },
  pill: (active, sport) => ({ padding: "6px 14px", borderRadius: 20, fontSize: 10, fontFamily: "monospace", letterSpacing: 1, cursor: "pointer", background: active ? SPORT_COLOR[sport] : "#15151f", color: active ? "#fff" : C.muted, border: `1px solid ${active ? SPORT_COLOR[sport] : C.border}`, transition: "all 0.2s", whiteSpace: "nowrap" }),
  body: { padding: "10px 11px 110px" },
  sectionTitle: { color: C.muted, fontSize: 10, letterSpacing: 3, fontFamily: "monospace", marginBottom: 8, marginTop: 14, display: "flex", alignItems: "center", gap: 6 },
  matchCard: { background: `linear-gradient(135deg,${C.card},#131323)`, borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 10, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" },
  matchCardOpen: { borderColor: C.red },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 13px 4px" },
  sportBadge: (sport) => ({ background: SPORT_COLOR[sport] + "33", color: SPORT_COLOR[sport], border: `1px solid ${SPORT_COLOR[sport]}55`, fontSize: 8, padding: "2px 7px", borderRadius: 3, letterSpacing: 2, fontFamily: "monospace" }),
  leagueTxt: { color: C.gold, fontSize: 10, letterSpacing: 2, fontFamily: "monospace" },
  timeTxt: { color: C.muted, fontSize: 10, fontFamily: "monospace" },
  teamsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 13px 8px" },
  team: { flex: 1, textAlign: "center" },
  teamEmoji: { fontSize: 22, display: "block", marginBottom: 2 },
  teamName: { color: C.text, fontSize: 12, letterSpacing: 1 },
  vsTxt: { color: C.red, fontSize: 16, margin: "0 6px" },
  oddsRow: { display: "flex", borderTop: `1px solid ${C.border}` },
  oddBox: { flex: 1, textAlign: "center", padding: "7px 3px" },
  oddLabel: { fontSize: 8, color: "#444", letterSpacing: 2, fontFamily: "monospace", display: "block" },
  oddValue: { fontSize: 15, color: C.gold, display: "block", marginTop: 2 },
  predPanel: { background: "linear-gradient(135deg,#0a1008,#111f11)", border: "1px solid #1e3a1e", borderRadius: 10, padding: 13, margin: "0 12px 12px" },
  aiRow: { display: "flex", alignItems: "center", gap: 6, marginBottom: 9 },
  aiDot: { width: 7, height: 7, background: "#4caf50", borderRadius: "50%", animation: "pulse 2s infinite" },
  aiLbl: { color: "#4caf50", fontSize: 9, letterSpacing: 3, fontFamily: "monospace" },
  predMain: { display: "flex", alignItems: "center", marginBottom: 8, gap: 10 },
  predResult: { fontSize: 17, color: C.text, letterSpacing: 1 },
  confWrap: { flex: 1 },
  confRow: { display: "flex", justifyContent: "space-between", marginBottom: 3 },
  confTxt: { fontSize: 8, color: C.muted, fontFamily: "monospace", letterSpacing: 2 },
  barBg: { height: 4, background: "#1a1a2a", borderRadius: 2, overflow: "hidden" },
  barFill: (p) => ({ height: "100%", width: `${Math.min(p, 100)}%`, background: p > 80 ? "#4caf50" : p > 65 ? C.gold : C.red, borderRadius: 2, transition: "width 1s" }),
  scoreBox: { background: "#050a05", borderRadius: 6, padding: "4px 10px", textAlign: "center", marginBottom: 7, display: "inline-block" },
  scoreLbl: { fontSize: 8, color: "#444", letterSpacing: 2, fontFamily: "monospace" },
  scoreVal: { fontSize: 19, color: C.gold, letterSpacing: 4, display: "block" },
  reasoning: { fontSize: 10, color: C.muted, fontFamily: "monospace", lineHeight: 1.6, borderLeft: `2px solid ${C.red}`, paddingLeft: 8, marginTop: 7 },
  tipBox: { background: "rgba(229,69,96,0.08)", border: "1px solid rgba(229,69,96,0.25)", borderRadius: 5, padding: "5px 9px", marginTop: 7 },
  tipTxt: { fontSize: 10, color: C.red, fontFamily: "monospace" },
  stars: { display: "flex", gap: 2, marginTop: 6 },
  star: (on) => ({ color: on ? C.gold : "#222", fontSize: 13 }),
  resultCard: (s) => ({
    background: s === "won" ? "linear-gradient(135deg,#0a1f0a,#111f11)" : s === "lost" ? "linear-gradient(135deg,#1f0a0a,#1f1111)" : `linear-gradient(135deg,${C.card},#131323)`,
    border: `1px solid ${s === "won" ? C.green + "44" : s === "lost" ? C.red + "44" : C.border}`,
    borderRadius: 12, padding: "12px 14px", marginBottom: 10,
  }),
  statusBadge: (s) => ({ background: s === "won" ? C.green + "22" : s === "lost" ? C.red + "22" : C.gold + "22", color: s === "won" ? C.green : s === "lost" ? C.red : C.gold, border: `1px solid ${s === "won" ? C.green + "44" : s === "lost" ? C.red + "44" : C.gold + "44"}`, borderRadius: 20, padding: "3px 10px", fontSize: 10, fontWeight: 700, fontFamily: "monospace" }),
  articleCard: { background: `linear-gradient(135deg,${C.card},#131323)`, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 10, cursor: "pointer", transition: "border-color 0.2s" },
  articleTitle: { fontSize: 16, color: C.text, letterSpacing: 1, marginBottom: 6, lineHeight: 1.3 },
  articleMeta: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  tag: (c) => ({ background: c + "22", color: c, border: `1px solid ${c}44`, borderRadius: 4, padding: "2px 8px", fontSize: 9, fontFamily: "monospace", letterSpacing: 1 }),
  articleIntro: { fontSize: 11, color: C.muted, fontFamily: "monospace", lineHeight: 1.5, marginTop: 8 },
  readBtn: { display: "inline-block", marginTop: 10, background: C.red, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 10, fontFamily: "monospace", letterSpacing: 2, cursor: "pointer" },
  readerWrap: { padding: "14px 14px 120px" },
  readerBack: { display: "flex", alignItems: "center", gap: 6, color: C.red, fontSize: 11, fontFamily: "monospace", cursor: "pointer", marginBottom: 16, letterSpacing: 2 },
  readerTitle: { fontSize: 22, color: C.text, letterSpacing: 1, lineHeight: 1.3, marginBottom: 10 },
  readerMeta: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  readerIntro: { fontSize: 14, color: "#ccc", lineHeight: 1.8, marginBottom: 14, borderLeft: `3px solid ${C.red}`, paddingLeft: 12, fontFamily: "sans-serif" },
  readerBody: { fontSize: 13, color: C.muted, lineHeight: 1.8, marginBottom: 14, fontFamily: "sans-serif" },
  readerConclusion: { fontSize: 13, color: "#ccc", lineHeight: 1.8, fontStyle: "italic", fontFamily: "sans-serif", borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 6 },
  articleNav: { display: "flex", gap: 10, marginTop: 20, marginBottom: 20 },
  articleNavBtn: { flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", cursor: "pointer", color: C.muted, fontSize: 10, fontFamily: "monospace", letterSpacing: 1 },
  cta: { background: `linear-gradient(135deg,${C.red},${C.gold})`, borderRadius: 14, padding: 18, textAlign: "center", boxShadow: `0 8px 36px rgba(233,69,96,0.3)` },
  ctaTitle: { color: "#fff", fontSize: 22, letterSpacing: 2, marginBottom: 3 },
  ctaSub: { color: "rgba(255,255,255,0.82)", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, marginBottom: 14 },
  ctaCodeBox: { background: "rgba(0,0,0,0.28)", borderRadius: 8, padding: "8px 18px", marginBottom: 14, display: "inline-block" },
  ctaCode: { fontSize: 28, color: "#fff", letterSpacing: 6 },
  ctaCodeLabel: { fontSize: 8, color: "rgba(255,255,255,0.65)", letterSpacing: 4, fontFamily: "monospace", display: "block", marginTop: 2 },
  ctaBtn: { background: "#fff", color: C.red, border: "none", borderRadius: 9, padding: "13px 28px", fontSize: 15, letterSpacing: 3, cursor: "pointer", width: "100%", fontFamily: "'Bebas Neue', Impact, sans-serif" },
  ctaBonus: { color: "rgba(255,255,255,0.88)", fontSize: 11, fontFamily: "monospace", marginTop: 9 },
  bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#090910", borderTop: `1px solid ${C.border}`, display: "flex", zIndex: 200 },
  navItem: (a) => ({ flex: 1, padding: "9px 4px 7px", textAlign: "center", cursor: "pointer", borderTop: a ? `2px solid ${C.red}` : "2px solid transparent" }),
  navIcon: (a) => ({ fontSize: 17, display: "block", marginBottom: 2, filter: a ? "none" : "grayscale(1) opacity(0.35)" }),
  navLabel: (a) => ({ fontSize: 8, color: a ? C.red : "#444", letterSpacing: 2, fontFamily: "monospace" }),
  waFab: { position: "fixed", bottom: 70, right: "calc(50% - 208px)", width: 50, height: 50, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 300, boxShadow: "0 4px 20px rgba(37,211,102,0.5)", border: "2px solid rgba(255,255,255,0.15)", transition: "transform 0.2s" },
  empty: { textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 12, fontFamily: "monospace" },
  spinner: { width: 30, height: 30, border: `3px solid ${C.border}`, borderTop: `3px solid ${C.red}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "40px auto", display: "block" },
};

// ============================================================
// SMALL COMPONENTS
// ============================================================
function Stars({ count }) {
  return <div style={S.stars}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={S.star(i <= count)}>★</span>)}</div>;
}

function CTA({ titleText = "🎯 PARIEZ SUR 1XBET", sub = "BONUS EXCLUSIF AVEC NOTRE CODE" }) {
  return (
    <div style={S.cta}>
      <div style={S.ctaTitle}>{titleText}</div>
      <div style={S.ctaSub}>{sub}</div>
      <div style={S.ctaCodeBox}>
        <span style={S.ctaCode}>{CONFIG.PROMO_CODE}</span>
        <span style={S.ctaCodeLabel}>CODE PROMO — BONUS 200%</span>
      </div>
      <button style={S.ctaBtn} onClick={() => window.open(CONFIG.REGISTER_URL, "_blank")}>
        CRÉER MON COMPTE GRATUIT →
      </button>
      <div style={S.ctaBonus}>✅ 200% sur votre premier dépôt avec le code {CONFIG.PROMO_CODE}</div>
    </div>
  );
}

// ============================================================
// MATCH CARD
// ============================================================
function MatchCard({ match, open, onToggle }) {
  const p = match;
  const odds = [
    { label: "1", value: p.home_odds },
    ...(p.draw_odds ? [{ label: "X", value: p.draw_odds }] : []),
    { label: "2", value: p.away_odds },
  ];
  return (
    <div style={{ ...S.matchCard, ...(open ? S.matchCardOpen : {}) }} onClick={onToggle}>
      <div style={S.cardTop}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={S.sportBadge(p.sport)}>{SPORT_EMOJI[p.sport]} {p.sport?.toUpperCase()}</span>
          <span style={S.leagueTxt}>{p.league}</span>
        </div>
        <span style={S.timeTxt}>🕐 {p.match_time} — {fmtDate(p.match_date)}</span>
      </div>
      <div style={S.teamsRow}>
        <div style={S.team}>
          <span style={S.teamEmoji}>{p.home_logo || "🔴"}</span>
          <span style={S.teamName}>{p.home_team}</span>
        </div>
        <span style={S.vsTxt}>VS</span>
        <div style={S.team}>
          <span style={S.teamEmoji}>{p.away_logo || "🔵"}</span>
          <span style={S.teamName}>{p.away_team}</span>
        </div>
      </div>
      <div style={S.oddsRow}>
        {odds.map((o, i) => (
          <div key={i} style={{ ...S.oddBox, borderRight: i < odds.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={S.oddLabel}>{o.label}</span>
            <span style={S.oddValue}>{o.value ?? "—"}</span>
          </div>
        ))}
      </div>
      {open && p.prediction && (
        <div style={S.predPanel} onClick={e => e.stopPropagation()}>
          <div style={S.aiRow}><div style={S.aiDot} /><span style={S.aiLbl}>PRONOSTIC OFFICIEL PICSOUSBET</span></div>
          <div style={S.predMain}>
            <span style={S.predResult}>{p.prediction.toUpperCase()}</span>
            {p.confidence && (
              <div style={S.confWrap}>
                <div style={S.confRow}>
                  <span style={S.confTxt}>CONFIANCE</span>
                  <span style={{ ...S.confTxt, color: C.gold }}>{p.confidence}%</span>
                </div>
                <div style={S.barBg}><div style={S.barFill(p.confidence)} /></div>
              </div>
            )}
          </div>
          {p.predicted_score && (
            <div style={S.scoreBox}>
              <span style={S.scoreLbl}>SCORE PRÉDIT</span>
              <span style={S.scoreVal}>{p.predicted_score}</span>
            </div>
          )}
          {p.reasoning && <p style={S.reasoning}>{p.reasoning}</p>}
          {p.tip && <div style={S.tipBox}><span style={{ ...S.tipTxt, fontWeight: "bold" }}>💡 </span><span style={S.tipTxt}>{p.tip}</span></div>}
          {p.stars && <Stars count={Number(p.stars)} />}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ARTICLE READER
// ============================================================
function ArticleReader({ article, allArticles, onBack }) {
  const [current, setCurrent] = useState(article);
  const idx = allArticles.findIndex(a => a.id === current.id);
  const prev = allArticles[idx + 1] || null;
  const next = allArticles[idx - 1] || null;

  useEffect(() => { window.scrollTo(0, 0); }, [current.id]);

  return (
    <div style={S.readerWrap}>
      <div style={S.readerBack} onClick={onBack}>← RETOUR AUX ARTICLES</div>
      <div style={S.readerTitle}>{current.title}</div>
      <div style={S.readerMeta}>
        <span style={S.tag(SPORT_COLOR[current.sport] || C.gold)}>{SPORT_EMOJI[current.sport]} {current.sport?.toUpperCase()}</span>
        {(current.tags || []).map((t, i) => <span key={i} style={S.tag(C.blue)}>{t}</span>)}
        <span style={S.tag(C.muted)}>⏱ {current.read_time} min</span>
        <span style={S.tag(C.dim)}>{fmtDate(current.created_at)}</span>
      </div>
      {current.intro && <p style={S.readerIntro}>{current.intro}</p>}
      {current.body && current.body.split("\n").filter(Boolean).map((p, i) => (
        <p key={i} style={S.readerBody}>{p}</p>
      ))}
      {current.conclusion && <p style={S.readerConclusion}>{current.conclusion}</p>}

      {/* Navigation article précédent / suivant */}
      <div style={S.articleNav}>
        {prev ? (
          <div style={{ ...S.articleNavBtn, textAlign: "left" }} onClick={() => setCurrent(prev)}>
            ← PRÉCÉDENT<br />
            <span style={{ color: C.text, fontSize: 11, letterSpacing: 0 }}>{prev.title.substring(0, 45)}...</span>
          </div>
        ) : <div style={{ flex: 1 }} />}
        {next ? (
          <div style={{ ...S.articleNavBtn, textAlign: "right" }} onClick={() => setCurrent(next)}>
            SUIVANT →<br />
            <span style={{ color: C.text, fontSize: 11, letterSpacing: 0 }}>{next.title.substring(0, 45)}...</span>
          </div>
        ) : <div style={{ flex: 1 }} />}
      </div>

      {/* CTA fin d'article */}
      <CTA titleText="🎯 PASSEZ À L'ACTION" sub="UTILISEZ NOS PRONOSTICS SUR 1XBET" />
    </div>
  );
}

// ============================================================
// PROMO SCREEN
// ============================================================
function PromoScreen() {
  return (
    <div style={{ padding: "14px 11px 110px" }}>
      <CTA titleText="🎯 REJOIGNEZ 1XBET" sub="BONUS EXCLUSIF POUR NOTRE COMMUNAUTÉ" />
      <div style={{ ...S.sectionTitle, marginTop: 24 }}>⚡ Pourquoi 1xbet ?</div>
      {[
        { icon: "💰", title: "BONUS 200%", desc: "Triplez votre premier dépôt avec le code exclusif PICSOUS" },
        { icon: "⚽", title: "FOOT • BASKET • TENNIS", desc: "Des milliers de marchés sur tous les sports majeurs" },
        { icon: "📱", title: "APPLICATION MOBILE", desc: "Pariez partout, à tout moment depuis votre téléphone" },
        { icon: "⚡", title: "RETRAITS INSTANTANÉS", desc: "Retirez vos gains en quelques minutes" },
        { icon: "🔴", title: "PARIS EN DIRECT", desc: "Paris live avec des cotes en temps réel" },
        { icon: "🔒", title: "SÉCURISÉ & LICENCIÉ", desc: "Régulé, fiable et utilisé dans le monde entier" },
      ].map((item, i) => (
        <div key={i} style={{ ...S.matchCard, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", marginTop: 10, cursor: "default" }}>
          <span style={{ fontSize: 26 }}>{item.icon}</span>
          <div>
            <div style={{ color: C.gold, fontSize: 12, letterSpacing: 2, marginBottom: 2 }}>{item.title}</div>
            <div style={{ color: C.muted, fontSize: 10, fontFamily: "monospace" }}>{item.desc}</div>
          </div>
        </div>
      ))}
      <button style={{ background: C.red, color: "#fff", border: "none", borderRadius: 10, padding: 15, width: "100%", fontSize: 16, letterSpacing: 3, cursor: "pointer", fontFamily: "'Bebas Neue',Impact,sans-serif", marginTop: 16 }}
        onClick={() => window.open(CONFIG.REGISTER_URL, "_blank")}>
        🎁 RÉCLAMER MON BONUS 200%
      </button>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function ClientApp() {
  const [tab, setTab] = useState("matches");
  const [sport, setSport] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [matches, setMatches] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openArticle, setOpenArticle] = useState(null);
  const [waHover, setWaHover] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [m, c, a] = await Promise.all([
          dbGet("matches"),
          dbGet("coupons"),
          dbGet("articles", "&status=eq.published"),
        ]);
        setMatches(m || []);
        setCoupons(c || []);
        setArticles(a || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
    const iv = setInterval(load, 60000);
    return () => clearInterval(iv);
  }, []);

  const filteredMatches = sport === "all" ? matches : matches.filter(m => m.sport === sport);
  const recentCoupons = coupons.filter(c => daysAgo(c.match_date || c.created_at) <= 3);

  const navItems = [
    { id: "matches", icon: "🏟️", label: "MATCHS" },
    { id: "results", icon: "🏆", label: "RÉSULTATS" },
    { id: "articles", icon: "📰", label: "ARTICLES" },
    { id: "promo", icon: "🎁", label: "BONUS" },
  ];

  // Article reader — full screen
  if (openArticle) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:${C.bg};} ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:${C.red};border-radius:2px;} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={S.app}>
          <ArticleReader article={openArticle} allArticles={articles} onBack={() => setOpenArticle(null)} />
          <div style={{ ...S.waFab, transform: waHover ? "scale(1.1)" : "scale(1)" }}
            onClick={() => window.open(CONFIG.WHATSAPP_URL, "_blank")}
            onMouseEnter={() => setWaHover(true)} onMouseLeave={() => setWaHover(false)}>
            <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.652 4.832 1.793 6.858L2 30l7.352-1.766A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366" />
              <path d="M22.507 19.562c-.31-.156-1.833-.905-2.117-1.008-.284-.103-.49-.154-.697.155-.207.309-.8 1.008-.98 1.215-.18.207-.36.232-.67.077-.31-.155-1.308-.482-2.49-1.537-.92-.822-1.542-1.836-1.722-2.146-.18-.31-.019-.477.135-.631.14-.139.31-.362.465-.543.155-.18.207-.31.31-.516.103-.207.052-.387-.026-.543-.077-.155-.697-1.68-.955-2.301-.251-.605-.507-.523-.697-.533l-.593-.01c-.207 0-.543.077-.827.387-.284.31-1.085 1.06-1.085 2.584 0 1.524 1.11 2.997 1.265 3.204.155.207 2.186 3.339 5.298 4.682.74.32 1.318.51 1.769.653.743.236 1.42.203 1.954.123.596-.09 1.833-.75 2.091-1.474.258-.724.258-1.344.18-1.474-.077-.129-.283-.206-.593-.361z" fill="#fff" />
            </svg>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:${C.bg};} ::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:${C.red};border-radius:2px;} @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={S.app}>

        {/* HEADER */}
        <div style={S.header}>
          <div style={S.headerRow}>
            <div style={S.logoWrap}>
              <div style={S.logoIcon}>⚡</div>
              <div>
                <span style={S.logoText}>PicsousBet</span>
                <span style={S.logoSub}>PRONOSTICS GRATUITS</span>
              </div>
            </div>
            <div style={S.liveTag}>● LIVE</div>
          </div>
          <div style={S.promoBar} onClick={() => window.open(CONFIG.REGISTER_URL, "_blank")}>
            <span style={S.promoBarTxt}>🎁 BONUS 200% — CODE</span>
            <span style={S.promoCode}>{CONFIG.PROMO_CODE}</span>
          </div>
        </div>

        {/* TABS */}
        <div style={S.tabs}>
          {navItems.map(n => (
            <div key={n.id} style={{ ...S.tab, ...(tab === n.id ? S.tabActive : {}) }} onClick={() => setTab(n.id)}>
              {n.icon} {n.label}
            </div>
          ))}
        </div>

        {/* SPORT FILTER */}
        {tab === "matches" && (
          <div style={S.sportFilter}>
            {[{ id: "all", label: "🔥 TOUS" }, { id: "football", label: "⚽ FOOT" }, { id: "basketball", label: "🏀 BASKET" }, { id: "tennis", label: "🎾 TENNIS" }].map(f => (
              <div key={f.id} style={S.pill(sport === f.id, f.id === "all" ? "football" : f.id)}
                onClick={() => { setSport(f.id); setExpanded(null); }}>
                {f.label}
              </div>
            ))}
          </div>
        )}

        {/* ===== MATCHS ===== */}
        {tab === "matches" && (
          <div style={S.body}>
            {loading ? <div style={S.spinner} /> : filteredMatches.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div>Aucun match disponible pour le moment.</div>
                <div style={{ marginTop: 6 }}>Revenez plus tard ou rejoignez notre groupe WhatsApp !</div>
              </div>
            ) : (
              <>
                <div style={S.sectionTitle}>
                  <span>🔥</span>
                  <span>{filteredMatches.length} match{filteredMatches.length > 1 ? "s" : ""} disponible{filteredMatches.length > 1 ? "s" : ""}</span>
                </div>
                {filteredMatches.map(m => (
                  <MatchCard key={m.id} match={m}
                    open={expanded === m.id}
                    onToggle={() => setExpanded(p => p === m.id ? null : m.id)} />
                ))}
              </>
            )}
            <div style={{ marginTop: 20 }}><CTA titleText="🎯 MISEZ SUR NOS PRONOSTICS" sub="INSCRIPTION GRATUITE — BONUS 200%" /></div>
          </div>
        )}

        {/* ===== RÉSULTATS ===== */}
        {tab === "results" && (
          <div style={S.body}>
            <div style={S.sectionTitle}>🏆 Coupons — 3 derniers jours</div>
            {loading ? <div style={S.spinner} /> : recentCoupons.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
                <div>Aucun résultat sur les 3 derniers jours.</div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  {[
                    { label: `${recentCoupons.filter(c => c.status === "won").length} Gagnés`, color: C.green },
                    { label: `${recentCoupons.filter(c => c.status === "lost").length} Perdus`, color: C.red },
                    { label: `${recentCoupons.filter(c => c.status === "pending").length} En attente`, color: C.gold },
                  ].map((b, i) => (
                    <span key={i} style={{ background: b.color + "22", color: b.color, border: `1px solid ${b.color}44`, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontFamily: "monospace", fontWeight: 700 }}>{b.label}</span>
                  ))}
                </div>
                {recentCoupons.map(c => (
                  <div key={c.id} style={S.resultCard(c.status)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <span style={{ fontSize: 13, color: C.text }}>{SPORT_EMOJI[c.sport]} {c.home_team} vs {c.away_team}</span>
                        <span style={{ display: "block", fontSize: 10, color: C.muted, fontFamily: "monospace", marginTop: 2 }}>{c.league} • {fmtDate(c.match_date)}</span>
                      </div>
                      <span style={S.statusBadge(c.status)}>
                        {c.status === "won" ? "✅ GAGNÉ" : c.status === "lost" ? "❌ PERDU" : "⏳ EN COURS"}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: C.gold, fontFamily: "monospace" }}>📋 {c.prediction}</span>
                      {c.odds && <span style={{ fontSize: 14, color: C.gold, fontWeight: 700 }}>× {c.odds}</span>}
                    </div>
                    {c.note && <p style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", marginTop: 6, borderLeft: `2px solid ${c.status === "won" ? C.green : c.status === "lost" ? C.red : C.gold}`, paddingLeft: 8 }}>{c.note}</p>}
                  </div>
                ))}
              </>
            )}
            <div style={{ marginTop: 16 }}><CTA titleText="💰 REPRODUISEZ CES GAINS" sub="INSCRIVEZ-VOUS AVEC LE CODE PICSOUS" /></div>
          </div>
        )}

        {/* ===== ARTICLES ===== */}
        {tab === "articles" && (
          <div style={S.body}>
            <div style={S.sectionTitle}>📰 Nos derniers articles</div>
            {loading ? <div style={S.spinner} /> : articles.length === 0 ? (
              <div style={S.empty}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✍️</div>
                <div>Aucun article disponible pour le moment.</div>
                <div style={{ marginTop: 6 }}>Revenez demain matin !</div>
              </div>
            ) : (
              articles.map(a => (
                <div key={a.id}
                  style={{ ...S.articleCard }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.red}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                  <div style={S.articleTitle}>{a.title}</div>
                  <div style={S.articleMeta}>
                    <span style={S.tag(SPORT_COLOR[a.sport] || C.gold)}>{SPORT_EMOJI[a.sport]} {a.sport?.toUpperCase()}</span>
                    {(a.tags || []).slice(0, 2).map((t, i) => <span key={i} style={S.tag(C.blue)}>{t}</span>)}
                    <span style={S.tag(C.muted)}>⏱ {a.read_time} min</span>
                    <span style={S.tag(C.dim)}>{fmtDate(a.created_at)}</span>
                  </div>
                  {a.intro && <p style={S.articleIntro}>{a.intro.substring(0, 130)}...</p>}
                  <button style={S.readBtn} onClick={() => setOpenArticle(a)}>LIRE L'ARTICLE →</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* ===== PROMO ===== */}
        {tab === "promo" && <PromoScreen />}

        {/* BOTTOM NAV */}
        <div style={S.bottomNav}>
          {navItems.map(n => (
            <div key={n.id} style={S.navItem(tab === n.id)} onClick={() => setTab(n.id)}>
              <span style={S.navIcon(tab === n.id)}>{n.icon}</span>
              <span style={S.navLabel(tab === n.id)}>{n.label}</span>
            </div>
          ))}
        </div>

        {/* WHATSAPP FAB */}
        <div style={{ ...S.waFab, transform: waHover ? "scale(1.1)" : "scale(1)" }}
          onClick={() => window.open(CONFIG.WHATSAPP_URL, "_blank")}
          onMouseEnter={() => setWaHover(true)} onMouseLeave={() => setWaHover(false)}
          title="Rejoindre le groupe WhatsApp">
          <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.652 4.832 1.793 6.858L2 30l7.352-1.766A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#25D366" />
            <path d="M22.507 19.562c-.31-.156-1.833-.905-2.117-1.008-.284-.103-.49-.154-.697.155-.207.309-.8 1.008-.98 1.215-.18.207-.36.232-.67.077-.31-.155-1.308-.482-2.49-1.537-.92-.822-1.542-1.836-1.722-2.146-.18-.31-.019-.477.135-.631.14-.139.31-.362.465-.543.155-.18.207-.31.31-.516.103-.207.052-.387-.026-.543-.077-.155-.697-1.68-.955-2.301-.251-.605-.507-.523-.697-.533l-.593-.01c-.207 0-.543.077-.827.387-.284.31-1.085 1.06-1.085 2.584 0 1.524 1.11 2.997 1.265 3.204.155.207 2.186 3.339 5.298 4.682.74.32 1.318.51 1.769.653.743.236 1.42.203 1.954.123.596-.09 1.833-.75 2.091-1.474.258-.724.258-1.344.18-1.474-.077-.129-.283-.206-.593-.361z" fill="#fff" />
          </svg>
        </div>

      </div>
    </>
  );
}