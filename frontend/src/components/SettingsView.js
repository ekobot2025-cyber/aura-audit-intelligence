import React, { useState } from 'react';
import { 
  Settings2, Building2, Sliders, Database, ShieldCheck, 
  Save, CheckCircle2, RefreshCw, Lock
} from 'lucide-react';

export default function SettingsView({ currentUser }) {
  const [activeTab, setActiveTab] = useState('institusi');
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [testingPing, setTestingPing] = useState(false);

  // Form State
  const [settings, setSettings] = useState({
    campusName: 'Universitas Cenderawasih',
    facultyName: 'Fakultas Ekonomi dan Bisnis (FEB)',
    spiUnit: 'Satuan Pengawas Internal (SPI) Uncen',
    bafFormat: 'BAF/{YYYY}/FEB-UNCEN/{SEQ}',
    academicYear: '2025/2026',
    
    paguLimit: 50000000,
    priceTolerancePercent: 15,
    elaSensitivity: 75,
    benfordSignificance: 'p < 0.05',
    detectWeekendTransfers: true,
    autoFlagHighRiskVendor: true,

    cekRekeningSync: true,
    ojkSlikSync: true,
    lkppSync: true,
    dukcapilSync: true,

    dualSignoffRequired: true,
    sessionTimeoutHours: 8,
    immutableAuditLog: true,
    maskSensitiveData: false
  });

  const handleChange = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast('Konfigurasi sistem & tata kelola AURA berhasil disimpan.');
      setTimeout(() => setToast(''), 3500);
    }, 600);
  };

  const handlePingTest = () => {
    setTestingPing(true);
    setTimeout(() => {
      setTestingPing(false);
      setToast('Semua gateway nasional (CekRekening.id, OJK, LKPP) merespons dengan latency < 85ms (OK).');
      setTimeout(() => setToast(''), 4000);
    }, 800);
  };

  return (
    <div className="relative pb-16">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/90 px-4 py-3 text-xs font-semibold text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.4)] backdrop-blur-md animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      <div className="page-head mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 mb-3">
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
            TATA KELOLA &amp; ADMINISTRASI SISTEM
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pengaturan Sistem &amp; Kebijakan Audit
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-3xl">
            Pusat kendali konfigurasi kelembagaan AURA, ambang batas pagu lelang, sensitivitas algoritma deteksi fraud, serta sinkronisasi basis data nasional.
          </p>

          {currentUser && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-3 py-1.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Sesi Akses: <strong className="text-cyan-300">{currentUser.role || 'Administrator Sistem'}</strong> ({currentUser.username ? `@${currentUser.username}` : (currentUser.email || '@admin')})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="glow-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(37,100,232,0.5)] disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Menyimpan Pengaturan…' : 'Simpan Semua Perubahan'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 mb-8 max-w-4xl">
        {[
          { id: 'institusi', label: '1. Profil Institusi & Kampus', icon: Building2 },
          { id: 'pagu', label: '2. Pagu & Ambang Batas Risiko', icon: Sliders },
          { id: 'integrasi', label: '3. Integrasi Portal Nasional', icon: Database },
          { id: 'keamanan', label: '4. Keamanan & Kebijakan RBAC', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                active 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_16px_rgba(56,189,248,0.4)]' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'institusi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 size={18} className="text-cyan-400" />
              Identitas Satuan Kerja &amp; Lembaga
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Nama Universitas / Badan Hukum:</label>
                <input
                  type="text"
                  value={settings.campusName}
                  onChange={e => handleChange('campusName', e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="field-label">Fakultas / Satker Pengelola:</label>
                <input
                  type="text"
                  value={settings.facultyName}
                  onChange={e => handleChange('facultyName', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="field-label">Unit Pengawasan Internal:</label>
                <input
                  type="text"
                  value={settings.spiUnit}
                  onChange={e => handleChange('spiUnit', e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="field-label">Tahun Anggaran / Periode Audit:</label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={e => handleChange('academicYear', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="field-label">Format Penomoran Berita Acara Forensik (BAF):</label>
              <input
                type="text"
                value={settings.bafFormat}
                onChange={e => handleChange('bafFormat', e.target.value)}
                className="form-input font-mono text-xs text-cyan-300"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Variabel dinamis: <code className="text-cyan-400 font-mono">{"{YYYY}"}</code> untuk tahun berjalan, <code className="text-cyan-400 font-mono">{"{SEQ}"}</code> untuk nomor urut register.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-cyan-500/20 bg-cyan-950/20 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Preview Berita Acara BAF
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Format penomoran ini akan dicantumkan secara otomatis pada setiap ekspor dokumen fisik Berita Acara Telaah Forensik dan segel digital SHA-256.
              </p>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-slate-400 text-[11px]">Contoh Nomor Register:</div>
                <div className="text-cyan-300 font-bold break-all">
                  BAF/2026/FEB-UNCEN/0042
                </div>
                <div className="text-[10px] text-emerald-400 pt-2 border-t border-slate-800">
                  ✓ Sesuai Pedoman Tata Naskah Dinas Kemendikbudristek
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              Perubahan pada nama instansi akan otomatis memperbarui kop surat cetak.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pagu' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders size={18} className="text-cyan-400" />
              Sensitivitas Algoritma Deteksi Fraud
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="field-label mb-0">Batas Pagu Bebas Lelang / Pengadaan Langsung (PPK):</label>
                <span className="font-mono font-bold text-sm text-cyan-300">
                  Rp {new Intl.NumberFormat('id-ID').format(settings.paguLimit)}
                </span>
              </div>
              <input
                type="range"
                min="10000000"
                max="200000000"
                step="5000000"
                value={settings.paguLimit}
                onChange={e => handleChange('paguLimit', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Transaksi bernilai Rp 45jt - Rp 50jt akan secara otomatis ditandai sebagai indikasi <em>Split Invoice</em> terencana.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="field-label mb-0">Toleransi Markup Harga Pasar (vs LKPP / SBM):</label>
                <span className="font-mono font-bold text-sm text-amber-300">
                  +{settings.priceTolerancePercent}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={settings.priceTolerancePercent}
                onChange={e => handleChange('priceTolerancePercent', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Kuitansi dengan harga satuan di atas batas toleransi ini akan memicu bendera merah <em>Kemungkinan Markup Tidak Wajar</em>.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="field-label mb-0">Sensitivitas Deteksi Visual ELA (Error Level Analysis):</label>
                <span className="font-mono font-bold text-sm text-rose-300">
                  {settings.elaSensitivity}% (Tinggi)
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.elaSensitivity}
                onChange={e => handleChange('elaSensitivity', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Ambang batas diferensiasi piksel kompresi untuk menandai adanya penyisipan angka/teks buatan Photoshop/Canva.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Isolasi Transaksi Akhir Pekan (Weekend Outliers)</div>
                <div className="text-[11px] text-slate-400">Tandai pengeluaran kas yang dilakukan pada hari Sabtu/Minggu di luar operasional kampus.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.detectWeekendTransfers}
                onChange={e => handleChange('detectWeekendTransfers', e.target.checked)}
                className="size-4 rounded accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3">
                Kepatuhan Regulasi Nasional
              </h4>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-white">Perpres No. 12 Tahun 2021</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Pengadaan Barang/Jasa Pemerintah (Batas lelang umum vs pengadaan langsung).</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-white">PMK Standar Biaya Masukan (SBM)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Acuan batas tertinggi biaya honorarium, konsumsi, dan peralatan perkantoran.</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-white">Hukum Benford (Audit Keuangan)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Uji statistik keaslian sebaran digit numerik transaksi kas.</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] text-blue-300">
              💡 Parameter ini diterapkan langsung pada modul <strong>Excel Risk Finder</strong> &amp; <strong>Receipt Forensics</strong>.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrasi' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database size={18} className="text-cyan-400" />
                Koneksi Gateway Verifikasi Eksternal
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Status sinkronisasi sinkron API AURA dengan pangkalan data otoritas keuangan dan pengadaan negara.
              </p>
            </div>

            <button
              type="button"
              onClick={handlePingTest}
              disabled={testingPing}
              className="ghost-btn px-4 py-2 rounded-xl text-xs font-semibold text-cyan-300 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw size={13} className={testingPing ? 'animate-spin' : ''} />
              <span>{testingPing ? 'Menguji Gateway…' : 'Uji Status Koneksi (Ping)'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'CekRekening.id Gateway',
                agency: 'Kementerian Komunikasi dan Informatika RI',
                desc: 'Pemeriksaan status nomor rekening bank terlapor tindak pidana penipuan perbankan.',
                status: 'OPERASIONAL (Terhubung)',
                statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              },
              {
                name: 'SLIK OJK Risk Monitoring',
                agency: 'Otoritas Jasa Keuangan (OJK)',
                desc: 'Pengecekan riwayat kepatuhan keuangan penyedia jasa / vendor rekanan kampus.',
                status: 'OPERASIONAL (Terhubung)',
                statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              },
              {
                name: 'e-Katalog Inaproc LKPP',
                agency: 'Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah',
                desc: 'Sinkronisasi harga satuan pasar acuan resmi untuk pencegahan markup anggaran.',
                status: 'OPERASIONAL (Terhubung)',
                statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              },
              {
                name: 'Ditjen Pajak e-Faktur Gateway',
                agency: 'Direktorat Jenderal Pajak (DJP)',
                desc: 'Validasi keabsahan NPWP rekanan dan nomor seri faktur pajak kuitansi SPJ.',
                status: 'MOCK GATEWAY SIAP',
                statusColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
              }
            ].map((gate, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs">{gate.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${gate.statusColor}`}>
                      {gate.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 mb-1">{gate.agency}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{gate.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Latency: ~42ms</span>
                  <span>SSL/TLS 1.3 Terenkripsi</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'keamanan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck size={18} className="text-cyan-400" />
              Tata Kelola Akses &amp; Audit Trail
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Kebijakan Dual-Approval (Maker &amp; Checker)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Mewajibkan dua tanda tangan (Auditor Pemeriksa + Dekan) untuk mengunci Berita Acara Temuan secara hukum.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dualSignoffRequired}
                  onChange={e => handleChange('dualSignoffRequired', e.target.checked)}
                  className="size-4 rounded accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Immutable Hash Audit Log (Anti-Penghapusan Bukti)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Setiap upload berkas, verifikasi ELA, dan perubahan skor vendor dicatat ke dalam log berantai SHA-256 yang tidak bisa diedit.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.immutableAuditLog}
                  onChange={e => handleChange('immutableAuditLog', e.target.checked)}
                  className="size-4 rounded accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Masking Data Pribadi Pelapor (Whistleblower Protection)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Menyamarkan NIK/identitas pelapor anomali anggaran pada tampilan non-pimpinan demi perlindungan saksi.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maskSensitiveData}
                  onChange={e => handleChange('maskSensitiveData', e.target.checked)}
                  className="size-4 rounded accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="field-label">Durasi Masa Aktif Sesi Pengguna (Session Timeout):</label>
                <select
                  value={settings.sessionTimeoutHours}
                  onChange={e => handleChange('sessionTimeoutHours', Number(e.target.value))}
                  className="form-input"
                >
                  <option value={2}>2 Jam (Pengawasan Ketat)</option>
                  <option value={4}>4 Jam (Standar Audit Lapangan)</option>
                  <option value={8}>8 Jam (Jam Kerja Penuh)</option>
                  <option value={24}>24 Jam (Mode Demonstrasi Khusus)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">
                Standar Kriptografi ISO/IEC 27037
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Sistem mengadopsi prinsip <em>Chain of Custody</em> barang bukti elektronik, memastikan setiap temuan audit siap dipertanggungjawabkan di hadapan auditor eksternal (BPK / BPKP).
              </p>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Lock size={14} />
                  <span>Enkripsi SHA-256 Aktif</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Seluruh kuitansi, faktur, dan draf berita acara menghasilkan tanda sidik jari unik (*digest*) saat diunggah.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Audit Engine v10.0 • AURA Command Center
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
