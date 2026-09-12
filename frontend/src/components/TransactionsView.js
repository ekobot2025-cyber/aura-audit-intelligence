import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Search, Eye } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;
const money = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n || 0);

function RiskBadge({ level, score }) {
  const l = (level || 'LOW').toLowerCase();
  return <span className={`risk ${l}`}>{score !== undefined ? `${score} · ` : ''}{level || 'LOW'}</span>;
}

export default function TransactionsView() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [selectedTx, setSelectedTx] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    axios.get(`${API}/dashboard`)
      .then(r => setTransactions(r.data.transactions || []))
      .catch(() => {});
  }, []);

  const openDetail = async (tx) => {
    setSelectedTx(tx);
    setLoadingAnalysis(true);
    try {
      const res = await axios.get(`${API}/analysis/${tx.id}`);
      setAnalysis(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const filtered = transactions.filter(t => {
    const matchText = (t.id || '').toLowerCase().includes(search.toLowerCase()) ||
                      (t.vendor || '').toLowerCase().includes(search.toLowerCase()) ||
                      (t.indicator || '').toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === 'ALL' || t.risk_level === filterRisk;
    return matchText && matchRisk;
  });

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">MONITORING / TRANSAKSI</p>
          <h1>Analisis Transaksi Finansial</h1>
          <p className="muted">Daftar transaksi yang dipindai dengan analisis indikator deviasi harga, frekuensi, dan integritas dokumen.</p>
        </div>
      </div>

      <div className="notice">
        <ShieldCheck size={16} />
        <span>Setiap transaksi dievaluasi terhadap aturan sistem yang dinamis. Hasil berupa <b>indikasi risiko</b> yang memandu prioritas pengawasan internal.</span>
      </div>

      <div className="panel">
        <div className="panel-title">
          <div>
            <h2>Data Transaksi Terpantau</h2>
            <p>Menampilkan {filtered.length} transaksi</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="search-box">
              <Search size={14} />
              <input
                type="text"
                placeholder="Cari ID transaksi, vendor, atau indikator..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-input"
              style={{ width: 'auto', marginBottom: 0, padding: '6px 10px', fontSize: 12 }}
              value={filterRisk}
              onChange={e => setFilterRisk(e.target.value)}
            >
              <option value="ALL">Semua Risiko</option>
              <option value="HIGH">Tinggi (HIGH)</option>
              <option value="MEDIUM">Sedang (MEDIUM)</option>
              <option value="LOW">Rendah (LOW)</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>TRANSAKSI</th>
                <th>KATEGORI</th>
                <th>VENDOR</th>
                <th>TANGGAL</th>
                <th>NILAI TRANSAKSI</th>
                <th>INDIKATOR FRAUD</th>
                <th>RISIKO</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <b>{t.id}</b>
                  </td>
                  <td>{t.category || 'Barang/Jasa'}</td>
                  <td>{t.vendor}</td>
                  <td>{t.date}</td>
                  <td><b>{money(t.amount)}</b></td>
                  <td>
                    <span style={{ fontSize: 11, color: t.risk_level === 'HIGH' ? 'var(--red)' : 'var(--ink)' }}>
                      {t.indicator}
                    </span>
                  </td>
                  <td>
                    <RiskBadge level={t.risk_level} score={t.risk} />
                  </td>
                  <td>
                    <button className="text-btn" onClick={() => openDetail(t)}>
                      <Eye size={14} /> Detail
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTx && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 640 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2>Detail Analisis: {selectedTx.id}</h2>
              <RiskBadge level={selectedTx.risk_level} score={selectedTx.risk} />
            </div>

            <div style={{ background: 'rgba(5, 10, 26, 0.75)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '14px 16px', borderRadius: 8, fontSize: 13, lineHeight: 1.9, color: '#f1f5f9', marginBottom: 16 }}>
              <div><span style={{ color: '#94a3b8' }}>Vendor:</span> <strong style={{ color: '#ffffff', fontWeight: 600 }}>{selectedTx.vendor}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Nilai Transaksi:</span> <strong style={{ color: '#38bdf8', fontWeight: 600 }}>{money(selectedTx.amount)}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Tanggal:</span> <span style={{ color: '#cbd5e1' }}>{selectedTx.date}</span></div>
              <div><span style={{ color: '#94a3b8' }}>Indikator Utama:</span> <span style={{ color: '#fcd34d' }}>{selectedTx.indicator}</span></div>
              {selectedTx.exposure > 0 && (
                <div><span style={{ color: '#94a3b8' }}>Potensi Financial Exposure:</span> <span className="red-text" style={{ fontWeight: 700 }}>{money(selectedTx.exposure)}</span></div>
              )}
            </div>

            <h3 style={{ font: '600 14px Space Grotesk', marginBottom: 10 }}>Temuan Anomali Terinci:</h3>
            {loadingAnalysis ? (
              <p style={{ color: 'var(--muted)', fontSize: 12 }}>Memuat analisis mendalam…</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {analysis?.findings?.map((f, idx) => (
                  <div key={idx} className={`alert-card ${f.level.toLowerCase()}`} style={{ margin: 0, padding: 12 }}>
                    <div className="alert-header">
                      <b>{f.title}</b>
                      <span className={`risk ${f.level.toLowerCase()}`}>{f.level}</span>
                    </div>
                    <div className="alert-detail">
                      <p>{f.why}</p>
                      <small style={{ color: 'var(--muted)', display: 'block', marginTop: 4 }}>
                        Lokasi: {f.where} · Bukti: {f.evidence}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="primary-btn" onClick={() => setSelectedTx(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
