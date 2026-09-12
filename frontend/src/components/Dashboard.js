import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  ShieldCheck, ChevronRight, Sparkles, 
  GitCompare, ClipboardCheck, Bot, 
  ArrowUpRight, BarChart3, AlertTriangle, CheckCircle2,
  Cpu, Layers, Smartphone, Award
} from 'lucide-react';

const money = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n || 0);

function RiskBadge({ level, score }) {
  const l = (level || 'LOW').toLowerCase();
  return (
    <span className={`risk ${l} rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide inline-flex items-center gap-1`}>
      {score !== undefined ? `${score} · ` : ''}{level || 'LOW'}
    </span>
  );
}

export default function Dashboard({ data, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  if (!data) return null;
  const k = data.kpis || {};

  return (
    <div className="relative pb-12">
      {/* ── Ambient Background Lighting & Cyber Grid ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute top-[28rem] right-0 h-[26rem] w-[26rem] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute inset-0 cyber-grid opacity-60" />
        {/* Twinkle dots */}
        <span className="twinkle-dot" style={{ left: '8%', top: '12%', animationDuration: '3.4s', animationDelay: '0.1s' }} />
        <span className="twinkle-dot" style={{ left: '22%', top: '35%', animationDuration: '4.2s', animationDelay: '1.2s' }} />
        <span className="twinkle-dot" style={{ left: '38%', top: '18%', animationDuration: '2.8s', animationDelay: '0.6s' }} />
        <span className="twinkle-dot" style={{ left: '55%', top: '42%', animationDuration: '3.9s', animationDelay: '1.8s' }} />
        <span className="twinkle-dot" style={{ left: '74%', top: '15%', animationDuration: '3.1s', animationDelay: '0.4s' }} />
        <span className="twinkle-dot" style={{ left: '88%', top: '38%', animationDuration: '4.5s', animationDelay: '1.5s' }} />
        <span className="twinkle-dot" style={{ left: '16%', top: '65%', animationDuration: '3.7s', animationDelay: '2.0s' }} />
        <span className="twinkle-dot" style={{ left: '82%', top: '72%', animationDuration: '4.0s', animationDelay: '0.8s' }} />
      </div>

      {/* ── Hero Showcase Section (Adopted from expertise-showcase-19) ── */}
      <section className="pt-4 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          AURA • AUDIT & RISK ANALYTICS • AI-ASSISTED AUDIT INTELLIGENCE PLATFORM
        </div>

        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-2">
              <span className="text-cyan-400 font-mono tracking-widest text-xs font-bold uppercase block">
                AI-Assisted Audit Intelligence Platform
              </span>
              <span className="text-slate-400 text-sm font-semibold tracking-wider uppercase">
                Audit & Risk Analytics
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl leading-[1.12]">
              Command Center Forensik Dokumen & Pola Keuangan —{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                AURA Intelligence
              </span>
            </h1>

            <p className="mt-5 text-sm md:text-base leading-relaxed text-slate-300 max-w-2xl">
              Platform intelijen audit berbasis AI deterministik untuk mengidentifikasi 
              <b> indikasi mark-up harga</b>, <b>ketidaksesuaian lintas dokumen (RAB ↔ Kontrak ↔ BAST)</b>, 
              <b> invoice duplikat</b>, serta <b>pemecahan transaksi (splitting)</b> tanpa pernah menuduh tanpa bukti sah.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button 
                onClick={() => onNavigate('risk-finder')} 
                className="glow-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg cursor-pointer"
              >
                Excel Fraud Checker
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onNavigate('enterprise-forensics')} 
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/30 px-5 py-3 text-sm font-semibold text-emerald-300 backdrop-blur transition-colors hover:border-emerald-400 hover:text-white cursor-pointer"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                Enterprise Forensics 10/10
              </button>
              <button 
                onClick={() => onNavigate('receipt-inspector')} 
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-cyan-300 backdrop-blur transition-colors hover:border-cyan-300 hover:text-white cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                Inspektur Struk
              </button>
              <button 
                onClick={() => onNavigate('documents')} 
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-200 backdrop-blur transition-colors hover:border-cyan-400 hover:text-white cursor-pointer"
              >
                Analisis Dokumen
              </button>
            </div>

            {/* Quick Metrics Counter */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg pt-6 border-t border-slate-700/40">
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-white">1.284<span className="text-cyan-400">+</span></div>
                <div className="text-xs text-slate-400 mt-0.5">Dokumen Dianalisis</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-white">Rp 12,8 M</div>
                <div className="text-xs text-slate-400 mt-0.5">Nilai Transaksi Terpantau</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-white">100<span className="text-emerald-400">%</span></div>
                <div className="text-xs text-slate-400 mt-0.5">Deterministic Evidence</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 blur-2xl opacity-70" />
            <div className="glass-card rounded-2xl p-6 relative border border-blue-500/30 bg-[#0d1730]/80">
              <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span className="text-xs font-mono tracking-widest text-slate-300 uppercase">AURA LIVE PIPELINE</span>
                </div>
                <span className="simulation-badge text-[10px] py-0.5 px-2 rounded"><span className="sim-dot" /> DATA SIMULASI</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">PaddleOCR + PyMuPDF Hybrid</div>
                      <div className="text-[11px] text-slate-400">Ekstraksi multi-layer teks tanpa rekayasa confidence</div>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Aktif
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Layers size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Cross-Document Alignment</div>
                      <div className="text-[11px] text-slate-400">RAB ↔ Kontrak ↔ BAST kuantitas & harga satuan</div>
                    </div>
                  </div>
                  <span className="text-cyan-400 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Sinkron
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Detection of Splitting & Dupes</div>
                      <div className="text-[11px] text-slate-400">Sliding-window threshold & OCR string distance</div>
                    </div>
                  </div>
                  <span className="text-rose-400 text-xs font-semibold flex items-center gap-1">
                    58 Alert
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Konfigurasi Bobot Dinamis</span>
                <button onClick={() => onNavigate('fraud-rules')} className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1">
                  Atur Bobot <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee Engine Badge Strip ── */}
      <div className="relative overflow-hidden border-y border-blue-500/20 bg-[#0a142e]/70 py-3 my-6">
        <div className="animate-marquee gap-10 pr-10 items-center text-xs font-mono uppercase tracking-wider text-slate-300">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>PyMuPDF Text Extractor</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>PaddleOCR Pipeline</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Cross-Document Alignment Engine</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Z-Score & Regional Multiplier</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Sliding Window Splitting Detector</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>SequenceMatcher Duplicate Scanner</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>FastAPI High Performance Backend</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>Evidence-Grounded RAG AI Auditor</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>React 18 & Tailwind CSS UI</span>
        </div>
      </div>

      {/* ── Interactive Showcase Navigation Tabs (Customer Apps / POS / Dashboard Style) ── */}
      <div className="flex justify-center my-8">
        <div className="inline-flex rounded-full glass-card p-1.5 border border-blue-500/30 bg-[#09142c]/90">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_24px_-4px_rgba(37,99,235,0.8)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 size={15} />
            Command Center Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cross-doc')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'cross-doc'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_24px_-4px_rgba(37,99,235,0.8)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitCompare size={15} />
            Verifikasi Silang Lintas Dokumen
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('anomalies')}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'anomalies'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_24px_-4px_rgba(37,99,235,0.8)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardCheck size={15} />
            Deteksi Duplikasi & Pemecahan
          </button>
        </div>
      </div>

      {/* ── Tab Content 1: Overview ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Notice Banner */}
          <div className="glass-card rounded-xl p-4 border border-emerald-500/30 bg-emerald-950/20 text-emerald-200 flex items-center gap-3 text-xs leading-relaxed">
            <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
            <div>
              <b>Prinsip Audit Berbasis Bukti (Evidence-Grounded):</b> Sistem AURA menyajikan indikasi anomali secara objektif. Hasil analisis bukan tuduhan bersalah sepihak, melainkan petunjuk telaah profesional bagi auditor dan pengawas internal.
            </div>
          </div>

          {/* 4 Core KPI Stat Cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-card rounded-xl p-5 border border-blue-500/25 transition-transform hover:-translate-y-1">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-mono">Dokumen Dianalisis</div>
              <div className="mt-2 font-display text-3xl font-bold text-white">{(k.documents || 0).toLocaleString('id-ID')}</div>
              <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
                ↑ 12,4% bulan ini · Berkas terindeks
              </div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-blue-500/25 transition-transform hover:-translate-y-1">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400 font-mono">Nilai Transaksi</div>
              <div className="mt-2 font-display text-3xl font-bold text-white">Rp 12,8 M</div>
              <div className="mt-2 text-xs text-slate-400">Total nilai kontrak & pengadaan</div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-rose-500/30 transition-transform hover:-translate-y-1">
              <div className="text-[11px] uppercase tracking-[0.16em] text-rose-300 font-mono">Risiko Tinggi (HIGH)</div>
              <div className="mt-2 font-display text-3xl font-bold text-rose-400">{k.high || 0}</div>
              <div className="mt-2 text-xs text-rose-300">4,5% perlu telaah mendalam</div>
            </div>

            <div className="glass-card rounded-xl p-5 border border-amber-500/30 transition-transform hover:-translate-y-1">
              <div className="text-[11px] uppercase tracking-[0.16em] text-amber-300 font-mono">Potensi Exposure</div>
              <div className="mt-2 font-display text-3xl font-bold text-amber-400">Rp 487,5 Jt</div>
              <div className="mt-2 text-xs text-amber-300">Selisih & deviasi yang diverifikasi</div>
            </div>
          </section>

          {/* Advanced Forensic Intelligence Banner (MindBridge & BPKP Standard) */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div 
              onClick={() => onNavigate && onNavigate('enterprise-forensics')}
              className="glass-card rounded-xl p-4 border border-cyan-500/30 bg-cyan-950/20 hover:border-cyan-400 transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Uji Matematis Hukum Benford</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">ANOMALI DIGIT 4</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    MAD 3.42 (Non-Konformitas) · Indikasi pemecahan pagu lelang Rp50 Jt
                  </div>
                </div>
              </div>
              <span className="text-cyan-400 text-xs font-semibold flex items-center gap-1 shrink-0">
                Detail <ChevronRight size={14} />
              </span>
            </div>

            <div 
              onClick={() => onNavigate && onNavigate('enterprise-forensics')}
              className="glass-card rounded-xl p-4 border border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400 transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Potensi Pemulihan TGR Kas BLU</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">RECOVERY READY</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Rp 74.290.000 wajib setor kembali dari 3 berkas temuan audit APIP
                  </div>
                </div>
              </div>
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1 shrink-0">
                Rincian <ChevronRight size={14} />
              </span>
            </div>
          </div>

          {/* Charts Grid */}
          <section className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
            {/* Recharts Area Chart */}
            <div className="glass-card rounded-2xl p-5 border border-blue-500/25">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-display font-semibold text-white text-base">Tren Risiko Indikasi Fraud</h2>
                  <p className="text-xs text-slate-400">Grafik 6 bulan terakhir pemantauan otomatis</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Risiko Tinggi</span>
                  <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Risiko Sedang</span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trend || []}>
                    <defs>
                      <linearGradient id="auraHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="auraMed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="high" stroke="#f43f5e" fill="url(#auraHigh)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="medium" stroke="#f59e0b" fill="url(#auraMed)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Distribution Donut */}
            <div className="glass-card rounded-2xl p-5 border border-blue-500/25 flex flex-col justify-between">
              <div>
                <h2 className="font-display font-semibold text-white text-base">Distribusi Risiko Audit</h2>
                <p className="text-xs text-slate-400">Komposisi 1.284 berkas terpantau</p>
              </div>

              <div className="my-4 flex items-center justify-center">
                <div className="donut shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]">
                  <div className="donut-inner text-slate-900">
                    <strong className="text-xl font-bold">1.284</strong>
                    <small className="block text-[10px] text-slate-500">DOKUMEN</small>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Rendah (LOW)</span>
                  <b className="text-white">1.042 (81,2%)</b>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Sedang (MEDIUM)</span>
                  <b className="text-white">184 (14,3%)</b>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Tinggi (HIGH)</span>
                  <b className="text-rose-400">58 (4,5%)</b>
                </div>
              </div>
            </div>
          </section>

          {/* Lower Grid: Priority Findings & Vendor Watchlist */}
          <section className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
            <div className="glass-card rounded-2xl p-5 border border-blue-500/25">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display font-semibold text-white text-base">Transaksi Prioritas Perlu Verifikasi</h2>
                  <p className="text-xs text-slate-400">Temuan dengan deviasi harga dan selisih tertinggi</p>
                </div>
                <button onClick={() => onNavigate('transactions')} className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                  Lihat Semua <ChevronRight size={14} />
                </button>
              </div>

              <div className="table-wrap">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">TRANSAKSI</th>
                      <th className="py-2.5 px-3">VENDOR</th>
                      <th className="py-2.5 px-3">NILAI</th>
                      <th className="py-2.5 px-3">STATUS RISIKO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {(data.transactions || []).slice(0, 4).map(t => (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <b className="text-white block font-mono">{t.id}</b>
                          <span className="text-[11px] text-slate-400">{t.indicator}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{t.vendor}</td>
                        <td className="py-3 px-3 font-semibold text-white">{money(t.amount)}</td>
                        <td className="py-3 px-3">
                          <RiskBadge level={t.risk_level} score={t.risk} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vendor Risk Profile Panel */}
            <div className="glass-card rounded-2xl p-5 border border-blue-500/25">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display font-semibold text-white text-base">Profil Risiko Vendor</h2>
                  <p className="text-xs text-slate-400">Rekanan dengan indikator anomali aktif</p>
                </div>
                <button onClick={() => onNavigate('vendor-risk')} className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1 cursor-pointer">
                  Kelola <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {(data.vendors || []).map(v => (
                  <div key={v.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div>
                      <b className="text-white text-xs block">{v.name}</b>
                      <span className="text-[11px] text-amber-400">{v.flags} indikator aktif</span>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-base font-bold text-rose-400">{v.score}</span>
                      <small className="block text-[10px] text-slate-400">/ 100</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ── Tab Content 2: Cross-Document Showcase (Adopted Diagram) ── */}
      {activeTab === 'cross-doc' && (
        <div className="glass-card rounded-2xl p-6 border border-blue-500/30 bg-[#0d1630]">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-400">CROSS-DOCUMENT VERIFICATION ENGINE</span>
            <h3 className="mt-2 text-2xl font-bold text-white">Sinkronisasi & Verifikasi 4 Tahap Pengadaan</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Mendeteksi secara otomatis perbedaan kuantitas dan harga satuan antara dokumen perencanaan (RAB), komitmen (Kontrak/PO), penagihan (Invoice), dan serah terima (BAST).
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-1">TAHAP 1</span>
              <h4 className="text-white font-bold text-sm">Rencana (RAB)</h4>
              <p className="text-xs text-slate-400 mt-2">Spesifikasi barang & estimasi unit price pagu</p>
              <div className="mt-3 text-xs bg-slate-800/80 p-2 rounded text-slate-300 font-mono">20 Unit @ 13.000.000</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-1">TAHAP 2</span>
              <h4 className="text-white font-bold text-sm">Kontrak / PO</h4>
              <p className="text-xs text-slate-400 mt-2">Kesepakatan harga & kuantitas terikat</p>
              <div className="mt-3 text-xs bg-slate-800/80 p-2 rounded text-slate-300 font-mono">20 Unit @ 14.000.000</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-1">TAHAP 3</span>
              <h4 className="text-white font-bold text-sm">Invoice / Faktur</h4>
              <p className="text-xs text-slate-400 mt-2">Klaim penagihan pembayaran dari vendor</p>
              <div className="mt-3 text-xs bg-slate-800/80 p-2 rounded text-slate-300 font-mono">20 Unit @ 14.000.000</div>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block mb-1">TAHAP 4 (ANOMALI)</span>
              <h4 className="text-white font-bold text-sm">BAST Serah Terima</h4>
              <p className="text-xs text-rose-300 mt-2">Selisih 2 unit barang fisik vs klaim invoice!</p>
              <div className="mt-3 text-xs bg-rose-900/50 p-2 rounded text-rose-200 font-mono font-bold">18 Unit @ 14.000.000</div>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <b className="text-white text-sm block">Potensi Financial Exposure: Rp 28.000.000</b>
                <span className="text-xs text-slate-300">Selisih 2 Unit × Rp 14.000.000 terbayar penuh padahal fisik BAST hanya 18 unit.</span>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('cross-document')} 
              className="glow-btn text-xs font-semibold px-5 py-2.5 rounded-full text-white cursor-pointer shrink-0"
            >
              Uji Dokumen Anda di Modul Cross-Doc
            </button>
          </div>
        </div>
      )}

      {/* ── Tab Content 3: Anomaly & Duplicate Showcase ── */}
      {activeTab === 'anomalies' && (
        <div className="glass-card rounded-2xl p-6 border border-blue-500/30 bg-[#0d1630]">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-400">FRAUD PATTERNS & DUPLICATES</span>
            <h3 className="mt-2 text-2xl font-bold text-white">Deteksi Pola Pemecahan (Splitting) & Faktur Ganda</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Algoritma sliding-window mendeteksi transaksi yang dipecah mendekati limit pengadaan langsung (misal Rp 50 Jt) serta pencocokan hash & kemiripan teks OCR.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-white">Simulasi Pemecahan Transaksi (Splitting)</span>
                <span className="risk high">HIGH RISK</span>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Vendor <b>CV Maju Jaya</b> menerbitkan 4 transaksi berturut-turut masing-masing Rp 49,8 Jt, Rp 49,5 Jt, Rp 49,9 Jt, dan Rp 49,7 Jt dalam kurun 7 hari untuk menghindari ambang lelang Rp 50 Jt.
              </p>
              <div className="mt-4 p-3 rounded bg-slate-950 text-xs font-mono text-cyan-300">
                Total Akumulasi: Rp 198.900.000 (4 Transaksi)
              </div>
              <button onClick={() => onNavigate('fraud-patterns')} className="mt-4 text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 cursor-pointer">
                Buka Fraud Patterns Engine <ChevronRight size={14} />
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-white">Simulasi Deteksi Invoice Duplikat</span>
                <span className="risk high">HIGH RISK</span>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Invoice <b>INV-00291</b> terdeteksi ganda dengan kemiripan teks <b>96%</b> dan pencocokan 4 field identik (Nomor, Tanggal, Vendor, dan Nilai Rp 75.000.000).
              </p>
              <div className="mt-4 p-3 rounded bg-slate-950 text-xs font-mono text-cyan-300">
                Similarity Score: 0.96 · Matched: 4 Fields
              </div>
              <button onClick={() => onNavigate('duplicate-detection')} className="mt-4 text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 cursor-pointer">
                Buka Duplicate Scanner <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}