import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  FileSpreadsheet, Upload, Download, AlertTriangle, ShieldCheck, 
  ArrowRight, CheckCircle2, RefreshCw, FileText, Search, Filter, 
  ChevronDown, ChevronUp, Layers, HelpCircle, Sparkles, ExternalLink
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api`;
const money = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n || 0);

const PIPELINE_STEPS = [
  "Memeriksa pembayaran ganda…",
  "Menganalisis pola nominal…",
  "Mencocokkan nama vendor…",
  "Mendeteksi transaksi terpecah…",
  "Menghitung risk score…"
];

const FAQS = [
  {
    q: "Format file apa saja yang didukung?",
    a: "File Excel (.xlsx) dan CSV dengan ukuran maksimal 10 MB atau 50.000 baris per file. Cukup drag & drop file Anda ke area unggah — tidak perlu instal software apa pun."
  },
  {
    q: "Kolom apa saja yang harus ada di file saya?",
    a: "Dua kolom wajib: nama vendor (mis. 'Vendor', 'Supplier', atau 'Pemasok') dan nominal (mis. 'Jumlah', 'Nominal', atau 'Total'). Kolom No Invoice dan Tanggal bersifat opsional, tetapi sangat disarankan karena membuat deteksi pembayaran ganda dan split transaction lebih akurat. Nama kolom dikenali otomatis dalam Bahasa Indonesia maupun Inggris."
  },
  {
    q: "Bagaimana format nominal yang benar?",
    a: "Sistem memahami angka biasa (1500000) maupun format rupiah seperti 'Rp 1.500.000,00' atau '1,500,000.00'. Anda juga bisa mengunduh template Excel resmi lewat tombol 'Unduh Template Excel' di jendela unggah agar formatnya pasti sesuai."
  },
  {
    q: "Apakah file saya disimpan di server?",
    a: "Tidak. File Anda hanya diproses sesaat di memori server untuk menjalankan analisis deterministik, lalu langsung dibersihkan. Kami tidak menyimpan file maupun isi transaksi tanpa instruksi penyimpanan berkas resmi."
  },
  {
    q: "Indikator apa saja yang digunakan untuk mendeteksi fraud?",
    a: "Lima pemeriksaan otomatis: (1) Pembayaran Ganda — invoice, vendor, dan nominal identik yang muncul lebih dari sekali; (2) Transaksi Tidak Wajar — nominal yang melampaui batas statistik (Q3 + 3× IQR) dan jauh dari rata-rata vendor; (3) Vendor Mirip — nama vendor dengan kemiripan di atas 75% setelah normalisasi; (4) Split Transaction — tiga pembayaran atau lebih di bawah Rp50 juta untuk vendor yang sama di hari yang sama; (5) Risk Score — skor 0–99 per temuan berdasarkan besaran penyimpangan."
  },
  {
    q: "Apakah temuan sistem berarti pasti fraud?",
    a: "Tidak. Setiap temuan adalah indikasi yang patut diperiksa lebih lanjut, bukan vonis hukum. Gunakan Risk Score untuk memprioritaskan pemeriksaan: ≥85 berarti Tinggi, ≥70 berarti Sedang. Keputusan akhir tetap berada di tangan auditor atau tim inspektorat."
  }
];

export default function RiskFinderView() {
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFinding, setExpandedFinding] = useState(null);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const fileInputRef = useRef(null);

  // Auto pipeline steps animation while analyzing
  useEffect(() => {
    let interval = null;
    if (analyzing) {
      setCurrentStep(0);
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % PIPELINE_STEPS.length);
      }, 700);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [analyzing]);

  const runDemoAnalysis = async () => {
    setAnalyzing(true);
    setError('');
    setResult(null);
    try {
      // Simulate pipeline progression
      await new Promise(r => setTimeout(r, 1200));
      const res = await axios.post(`${API}/risk-finder/demo/analyze`);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal memuat analisis demo.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API}/risk-finder/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal menganalisis file. Pastikan kolom Vendor dan Nominal tersedia.');
    } finally {
      setAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    window.open(`${API}/risk-finder/template`, '_blank');
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    setDownloadingReport(true);
    try {
      const res = await axios.post(`${API}/risk-finder/report`, result, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `laporan-audit-fraud-${new Date().toISOString().slice(0, 10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Gagal mengunduh laporan Excel.');
    } finally {
      setDownloadingReport(false);
    }
  };

  const findings = result?.findings || [];
  const filteredFindings = findings.filter(f => {
    if (filterType !== 'all' && f.type !== filterType) return false;
    if (filterSeverity !== 'all' && f.severity !== filterSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchVendor = f.vendor?.toLowerCase().includes(q);
      const matchReason = f.reasons?.some(r => r.toLowerCase().includes(q));
      if (!matchVendor && !matchReason) return false;
    }
    return true;
  });

  return (
    <div className="relative pb-16">
      {/* ── Header ── */}
      <div className="page-head mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AURA • RISK FINDER ENGINE
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Excel & CSV Fraud Checker
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl">
            Unggah file laporan transaksi (Excel / CSV) untuk mendeteksi 5 indikasi penyimpangan secara otomatis: 
            <b> Pembayaran Ganda</b>, <b>Transaksi Outlier</b>, <b>Kemiripan Vendor (≥75%)</b>, <b>Pemecahan Transaksi (Splitting)</b>, dan <b>Kalkulasi Risk Score (0–99)</b>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadTemplate}
            className="ghost-btn text-xs"
            title="Download template Excel dengan format standar"
          >
            <Download size={14} className="text-cyan-400" />
            Unduh Template Excel
          </button>
          <button 
            onClick={runDemoAnalysis}
            disabled={analyzing}
            className="primary-btn text-xs"
          >
            <RefreshCw size={14} className={analyzing ? "animate-spin" : ""} />
            Coba Demo Transaksi (135 Baris)
          </button>
        </div>
      </div>

      {/* ── Drag & Drop Upload Zone ── */}
      <div className="glass-card rounded-2xl p-8 mb-8 border border-blue-500/30 bg-[#0a1226]/80 text-center relative overflow-hidden">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".xlsx,.xls,.csv" 
          className="hidden" 
          id="risk-finder-file-input"
        />
        
        {analyzing ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-cyan-400/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-white font-mono tracking-wide">
              {PIPELINE_STEPS[currentStep]}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Menjalankan 5 tahapan audit forensik berbasis statistik deterministik…
            </p>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/40 flex items-center justify-center mb-4 text-cyan-400 shadow-[0_0_24px_rgba(37,99,235,0.25)]">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Seret & Letakkan File Excel / CSV di Sini
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mb-6">
              Mendukung format <b>.xlsx</b> dan <b>.csv</b> hingga 50.000 baris. Sistem otomatis mengenali kolom nama vendor, nominal, tanggal, dan invoice.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <label 
                htmlFor="risk-finder-file-input" 
                className="glow-btn cursor-pointer inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold text-white uppercase tracking-wider"
              >
                <Upload size={15} />
                Pilih File dari Komputer
              </label>
              <button 
                onClick={runDemoAnalysis}
                className="ghost-btn rounded-full px-5 py-2.5 text-xs"
              >
                Gunakan Data Simulasi Demo
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}
      </div>

      {/* ── Analysis Results Section ── */}
      {result && (
        <div className="space-y-6">
          {/* Top Summary Banner */}
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-[#0d1730]/90">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/50 pb-5">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">RINGKASAN HASIL AUDIT</span>
                <h3 className="text-xl font-bold text-white mt-1">
                  File: <span className="text-cyan-300">{result.file_name}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dianalisis dalam <b>{result.analysis_seconds} detik</b> • Total <b>{result.total_transactions} transaksi</b> diperiksa.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadReport}
                  disabled={downloadingReport}
                  className="glow-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-white cursor-pointer"
                >
                  <Download size={14} />
                  {downloadingReport ? 'Membuat Laporan Excel…' : 'Ekspor Laporan Audit (.xlsx)'}
                </button>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-mono">SKOR RISIKO</div>
                <div className={`text-2xl font-bold font-mono mt-1 ${result.summary.risk_score >= 85 ? 'text-rose-400' : result.summary.risk_score >= 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {result.summary.risk_score}<span className="text-xs text-slate-500">/99</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                  {result.summary.risk_score >= 85 ? 'Risiko Tinggi' : result.summary.risk_score >= 70 ? 'Risiko Sedang' : 'Risiko Rendah'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-mono">TOTAL TEMUAN</div>
                <div className="text-2xl font-bold font-mono text-white mt-1">
                  {result.summary.total_findings}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Indikasi anomali</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-mono">DUPLIKAT</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  {result.summary.duplicates}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Pembayaran ganda</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-mono">OUTLIER</div>
                <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                  {result.summary.outliers}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Penyimpangan nilai</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-mono">VENDOR MIRIP</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                  {result.summary.similar_vendors}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Kemiripan ≥ 75%</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 font-mono">SPLITTING</div>
                <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
                  {result.summary.split_transactions}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Pecah pagu &lt; 50jt</div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-mono mr-1">TIPE TEMUAN:</span>
              {[
                { id: 'all', label: 'Semua' },
                { id: 'duplicate', label: 'Pembayaran Ganda' },
                { id: 'outlier', label: 'Outlier Statistik' },
                { id: 'vendor_similarity', label: 'Vendor Mirip' },
                { id: 'split', label: 'Split Transaksi' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setFilterType(t.id)}
                  className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                    filterType === t.id 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'text-slate-400 hover:text-white bg-slate-800/40 border border-slate-700/50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="search-box text-xs flex-1 sm:w-64">
                <Search size={14} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari vendor atau alasan…" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Findings List */}
          <div className="space-y-3">
            {filteredFindings.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center text-slate-400 text-xs">
                Tidak ada temuan yang cocok dengan filter yang dipilih.
              </div>
            ) : (
              filteredFindings.map((finding) => {
                const isExpanded = expandedFinding === finding.id;
                return (
                  <div 
                    key={finding.id} 
                    className="glass-card rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-all overflow-hidden"
                  >
                    <div 
                      className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                      onClick={() => setExpandedFinding(isExpanded ? null : finding.id)}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-[260px]">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                          finding.risk_score >= 85 ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300' :
                          finding.risk_score >= 70 ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' :
                          'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                        }`}>
                          {finding.risk_score}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold text-slate-400">{finding.id}</span>
                            <span className="text-sm font-bold text-white">{finding.vendor}</span>
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                              finding.type === 'duplicate' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                              finding.type === 'outlier' ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
                              finding.type === 'split' ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' :
                              'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                            }`}>
                              {finding.type.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="mt-1 space-y-0.5">
                            {finding.reasons?.map((reason, idx) => (
                              <div key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                {reason}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-right">
                        <div>
                          <div className="text-xs text-slate-400 font-mono">TOTAL NILAI</div>
                          <div className="text-sm font-bold font-mono text-cyan-300">
                            {money(finding.amount)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {finding.transactions?.length} transaksi terkait
                          </div>
                        </div>

                        <div className="text-slate-400">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Details: Transactions Breakdown */}
                    {isExpanded && (
                      <div className="border-t border-slate-800 bg-slate-950/60 p-5">
                        <div className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                          <FileText size={14} className="text-cyan-400" />
                          Rincian Transaksi Yang Terindikasi:
                        </div>
                        <div className="table-wrap">
                          <table className="w-full text-xs text-left">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                                <th className="p-2">ID Transaksi</th>
                                <th className="p-2">Vendor</th>
                                <th className="p-2">Invoice</th>
                                <th className="p-2">Tanggal</th>
                                <th className="p-2 text-right">Nominal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {finding.transactions?.map((tx, idx) => (
                                <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900/40">
                                  <td className="p-2 font-mono text-cyan-300">{tx.id}</td>
                                  <td className="p-2 text-white font-medium">{tx.vendor}</td>
                                  <td className="p-2 font-mono text-slate-300">{tx.invoice || '-'}</td>
                                  <td className="p-2 text-slate-400">{tx.date || '-'}</td>
                                  <td className="p-2 text-right font-mono font-semibold text-emerald-400">
                                    {money(tx.amount)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── FAQ Section (Adopted directly from risk-finder-7.emergent.host) ── */}
      <div className="mt-14 glass-card rounded-2xl p-8 border border-slate-800 bg-[#0a1226]/80">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300 mb-3">
            <HelpCircle size={14} /> PANDUAN & PERTANYAAN UMUM
          </div>
          <h2 className="text-2xl font-bold text-white">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Pelajari metodologi deteksi, format berkas, serta integritas keamanan data transaksi audit.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-xl border border-slate-800/80 bg-slate-900/50 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-cyan-300"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} className="text-cyan-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
