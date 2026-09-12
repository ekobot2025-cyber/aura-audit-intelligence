import React, { useState } from 'react';
import PolygonBackground from './PolygonBackground';
import OrbitGlobe from './OrbitGlobe';
import { 
  ShieldCheck, ArrowRight, Lock, KeyRound, Sparkles, TrendingUp, 
  FileSpreadsheet, Smartphone, Award, Bot, Database, Eye, CheckCircle2, 
  Layers, ChevronRight, Activity, Terminal, ExternalLink, UserCheck, AlertCircle,
  Split, Calendar, Building2, ShieldAlert, AlertTriangle, BarChart3, ScanText, 
  Type, Stamp, CopyCheck, Flame, AlertOctagon, Cpu, FileSignature, ArrowUpRight, CheckCheck,
  FileText, Fingerprint
} from 'lucide-react';

const AURA_ACCOUNTS = {
  auditor: {
    username: 'auditor',
    role: 'Auditor Investigasi Utama',
    short: 'Auditor Utama',
    icon: '👤'
  },
  pimpinan: {
    username: 'pimpinan',
    role: 'Pimpinan / Pengarah Audit',
    short: 'Pengarah Audit',
    icon: '🏛️'
  },
  pengawas: {
    username: 'pengawas',
    role: 'Satuan Pengawas Internal (SPI)',
    short: 'Pengawas SPI',
    icon: '🛡️'
  },
  pejabat: {
    username: 'pejabat',
    role: 'Pejabat Pembuat Komitmen (PPK)',
    short: 'Pejabat PPK',
    icon: '📋'
  },
  admin: {
    username: 'admin',
    role: 'Administrator Sistem',
    short: 'Admin Sistem',
    icon: '⚙️'
  },
  administrator: {
    username: 'admin',
    role: 'Administrator Sistem',
    short: 'Admin Sistem',
    icon: '⚙️'
  }
};

export default function LandingPage({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('excel-fraud');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('auditor');
  const [password, setPassword] = useState('aura');
  const [loginRole, setLoginRole] = useState('Auditor Investigasi Utama');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleUsernameChange = (val) => {
    setUsername(val);
    const key = val.trim().toLowerCase();
    if (AURA_ACCOUNTS[key]) {
      setLoginRole(AURA_ACCOUNTS[key].role);
    }
  };

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    setTimeout(() => {
      setLoggingIn(false);
      const clean = (username || '').trim().toLowerCase();
      if (!clean) {
        setLoginError('Harap masukkan username (auditor, pimpinan, pengawas, pejabat, admin)');
        return;
      }
      const matched = AURA_ACCOUNTS[clean];
      const role = matched ? matched.role : (loginRole || 'Auditor Investigasi Utama');
      const finalUsername = matched ? matched.username : clean;
      onLoginSuccess({
        username: finalUsername,
        role: role,
        email: `@${finalUsername}`
      });
    }, 350);
  };

  const handleQuickDemoLogin = (key) => {
    const acc = AURA_ACCOUNTS[key] || AURA_ACCOUNTS.auditor;
    setUsername(acc.username);
    setPassword('aura');
    setLoginRole(acc.role);
    setLoggingIn(true);
    setTimeout(() => {
      setLoggingIn(false);
      onLoginSuccess({
        username: acc.username,
        role: acc.role,
        email: `@${acc.username}`
      });
    }, 300);
  };

  const handlePillarClick = (moduleId) => {
    setActiveTab(moduleId);
    const element = document.getElementById('modules');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const modules = [
    {
      id: 'excel-fraud',
      name: 'Excel Risk Finder',
      tagline: 'Audit Otomatis Data Transaksi & LPJ',
      desc: 'Deteksi otomatis split invoice di bawah limit pagu 50 juta, pola Benford’s Law anomali digit awal, dan vendor duplikasi rekening.',
      badge: 'Berdasarkan Risk-Finder-7',
      highlights: [
        { title: 'Split Invoice Detection', desc: 'Tangkap transaksi pecahan terencana di bawah ambang batas lelang/PPK.', icon: Split },
        { title: 'Benford Multi-Digit Analysis', desc: 'Validasi deviasi frekuensi digit alami (First & Second Digits test).', icon: TrendingUp },
        { title: 'Weekend & Holiday Outliers', desc: 'Isolasi pengeluaran kas mencurigakan di luar jam operasional kampus.', icon: Calendar },
        { title: 'Vendor Concentration', desc: 'Identifikasi monopoli pengadaan oleh penyedia terafiliasi tersembunyi.', icon: Building2 }
      ],
      outputs: [
        { title: 'Tingkat Risiko Finansial', desc: 'Skor risiko terbobot (0 - 100) per transaksi dan ringkasan batch.', icon: ShieldAlert },
        { title: 'Daftar Red-Flags Spesifik', desc: 'Aturan kepatuhan Keppres & regulasi BLU/PTN yang dilanggar.', icon: AlertTriangle },
        { title: 'Ekspor Audit Excel/PDF', desc: 'Laporan siap lampir audit BPK/Itjen dengan metadata validasi.', icon: FileSpreadsheet },
        { title: 'Visualisasi Sebaran Deviasi', desc: 'Kurva sebaran anomali per mata anggaran kegiatan fakultas.', icon: BarChart3 }
      ]
    },
    {
      id: 'receipt-inspector',
      name: 'Inspektur Struk & Transfer',
      tagline: 'Deep Vision ELA & OCR Forensik Dokumen',
      desc: 'Analisis Error Level Analysis (ELA), visual heatmaps rekayasa piksel Photoshop/Canva, serta verifikasi rekening fraud nasional.',
      badge: 'Berdasarkan Fraud-Detector-ID-1',
      highlights: [
        { title: 'Error Level Analysis (ELA)', desc: 'Sensor kompresi JPEG untuk mengungkap teks nominal yang ditimpa ulang.', icon: Eye },
        { title: 'Multi-OCR Digit Verification', desc: 'Pencocokan digit PaddleOCR + Tesseract untuk mencegah modifikasi font.', icon: ScanText },
        { title: 'QRIS & Ref-ID Validator', desc: 'Validasi checksum referensi transaksi mobile banking (BCA, Mandiri, BRI).', icon: Smartphone },
        { title: 'Font Inconsistency Scanner', desc: 'Deteksi perbedaan kerning, baseline shift, dan anti-aliasing tipografi.', icon: Type },
      ],
      outputs: [
        { title: 'Visual Tamper Heatmap', desc: 'Peta visual warna merah-oranye pada koordinat piksel yang diedit.', icon: Flame },
        { title: 'Confidence Tampering Rate', desc: 'Probabilitas pemalsuan matematis (0 - 99.8%) berbasis machine learning.', icon: Award },
        { title: 'CekRekening.id & OJK Match', desc: 'Pengecekan nomor rekening & telepon terlapor ke database penipuan.', icon: ShieldCheck },
        { title: 'Forensic Audit Dossier', desc: 'Bukti forensik digital dengan hash SHA-256 yang sah di mata hukum.', icon: FileSignature }
      ]
    },
    {
      id: 'enterprise-forensics',
      name: 'Enterprise Forensics 10/10',
      tagline: 'Command Center Investigasi Terpadu Multi-Dimensi',
      desc: 'Integrasi SLIK OJK, Cross-Document Alignment, intelijen harga e-Katalog, serta tanda tangan digital berkekuatan hukum.',
      badge: 'Grade 10/10 Enterprise',
      highlights: [
        { title: 'Cross-Document Reconciliation', desc: 'Pencocokan 3 arah: PO Pengadaan, BAST Barang, dan Invoice Pembayaran.', icon: Layers },
        { title: 'Price Intelligence e-Katalog', desc: 'Benchmark harga barang terhadap standar pasar nasional secara real-time.', icon: Activity },
        { title: 'SLIK OJK & Beneficial Owner', desc: 'Pemetaan hubungan tersembunyi antara panitia lelang dan direktur vendor.', icon: Database },
        { title: 'AI Auditor Interactive Agent', desc: 'Asisten AI penalaran investigatif berbasis regulasi audit Indonesia.', icon: Bot }
      ],
      outputs: [
        { title: 'National Intelligence Clearance', desc: 'Status clearance vendor dari Ditjen Pajak, OJK, dan CekRekening.', icon: CheckCheck },
        { title: 'Rekon 3-Arah Match Verdict', desc: 'Temuan selisih kuantitas, tanggal mundur, dan markup harga satuan.', icon: CheckCircle2 },
        { title: 'Digital Signature Sign-off', desc: 'Penandatanganan Berita Acara Pemeriksaan (BAP) dengan sertifikat digital.', icon: Lock },
        { title: 'Executive Risk Matrix', desc: 'Dashboard ringkasan level Dekanat untuk mitigasi kerugian keuangan negara.', icon: Award }
      ]
    }
  ];

  const currentModule = modules.find(m => m.id === activeTab) || modules[0];

  return (
    <div className="relative min-h-screen bg-[#070c1e] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* ── Background Particle Mesh Canvas ── */}
      <PolygonBackground />

      {/* ── Ambient Radial Glows ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] rounded-full bg-blue-600/15 blur-[160px]" />
        <div className="absolute top-1/3 right-0 w-[32rem] h-[32rem] rounded-full bg-cyan-500/12 blur-[150px]" />
        <div className="absolute bottom-10 left-10 w-[36rem] h-[36rem] rounded-full bg-purple-600/12 blur-[160px]" />
        {/* Subtle Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,100,232,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,100,232,0.06)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      </div>

      {/* ── Sticky Top Bar Nav (Expertise Showcase-19 Cyber Header) ── */}
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[#2564e8]/30 bg-[#070c1e]/75 backdrop-blur-xl shadow-[0_0_35px_-15px_#2564e8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          {/* Brand Monogram */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-black shadow-[0_0_20px_rgba(56,189,248,0.5)]">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-widest text-lg text-white font-mono">AURA</span>
                <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300 font-mono tracking-wider border border-cyan-500/30">v2.6 PRO</span>
              </div>
              <p className="text-[10.5px] tracking-[0.14em] uppercase text-cyan-400 font-bold leading-tight">Audit & Risk Analytics</p>
              <p className="text-[8.5px] text-slate-400 font-medium leading-tight">AI-Assisted Audit Intelligence Platform</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1 border border-slate-800 rounded-full px-2 py-1 bg-slate-950/60 backdrop-blur-md">
            <a href="#hero" className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors">Overview</a>
            <a href="#modules" className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors">Arsitektur Audit</a>
            <a href="#intelligence" className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors">Forensik 10/10</a>
            <a href="#credentials" className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors">Akun Demo</a>
          </nav>

          {/* Action: Open Login Gateway */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2 text-xs font-bold text-white uppercase tracking-wider shadow-[0_0_24px_rgba(37,100,232,0.6)] transition-all hover:scale-105 hover:shadow-[0_0_32px_rgba(56,189,248,0.8)]"
            >
              <Lock size={14} />
              <span>Masuk ke AURA</span>
            </button>
          </div>
        </div>
      </header>

      <div className="h-20" />

      {/* ── HERO SECTION ── */}
      <section id="hero" className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-20 md:pt-16 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Hero Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300 backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
              <span>AI-Assisted Audit Intelligence Platform</span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-white">
              AURA
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.3)] mt-2">
                Audit & Risk Analytics
              </span>
              <span className="block text-base sm:text-lg lg:text-xl font-medium text-slate-300 mt-2 tracking-normal font-sans">
                AI-Assisted Audit Intelligence Platform
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300 font-normal">
              <strong className="font-black text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">AURA</strong> membantu proses audit melalui analisis cerdas terhadap dokumen dan transaksi keuangan untuk mengidentifikasi anomali, ketidakwajaran harga, ketidaksesuaian antar dokumen, serta indikasi risiko <em className="italic text-slate-200">fraud</em>. Setiap temuan disajikan secara transparan berdasarkan bukti dan tingkat risiko untuk mendukung verifikasi, investigasi, dan pengambilan keputusan auditor.
            </p>

            {/* 3 Strategic Audit Pillar Interactive Buttons (Single Row 3-Columns) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-2xl">
              <button
                type="button"
                onClick={() => handlePillarClick('receipt-inspector')}
                className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-3 py-2 text-xs text-cyan-300 backdrop-blur-md hover:border-cyan-400 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all cursor-pointer text-center"
                title="Klik untuk melihat modul Forensik Dokumen & ELA"
              >
                <span className="text-cyan-400 group-hover:scale-110 transition-transform">🛡️</span>
                <span>Forensik Dokumen &amp; <em className="italic font-semibold">ELA</em></span>
              </button>
              <button
                type="button"
                onClick={() => handlePillarClick('excel-fraud')}
                className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-950/40 px-3 py-2 text-xs text-blue-300 backdrop-blur-md hover:border-blue-400 hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all cursor-pointer text-center"
                title="Klik untuk melihat modul Intelijen Harga & Benford's Law"
              >
                <span className="text-blue-400 group-hover:scale-110 transition-transform">📊</span>
                <span>Intelijen Harga &amp; <em className="italic font-semibold">Benford</em></span>
              </button>
              <button
                type="button"
                onClick={() => handlePillarClick('enterprise-forensics')}
                className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300 backdrop-blur-md hover:border-emerald-400 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer text-center"
                title="Klik untuk melihat modul Berita Acara SHA-256"
              >
                <span className="text-emerald-400 group-hover:scale-110 transition-transform">📜</span>
                <span>Berita Acara <span className="font-mono font-bold">SHA-256</span></span>
              </button>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_32px_-6px_rgba(37,100,232,0.8)] transition-all hover:scale-105 hover:shadow-[0_0_42px_rgba(56,189,248,0.9)]"
              >
                <span>Buka Command Center</span>
                <ArrowRight size={16} />
              </button>

              <a
                href="#modules"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur transition-all hover:border-cyan-400/50 hover:bg-slate-800/60"
              >
                <span>Eksplorasi Modul Audit</span>
                <Layers size={16} className="text-cyan-400" />
              </a>
            </div>

            {/* Micro Stats Counter */}
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
              <div>
                <dt className="text-2xl sm:text-3xl font-black text-white font-mono">100%</dt>
                <dd className="mt-1 text-xs text-slate-400 font-medium">Rekon 3-Arah Otomatis</dd>
              </div>
              <div>
                <dt className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">10/10</dt>
                <dd className="mt-1 text-xs text-slate-400 font-medium">Enterprise Forensics</dd>
              </div>
              <div>
                <dt className="text-2xl sm:text-3xl font-black text-white font-mono">&lt; 1.2s</dt>
                <dd className="mt-1 text-xs text-slate-400 font-medium">Deep Vision ELA Scan</dd>
              </div>
            </dl>
          </div>

          {/* Right Hero Visual: 3D Orbit Globe */}
          <div className="relative flex items-center justify-center">
            <OrbitGlobe label="AURA" />
          </div>
        </div>
      </section>

      {/* ── TECH & ENGINE MARQUEE TICKER ── */}
      <div className="relative overflow-hidden border-y border-[#2564e8]/25 bg-[#050814]/80 py-4 backdrop-blur-md">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[
            'PaddleOCR 2.8', 'PyMuPDF Engine', 'OpenCV Error-Level-Analysis', 
            'Benford First-Second Digit Engine', 'CekRekening.id Gateway', 'SLIK OJK Intelligence', 
            'SHA-256 Digital Ledger', 'e-Katalog Inaproc Scraper', 'FastAPI High-Concurrency', 
            'React 19 Cyber UI', 'Three.js & Canvas 2D', 'Cross-Document PO-BAST Reconciler'
          ].map((item, idx) => (
            <span key={idx} className="flex items-center gap-2 whitespace-nowrap text-xs font-mono font-medium text-slate-400">
              <span className="size-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#38bdf8]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── INTERACTIVE ARCHITECTURE SECTION (Expertise-Showcase-19 Adopsi) ── */}
      <section id="modules" className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-400 font-mono">ARSITEKTUR PLATFORM AUDIT TERINTEGRASI</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
            3 Pilar Deteksi Fraud Saling Terkoneksi Realtime
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            Menyatukan audit transaksi numerik, deep vision visual forensik struk fisik, dan penyelidikan enterprise 10/10 dalam satu alur bukti sah.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {modules.map(mod => {
            const isActive = activeTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_24px_rgba(56,189,248,0.5)] border border-cyan-400/40 scale-105' 
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {mod.id === 'excel-fraud' && <FileSpreadsheet size={16} />}
                {mod.id === 'receipt-inspector' && <Smartphone size={16} />}
                {mod.id === 'enterprise-forensics' && <Award size={16} />}
                <span>{mod.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel with SVG Flow Lines */}
        <div className="mt-12 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-6 md:p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-widest">
              {currentModule.badge}
            </span>
            <h3 className="mt-3 text-2xl font-bold text-white">{currentModule.tagline}</h3>
            <p className="mt-2 text-sm text-slate-400">{currentModule.desc}</p>
          </div>

          {/* ── INTERACTIVE ARCHITECTURE SECTION (Adopted Capture #2 with Robot & Laptop) ── */}
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0 max-w-6xl mx-auto my-4">
            
            {/* ── LEFT COLUMN: 4 CARDS (Icon on Right) ── */}
            <div className="w-full lg:w-[330px] flex flex-col gap-3.5 z-10">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                <Database size={14} className="text-cyan-400" />
                <span>Modul Analisis & Sensor Input</span>
              </div>
              {currentModule.highlights.map((h, i) => {
                const Icon = h.icon || ShieldCheck;
                return (
                  <div 
                    key={i} 
                    className="group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#09132c]/85 border border-[#1e3a8a]/70 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(56,189,248,0.3)] transition-all duration-300"
                  >
                    <div className="flex-1 min-w-0 pr-1 text-left">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {h.title}
                      </h4>
                      <p className="mt-0.5 text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {h.desc}
                      </p>
                    </div>
                    <div className="flex-shrink-0 size-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/60 group-hover:text-cyan-300 group-hover:scale-105 transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)]">
                      <Icon size={18} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── LEFT BRACKET CONNECTOR (Desktop only) ── */}
            <div className="hidden lg:flex items-center justify-center w-[70px] h-[360px] flex-shrink-0 z-0 select-none">
              <svg viewBox="0 0 70 360" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="glowLeft" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.7"/>
                  </filter>
                </defs>
                {/* Base paths */}
                <path d="M 0 42 H 20 Q 30 42 30 52 V 77 Q 30 87 40 87 H 48" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 0 132 H 20 Q 30 132 30 122 V 97 Q 30 87 40 87 H 48" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 0 228 H 20 Q 30 228 30 238 V 263 Q 30 273 40 273 H 48" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 0 318 H 20 Q 30 318 30 308 V 283 Q 30 273 40 273 H 48" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 48 87 Q 56 87 56 97 V 170 Q 56 180 64 180 H 70" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 48 273 Q 56 273 56 263 V 190 Q 56 180 64 180 H 70" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />

                {/* Flow dashed paths */}
                <path d="M 0 42 H 20 Q 30 42 30 52 V 77 Q 30 87 40 87 H 48" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowLeft)" />
                <path d="M 0 132 H 20 Q 30 132 30 122 V 97 Q 30 87 40 87 H 48" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowLeft)" />
                <path d="M 0 228 H 20 Q 30 228 30 238 V 263 Q 30 273 40 273 H 48" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowLeft)" />
                <path d="M 0 318 H 20 Q 30 318 30 308 V 283 Q 30 273 40 273 H 48" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowLeft)" />
                <path d="M 48 87 Q 56 87 56 97 V 170 Q 56 180 64 180 H 70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowLeft)" />
                <path d="M 48 273 Q 56 273 56 263 V 190 Q 56 180 64 180 H 70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowLeft)" />
              </svg>
            </div>

            {/* ── CENTER: THE 3D ROBOT MASCOT WITH LAPTOP ── */}
            <div className="relative flex flex-col items-center justify-center my-6 lg:my-0 flex-shrink-0 z-20 group">
              
              {/* Background Ambient Radial Glow */}
              <div className="absolute -inset-10 bg-gradient-to-t from-cyan-500/25 via-blue-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Robot Image */}
              <div className="relative flex items-center justify-center">
                <img 
                  src="/robot_aura.png" 
                  alt="AURA AI Auditor Robot" 
                  className="w-64 sm:w-72 lg:w-80 h-auto max-h-[420px] object-contain drop-shadow-[0_20px_45px_rgba(37,99,235,0.45)] transition-transform duration-500 group-hover:scale-105 select-none"
                  draggable="false"
                />
              </div>

              {/* Cyber Ground Platform Shadow */}
              <div className="w-48 sm:w-56 h-4 rounded-[100%] bg-cyan-400/25 blur-md -mt-2 shadow-[0_0_20px_#38bdf8]" />

              {/* Floating Live Pipeline Indicator Badge */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-[#071330]/90 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
                  AURA AI CORE REASONING PIPELINE
                </span>
              </div>
            </div>

            {/* ── RIGHT BRACKET CONNECTOR (Desktop only) ── */}
            <div className="hidden lg:flex items-center justify-center w-[70px] h-[360px] flex-shrink-0 z-0 select-none">
              <svg viewBox="0 0 70 360" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="glowRight" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.7"/>
                  </filter>
                </defs>
                {/* Base paths */}
                <path d="M 0 180 H 6 Q 14 180 14 170 V 97 Q 14 87 22 87 H 30" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 0 180 H 6 Q 14 180 14 190 V 263 Q 14 273 22 273 H 30" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 30 87 H 38 Q 46 87 46 77 V 52 Q 46 42 54 42 H 70" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 30 87 H 38 Q 46 87 46 97 V 122 Q 46 132 54 132 H 70" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 30 273 H 38 Q 46 273 46 263 V 238 Q 46 228 54 228 H 70" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />
                <path d="M 30 273 H 38 Q 46 273 46 283 V 308 Q 46 318 54 318 H 70" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.6" />

                {/* Flow dashed paths */}
                <path d="M 0 180 H 6 Q 14 180 14 170 V 97 Q 14 87 22 87 H 30" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowRight)" />
                <path d="M 0 180 H 6 Q 14 180 14 190 V 263 Q 14 273 22 273 H 30" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowRight)" />
                <path d="M 30 87 H 38 Q 46 87 46 77 V 52 Q 46 42 54 42 H 70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowRight)" />
                <path d="M 30 87 H 38 Q 46 87 46 97 V 122 Q 46 132 54 132 H 70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowRight)" />
                <path d="M 30 273 H 38 Q 46 273 46 263 V 238 Q 46 228 54 228 H 70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowRight)" />
                <path d="M 30 273 H 38 Q 46 273 46 283 V 308 Q 46 318 54 318 H 70" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" className="flow-dash" filter="url(#glowRight)" />
              </svg>
            </div>

            {/* ── RIGHT COLUMN: 4 CARDS (Icon on Left) ── */}
            <div className="w-full lg:w-[330px] flex flex-col gap-3.5 z-10">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-cyan-400" />
                <span>Hasil & Eksekusi Forensik</span>
              </div>
              {currentModule.outputs.map((out, i) => {
                const Icon = out.icon || CheckCircle2;
                return (
                  <div 
                    key={i} 
                    className="group relative flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#09132c]/85 border border-[#1e3a8a]/70 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(56,189,248,0.3)] transition-all duration-300"
                  >
                    <div className="flex-shrink-0 size-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/60 group-hover:text-cyan-300 group-hover:scale-105 transition-all shadow-[0_0_12px_rgba(56,189,248,0.2)]">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0 pl-1 text-left">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {out.title}
                      </h4>
                      <p className="mt-0.5 text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {out.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Direct Trigger to Open in AURA */}
          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles size={15} className="text-cyan-400" />
              <span>Semua modul siap digunakan langsung dengan sample dataset bawaan atau upload mandiri.</span>
            </div>
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
            >
              <span>Akses Modul Ini di Workspace</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION: 10/10 ENTERPRISE FORENSICS HIGHLIGHTS ── */}
      <section id="intelligence" className="relative z-10 mx-auto max-w-7xl px-6 py-20 border-t border-slate-800/80">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
              <Award size={14} className="text-blue-400" />
              <span>Standar Pembuktian Hukum & BPK RI</span>
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl font-black text-white leading-tight">
              Kenapa AURA Memperoleh Predikat Kesiapan{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                10/10 Enterprise?
              </span>
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Bukan sekadar visual dashboard, AURA dirancang memenuhi asas pembuktian forensik digital (*Chain of Custody*), 
              memadukan data historis, register intelijen korporat, hingga verifikasi tandatangan digital berbasis kriptografi SHA-256.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Eye size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Deteksi Manipulasi Gambar Piksel Sub-Visual</h4>
                  <p className="mt-0.5 text-xs text-slate-400">Error Level Analysis mampu mendeteksi hasil suntingan teks struk ATM/QRIS walau kasat mata terlihat mulus.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <UserCheck size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cek Rekening & SLIK OJK Realtime</h4>
                  <p className="mt-0.5 text-xs text-slate-400">Sinkronisasi status blacklist nomor rekening penerima transfer terhadap database penipuan nasional.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Lock size={15} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Integritas Berkas Audit Anti-Repudiasi</h4>
                  <p className="mt-0.5 text-xs text-slate-400">Dossier laporan audit disegel dengan hash kriptografi untuk menjamin berkas tidak diubah setelah ditandatangani.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── VISUAL FORENSIC EVIDENCE CARD (Pengganti Terminal Raw CLI) ── */}
          <div className="rounded-2xl border border-cyan-500/40 bg-[#09132c]/90 p-6 md:p-7 backdrop-blur-xl shadow-[0_0_50px_rgba(37,100,232,0.35)] relative overflow-hidden">
            
            {/* Top Bar: Header Berkas Telaah Resmi */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white tracking-wide">TELAAH BUKTI FORENSIK DIGITAL</div>
                  <div className="text-[11px] font-mono text-cyan-400">#SPJ-2026-FEB-019 • CV PAPUA TEKNOLOGI</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-[11px] font-bold text-rose-300">
                <span className="size-2 rounded-full bg-rose-400 animate-ping" />
                <span>RISIKO: 88/100 (TINGGI)</span>
              </div>
            </div>

            {/* Document Visual Inspection Findings */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                <span className="text-slate-400">Objek Pemeriksaan:</span>
                <span className="font-mono text-slate-200">Bukti_Transfer_Pengadaan_Lab.jpg</span>
              </div>

              {/* Finding 1: Amount & Font Tampering */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-rose-950/30 border border-rose-500/30">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-rose-300">Indikasi Split Invoice &amp; Suntingan Font</div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Nominal <strong className="text-white font-mono font-bold">Rp 49.500.000</strong> mendekati batas pagu lelang Rp 50jt. Terdeteksi deviasi <em className="italic">baseline kerning font 4.8px</em>.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 shrink-0">
                  ELA 78.4%
                </span>
              </div>

              {/* Finding 2: Beneficiary Blacklist Status */}
              <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-300">Rekening Tujuan Masuk Blacklist Nasional</div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      Rekening <span className="font-mono font-bold text-white">8820192837 (Bank Mandiri)</span> memiliki catatan di <strong className="text-cyan-300">CekRekening.id</strong> (14 laporan penipuan).
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 shrink-0">
                  FLAGGED
                </span>
              </div>

              {/* Finding 3: Cryptographic SHA-256 Hash Seal */}
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-slate-300 truncate">
                  <Fingerprint size={15} className="text-cyan-400 shrink-0" />
                  <span className="text-slate-400">Segel SHA-256:</span>
                  <span className="text-cyan-300 truncate font-semibold">7f83b1657ff1fc53b92dc18148a1d...</span>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 shrink-0 font-sans font-bold">
                  TERSEGEL RESMI
                </span>
              </div>
            </div>

            {/* Bottom Footer: ISO Standard & Action Button */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Standar Forensik ISO/IEC 27037</span>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-xs font-bold text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:brightness-110 transition-all cursor-pointer"
              >
                <span>Buka Modul Forensik Lengkap</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION: LOGIN GATEWAY MODAL / DIALOG ── */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl border border-cyan-400/40 bg-[#090e24] p-7 shadow-[0_0_60px_rgba(37,100,232,0.6)]">
            {/* Close button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-mono font-bold"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                <Lock size={24} />
              </div>
              <h3 className="mt-3 text-2xl font-black text-white font-mono tracking-wider">AURA</h3>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Audit & Risk Analytics</p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                AI-Assisted Audit Intelligence Platform
              </p>
              <div className="mt-1 text-[10px] text-slate-500 font-mono">
                Audit &amp; Risk Intelligence Command Center
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Peran / Hak Akses</label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-cyan-300 font-medium focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  <option value="Auditor Investigasi Utama">👤 Tim Auditor Investigasi Utama</option>
                  <option value="Pimpinan / Pengarah Audit">🏛️ Pimpinan / Pengarah Audit</option>
                  <option value="Satuan Pengawas Internal (SPI)">🛡️ Satuan Pengawas Internal (SPI)</option>
                  <option value="Pejabat Pembuat Komitmen (PPK)">📋 Pejabat Pembuat Komitmen (PPK)</option>
                  <option value="Administrator Sistem">⚙️ Administrator Sistem</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Username</label>
                  <span className="text-[10px] text-cyan-400 font-mono">auditor, pimpinan, pengawas, pejabat, admin</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
                    placeholder="auditor"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Kata Sandi</label>
                  <span className="text-[10px] text-slate-500 font-mono">bebas (default: aura)</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg p-2.5">
                  <AlertCircle size={14} />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(37,100,232,0.6)] hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loggingIn ? 'Memverifikasi Akses...' : 'Masuk ke Dashboard AURA'}
              </button>
            </form>

            {/* Quick Demo Shortcuts */}
            <div id="credentials" className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  ⚡ 1-Click Akses Demo Sesuai Akun:
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">Sandi: aura</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('auditor')}
                  className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-2 text-left hover:bg-cyan-500/20 transition-all"
                >
                  <div className="text-xs font-bold text-cyan-300 font-mono">👤 auditor</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Auditor Utama</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('pimpinan')}
                  className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-left hover:bg-blue-500/20 transition-all"
                >
                  <div className="text-xs font-bold text-blue-300 font-mono">🏛️ pimpinan</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pengarah Audit</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('pengawas')}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-left hover:bg-emerald-500/20 transition-all"
                >
                  <div className="text-xs font-bold text-emerald-300 font-mono">🛡️ pengawas</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pengawas SPI</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('pejabat')}
                  className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-2 text-left hover:bg-purple-500/20 transition-all"
                >
                  <div className="text-xs font-bold text-purple-300 font-mono">📋 pejabat</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pejabat PPK</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-left hover:bg-amber-500/20 transition-all sm:col-span-2"
                >
                  <div className="text-xs font-bold text-amber-300 font-mono">⚙️ admin / administrator</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Administrator Sistem</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER RESMI AURA ── */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#040714] py-8 px-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-cyan-400" />
            <span>© 2026 AURA  • Audit &amp; Risk Analytics • AI-Assisted Audit Intelligence Platform. All rights reserved.</span>
          </div>

          <div>
            Made With ❤️ by{' '}
            <a
              href="https://www.linkedin.com/in/papedatimur"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 decoration-cyan-400/50 transition-colors"
            >
              Enterdie
            </a>{' '}
            • Hak Cipta Dilindungi Undang-Undang
          </div>
        </div>
      </footer>
    </div>
  );
}
