import React, { useState } from 'react';
import axios from 'axios';
import { TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;
const money = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n);

const DEMO_TX = [
  { id: 'SP-01', vendor: 'CV Maju Jaya', amount: 49800000, date: '2024-11-01T10:00:00' },
  { id: 'SP-02', vendor: 'CV Maju Jaya', amount: 49500000, date: '2024-11-03T11:00:00' },
  { id: 'SP-03', vendor: 'CV Maju Jaya', amount: 49900000, date: '2024-11-05T09:00:00' },
  { id: 'SP-04', vendor: 'CV Maju Jaya', amount: 49700000, date: '2024-11-08T14:00:00' },
  { id: 'SP-05', vendor: 'PT ABC', amount: 25000000, date: '2024-11-02T10:00:00' },
  { id: 'SP-06', vendor: 'PT ABC', amount: 24800000, date: '2024-11-04T12:00:00' },
  { id: 'SP-07', vendor: 'PT ABC', amount: 24900000, date: '2024-11-06T15:00:00' },
];

export default function FraudPatternsView() {
  const [threshold, setThreshold] = useState('50000000');
  const [window, setWindow] = useState('30');
  const [minCount, setMinCount] = useState('3');
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(false);

  const scan = async () => {
    setLoading(true);
    try {
      const r = await axios.post(`${API}/splitting-detection/scan`, {
        transactions: DEMO_TX,
        threshold: parseFloat(threshold),
        time_window_days: parseInt(window),
        min_count: parseInt(minCount),
      });
      setPatterns(r.data.patterns || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">FRAUD ANALYTICS</p>
          <h1>Deteksi Pola Pemecahan Transaksi</h1>
          <p className="muted">Identifikasi transaksi yang dipecah di bawah ambang batas pengadaan untuk menghindari prosedur tertentu.</p>
        </div>
      </div>

      <div className="notice">
        <ShieldCheck size={16} />
        <span>Ambang batas dan parameter <b>tidak di-hardcode</b>. Sesuaikan sesuai kebijakan/regulasi institusi Anda.</span>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <h2 style={{ font: '600 15px Space Grotesk', marginBottom: 14 }}>Parameter Deteksi</h2>
        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div>
            <label className="field-label">Ambang Batas Transaksi (Rp)</label>
            <input className="form-input" type="number" value={threshold} onChange={e => setThreshold(e.target.value)} />
            <small style={{ color: 'var(--muted)', fontSize: 11 }}>Transaksi di bawah nilai ini yang mencurigakan</small>
          </div>
          <div>
            <label className="field-label">Jendela Waktu (hari)</label>
            <input className="form-input" type="number" value={window} onChange={e => setWindow(e.target.value)} />
            <small style={{ color: 'var(--muted)', fontSize: 11 }}>Periode evaluasi transaksi terkait</small>
          </div>
          <div>
            <label className="field-label">Jumlah Minimum Transaksi</label>
            <input className="form-input" type="number" value={minCount} onChange={e => setMinCount(e.target.value)} />
            <small style={{ color: 'var(--muted)', fontSize: 11 }}>Minimum transaksi untuk dipandang sebagai pola</small>
          </div>
        </div>
        <button className="primary-btn" onClick={scan} disabled={loading} style={{ marginTop: 8 }}>
          <TrendingUp size={15} /> {loading ? 'Menganalisis…' : 'Deteksi Pola Pemecahan'}
        </button>
      </div>

      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-title">
          <div>
            <h2>Data Transaksi Uji</h2>
            <p>{DEMO_TX.length} transaksi simulasi</p>
          </div>
          <span className="simulation-badge" style={{ padding: '4px 8px', fontSize: 10 }}><span className="sim-dot" /> DATA SIMULASI</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>VENDOR</th><th>NILAI</th><th>TANGGAL</th></tr></thead>
            <tbody>
              {DEMO_TX.map(t => (
                <tr key={t.id}>
                  <td><b>{t.id}</b></td>
                  <td>{t.vendor}</td>
                  <td>{money(t.amount)}</td>
                  <td>{t.date.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {patterns !== null && (
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2>Hasil Deteksi Pola</h2>
              <p>{patterns.length} pola pemecahan teridentifikasi</p>
            </div>
          </div>
          {patterns.length === 0 ? (
            <p style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Tidak ditemukan pola pemecahan transaksi.</p>
          ) : (
            patterns.map((p, i) => (
              <div key={i} className="alert-card high">
                <div className="alert-header">
                  <b><AlertCircle size={14} style={{ verticalAlign: -2 }} /> Indikasi Pemecahan Transaksi — {p.vendor}</b>
                  <span className="risk high">{p.risk_level}</span>
                </div>
                <div className="alert-detail">
                  <p><strong>Jumlah transaksi:</strong> {p.count} transaksi</p>
                  <p><strong>Total nilai:</strong> <span className="red-text">{money(p.total)}</span></p>
                  <p><strong>Rata-rata per transaksi:</strong> {money(p.avg_per_transaction)}</p>
                  <p><strong>Ambang batas:</strong> {money(p.threshold)}</p>
                  <p style={{ marginTop: 6, fontStyle: 'italic', color: 'var(--muted)' }}>{p.explanation}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}