import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, XCircle, 
  Upload, Search, FileText, Smartphone, Database, 
  History, BarChart2, Plus, Sparkles, RefreshCw, 
  Building2, CreditCard, Clock, UserX, AlertOctagon,
  ArrowRight, ShieldCheck, Layers, FileSpreadsheet
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001'}/api`;
const money = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n || 0);

export default function ReceiptInspectorView() {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner', 'cekrekening', 'history', 'analytics'
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Flagged accounts state
  const [flaggedAccounts, setFlaggedAccounts] = useState([]);
  const [accountSearch, setAccountSearch] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    account_number: '',
    bank: 'BCA',
    account_name: '',
    category: 'Modus Struk Editan',
    chronology: '',
    total_loss: ''
  });

  // Upload state
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  useEffect(() => {
    fetchSamples();
    fetchFlaggedAccounts();
  }, []);

  const fetchSamples = async () => {
    try {
      const res = await axios.get(`${API}/receipts/samples`);
      setSamples(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedSample(res.data[1]); // default: tampered sample
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFlaggedAccounts = async () => {
    try {
      const res = await axios.get(`${API}/receipts/flagged-accounts`);
      setFlaggedAccounts(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifySample = async (sample) => {
    setSelectedSample(sample);
    setVerifying(true);
    setError('');
    setResult(null);
    setUploadedFileName('');

    try {
      await new Promise(r => setTimeout(r, 800)); // smooth scanning effect
      const res = await axios.post(`${API}/receipts/verify`, {
        sample_id: sample.id,
        cashier: 'Auditor Investigasi Utama'
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal memverifikasi sampel struk.');
    } finally {
      setVerifying(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setVerifying(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('cashier', 'Auditor Investigasi Utama');

    try {
      const res = await axios.post(`${API}/receipts/verify/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal memindai gambar struk. Pastikan berkas berformat JPG/PNG.');
    } finally {
      setVerifying(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!newReport.account_number || !newReport.account_name) {
      alert('Nomor rekening dan nama pemilik wajib diisi!');
      return;
    }

    try {
      await axios.post(`${API}/receipts/flagged-accounts`, {
        ...newReport,
        total_loss: parseFloat(newReport.total_loss || 0)
      });
      alert('Laporan rekening penipuan berhasil dicatat ke database!');
      setShowReportModal(false);
      setNewReport({
        account_number: '',
        bank: 'BCA',
        account_name: '',
        category: 'Modus Struk Editan',
        chronology: '',
        total_loss: ''
      });
      fetchFlaggedAccounts();
    } catch (err) {
      alert('Gagal mengirim laporan: ' + (err.response?.data?.detail || err.message));
    }
  };

  const filteredAccounts = flaggedAccounts.filter(acc => {
    const q = accountSearch.toLowerCase();
    return (
      acc.account_number.toLowerCase().includes(q) ||
      acc.account_name.toLowerCase().includes(q) ||
      acc.bank.toLowerCase().includes(q) ||
      acc.category.toLowerCase().includes(q)
    );
  });

  const log = result?.log;
  const checks = log?.checks || [];

  return (
    <div className="relative pb-16">
      {/* ── Header ── */}
      <div className="page-head mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AURA • RECEIPT & TRANSFER FORENSICS
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Inspektur Struk & Bukti Transfer
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl">
            Verifikasi keaslian screenshot transfer mobile banking, deteksi manipulasi penimpaan teks (*font tampering*), 
            validasi format nomor referensi bank, serta skrining instan ke database rekening penipuan.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
          {[
            { id: 'scanner', label: 'Inspektur Struk', icon: Smartphone },
            { id: 'cekrekening', label: 'Database Rekening Penipuan', icon: Database },
            { id: 'analytics', label: 'Statistik & Cabang', icon: BarChart2 }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                  active 
                    ? 'bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.5)]' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── TAB 1: INSPEKTUR STRUK ── */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">
          {/* Preset Samples Selector */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-[#0a1226]/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                PILIH PRESET BUKTI TRANSFER UNTUK SIMULASI AUDIT FORENSIK:
              </span>
              <span className="text-[11px] text-slate-500 font-mono">3 SKENARIO REALISTIK</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {samples.map((s) => {
                const isSelected = selectedSample?.id === s.id && !uploadedFileName;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleVerifySample(s)}
                    className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-cyan-400/80 bg-blue-950/40 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                        : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                        s.tone === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        s.tone === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {s.tone === 'emerald' ? 'VALID / ASLI' : s.tone === 'amber' ? 'MANIPULASI FONT' : 'BLACKLIST REKENING'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-300">{money(s.receipt.amount)}</span>
                    </div>

                    <div className="font-bold text-sm text-white">{s.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{s.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Custom Screenshot */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-dashed border-blue-500/40 bg-blue-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-cyan-400">
                <Upload size={18} />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Atau Unggah Screenshot Struk Nyata Anda Sendiri</div>
                <div className="text-[11px] text-slate-400">Mendukung format JPG, PNG dari m-BCA, Livin', BRImo, BNI Mobile, BSI Mobile</div>
              </div>
            </div>

            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept="image/*" 
                className="hidden" 
                id="receipt-file-input"
              />
              <label 
                htmlFor="receipt-file-input"
                className="ghost-btn text-xs rounded-full px-4 py-2 cursor-pointer inline-flex items-center gap-2"
              >
                <Upload size={13} />
                Pilih Berkas Gambar
              </label>
            </div>
          </div>

          {/* Verification Inspection Output */}
          {verifying ? (
            <div className="glass-card rounded-2xl p-12 text-center border border-cyan-500/30 bg-[#0d1730]">
              <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mx-auto mb-4" />
              <h3 className="text-base font-bold text-white font-mono">
                Menjalankan Analisis Forensik Tipografi & Pemeriksaan Jurnal Bank…
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Error Level Analysis (ELA) • Cek Konsistensi Pixel Font • Validasi Regex Jurnal • Pencocokan Blacklist
              </p>
            </div>
          ) : result && log ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6">
              {/* Left Column: Visual Simulated Struk Card */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-[#070c1e] relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                        {log.bank_source}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white tracking-wider">m-{log.bank_source} TRANSFER</div>
                        <div className="text-[10px] text-slate-400 font-mono">BUKTI TRANSAKSI DIGITAL</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      BERHASIL
                    </span>
                  </div>

                  {/* Tampered Visual Box */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Waktu Transaksi:</span>
                      <span className="text-white">{log.transaction_time?.slice(0, 19).replace('T', ' ')}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Dari Rekening:</span>
                      <span className="text-white">{log.sender_name} ({log.sender_account})</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Ke Rekening:</span>
                      <span className="text-white">{log.recipient_name} ({log.recipient_account})</span>
                    </div>
                    
                    {/* Amount Box with Visual Highlight if Tampered */}
                    <div className={`p-3 rounded-lg border ${
                      log.render?.tampered_amount || log.trust_score < 60
                        ? 'border-rose-500/60 bg-rose-950/30'
                        : 'border-emerald-500/40 bg-emerald-950/20'
                    }`}>
                      <div className="text-[10px] text-slate-400">JUMLAH TRANSFER:</div>
                      <div className={`text-xl font-bold tracking-wider mt-0.5 ${
                        log.render?.tampered_amount || log.trust_score < 60 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {money(log.amount)}
                      </div>
                      {log.render?.tampered_amount && (
                        <div className="text-[10px] text-rose-300 font-sans mt-1 flex items-center gap-1 font-semibold">
                          <AlertTriangle size={12} /> Terindikasi timpaan font berbeda & baseline bergeser!
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>No. Referensi:</span>
                      <span className={`font-bold ${log.reference_number?.length < 8 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {log.reference_number || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Pemeriksa: <b>{log.cashier}</b></span>
                  <span>ID Audit: <b className="text-cyan-400">{log.id}</b></span>
                </div>
              </div>

              {/* Right Column: Forensic Audit Report Card */}
              <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-[#0d1730]">
                {/* Status Hero Banner */}
                <div className={`p-4 rounded-xl border mb-6 ${
                  log.status === 'BAHAYA' 
                    ? 'border-rose-500/50 bg-rose-950/40 text-rose-200' 
                    : log.status === 'JANGGAL'
                    ? 'border-amber-500/50 bg-amber-950/40 text-amber-200'
                    : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {log.status === 'BAHAYA' ? <AlertOctagon className="w-5 h-5 text-rose-400" /> :
                       log.status === 'JANGGAL' ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      <span className="font-bold text-sm tracking-wide">{log.status_label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400">TRUST SCORE:</span>
                      <span className="text-xl font-bold font-mono ml-2">{log.trust_score}<span className="text-xs">/100</span></span>
                    </div>
                  </div>
                  <p className="text-xs mt-2 leading-relaxed opacity-90 font-medium">
                    {log.status_message}
                  </p>
                </div>

                {/* 4 Automated Checks Accordion List */}
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    HASIL VERIFIKASI 4 LAPIS KEASLIAN:
                  </div>

                  {checks.map((check, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3.5 rounded-xl border ${
                        check.passed 
                          ? 'border-emerald-500/20 bg-emerald-950/10' 
                          : 'border-rose-500/30 bg-rose-950/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {check.passed ? (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle size={16} className="text-rose-400 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-white">{check.name}</span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                          check.passed ? 'text-emerald-400' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          {check.passed ? 'LOLOS (0 PENALTI)' : `-${check.penalty} PENALTI`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1.5 pl-6 leading-relaxed">
                        {check.detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">
                    Potensi kerugian tertahan: <b className="text-emerald-400 font-mono">{money(result.prevented_loss)}</b>
                  </span>
                  <button 
                    onClick={() => {
                      setNewReport({
                        account_number: log.sender_account,
                        bank: log.bank_source,
                        account_name: log.sender_name,
                        category: 'Modus Struk Editan',
                        chronology: `Terdeteksi struk transfer manipulasi senilai ${money(log.amount)} dengan referensi ${log.reference_number}.`,
                        total_loss: log.amount
                      });
                      setShowReportModal(true);
                    }}
                    className="danger-btn text-xs"
                  >
                    <UserX size={14} />
                    Laporkan Rekening Pengirim Ini
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center text-slate-400 text-xs">
              Pilih salah satu preset di atas atau unggah screenshot struk untuk memulai verifikasi.
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: DATABASE REKENING PENIPUAN (CEKREKENING) ── */}
      {activeTab === 'cekrekening' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-[#0a1226]/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Daftar Rekening Rekanan & Oknum Terindikasi Penipuan</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Database nomor rekening bank yang pernah dilaporkan terkait modus struk palsu, invoice fiktif, atau penipuan online.
              </p>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="primary-btn text-xs rounded-full px-5 py-2.5"
            >
              <Plus size={14} />
              Laporkan Rekening Baru
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text"
              placeholder="Cari nomor rekening, nama pemilik, bank, atau kategori penipuan…"
              value={accountSearch}
              onChange={e => setAccountSearch(e.target.value)}
              className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder-slate-500"
            />
          </div>

          {/* Accounts Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <div className="table-wrap">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-mono">
                    <th className="p-3.5">Nomor Rekening</th>
                    <th className="p-3.5">Bank</th>
                    <th className="p-3.5">Nama Pemilik</th>
                    <th className="p-3.5">Laporan</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Total Kerugian</th>
                    <th className="p-3.5">Laporan Terakhir</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((acc, idx) => (
                    <tr key={idx} className="border-b border-slate-900 hover:bg-slate-900/40">
                      <td className="p-3.5 font-mono font-bold text-rose-300">
                        {acc.account_number}
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-cyan-300 font-mono text-[11px]">
                          {acc.bank}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-white">{acc.account_name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-mono font-bold text-[11px]">
                          {acc.report_count}× Terlapor
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">{acc.category}</td>
                      <td className="p-3.5 font-mono text-emerald-400 font-semibold">{money(acc.total_loss)}</td>
                      <td className="p-3.5 text-slate-400 text-[11px]">{acc.last_reported_at?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: STATISTIK & CABANG (ANALYTICS) ── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat glass-card">
              <div className="stat-label">TOTAL STRUK DIPINDAI</div>
              <strong>140</strong>
              <small className="text-slate-400">8 minggu terakhir</small>
            </div>
            <div className="stat glass-card">
              <div className="stat-label">STRUK PALSU DICEGAT</div>
              <strong className="text-rose-400">51</strong>
              <small className="text-rose-400">36.4% rasio indikasi fraud</small>
            </div>
            <div className="stat glass-card">
              <div className="stat-label">STATUS JANGGAL</div>
              <strong className="text-amber-400">22</strong>
              <small className="text-amber-400">Perlu cek mutasi koran</small>
            </div>
            <div className="stat glass-card">
              <div className="stat-label">MODAL TERSELAMATKAN</div>
              <strong className="text-emerald-400">Rp 178,7 Jt</strong>
              <small className="text-emerald-400">Total nominal tertahan</small>
            </div>
          </div>

          {/* Branch Breakdown */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-[#0a1226]/80">
            <h3 className="text-base font-bold text-white mb-4">Pencegahan Fraud Per Unit / Loket Kampus</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Loket Keuangan Rektorat / BKU', fraud: 68, loss: 196544100 },
                { name: 'Unit Layanan FEB Uncen Jayapura', fraud: 9, loss: 12300000 },
                { name: 'Koperasi & Kasir Unit Usaha', fraud: 5, loss: 10100000 }
              ].map((b, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-xs font-semibold text-white">{b.name}</div>
                  <div className="mt-3 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Struk Dicegat:</span>
                    <span className="font-mono font-bold text-rose-400">{b.fraud} struk</span>
                  </div>
                  <div className="mt-1 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Dana Terselamatkan:</span>
                    <span className="font-mono font-bold text-emerald-400">{money(b.loss)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Lapor Rekening Penipuan Baru ── */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-box max-w-lg">
            <h2>Laporkan Rekening Penipuan / Rekanan Bermasalah</h2>
            <p className="text-xs text-slate-400 mb-4">
              Rekening yang dilaporkan akan otomatis memicu status <b>BAHAYA</b> jika muncul di struk atau invoice SPJ mana pun.
            </p>

            <form onSubmit={handleSubmitReport} className="space-y-3 text-xs">
              <div className="form-row">
                <div>
                  <label className="field-label">Bank:</label>
                  <select 
                    value={newReport.bank} 
                    onChange={e => setNewReport({...newReport, bank: e.target.value})}
                    className="form-input"
                  >
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BRI">BRI</option>
                    <option value="BNI">BNI</option>
                    <option value="BSI">BSI</option>
                    <option value="CIMB">CIMB Niaga</option>
                    <option value="Permata">Permata</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Nomor Rekening:</label>
                  <input 
                    type="text" 
                    required
                    placeholder="mis. 5410982311" 
                    value={newReport.account_number}
                    onChange={e => setNewReport({...newReport, account_number: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Nama Pemilik Rekening:</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nama sesuai buku tabungan" 
                  value={newReport.account_name}
                  onChange={e => setNewReport({...newReport, account_name: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div>
                  <label className="field-label">Kategori Penipuan:</label>
                  <select 
                    value={newReport.category} 
                    onChange={e => setNewReport({...newReport, category: e.target.value})}
                    className="form-input"
                  >
                    <option value="Modus Struk Editan">Modus Struk Editan</option>
                    <option value="Bukti Transfer Palsu">Bukti Transfer Palsu</option>
                    <option value="Invoice / Kwitansi Fiktif">Invoice / Kwitansi Fiktif</option>
                    <option value="Penipuan Pengadaan / Rekanan">Penipuan Pengadaan / Rekanan</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Estimasi Kerugian (Rp):</label>
                  <input 
                    type="number" 
                    placeholder="mis. 5000000" 
                    value={newReport.total_loss}
                    onChange={e => setNewReport({...newReport, total_loss: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Kronologi Kejadian Singkat:</label>
                <textarea 
                  rows={3} 
                  placeholder="Jelaskan bagaimana modus manipulasi struk / transfer dilakukan…"
                  value={newReport.chronology}
                  onChange={e => setNewReport({...newReport, chronology: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="modal-actions pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowReportModal(false)}
                  className="ghost-btn"
                >
                  Batal
                </button>
                <button type="submit" className="primary-btn">
                  Simpan ke Database Rekening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
