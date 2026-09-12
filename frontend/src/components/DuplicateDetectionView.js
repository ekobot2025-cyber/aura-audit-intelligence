import React, { useState } from 'react';
import axios from 'axios';
import { ClipboardCheck, Plus, Trash2, AlertTriangle } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

const EMPTY = { id: '', invoice_number: '', vendor: '', amount: '', date: '', hash: '' };

export default function DuplicateDetectionView() {
  const [invoices, setInvoices] = useState([
    { ...EMPTY, id: 'INV-A', invoice_number: 'INV-00291', vendor: 'PT ABC', amount: '75000000', date: '2024-11-15' },
    { ...EMPTY, id: 'INV-B', invoice_number: 'INV-00291', vendor: 'PT ABC', amount: '75000000', date: '2024-11-16' },
  ]);
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (i, field, val) => {
    const next = [...invoices];
    next[i] = { ...next[i], [field]: val };
    setInvoices(next);
  };

  const add = () => setInvoices([...invoices, { ...EMPTY, id: `INV-${String.fromCharCode(65 + invoices.length)}` }]);
  const remove = (i) => setInvoices(invoices.filter((_, j) => j !== i));

  const scan = async () => {
    setLoading(true);
    try {
      const payload = invoices.map(inv => ({
        ...inv,
        amount: parseFloat(inv.amount) || 0,
      }));
      const r = await axios.post(`${API}/duplicate-detection/scan`, { documents: payload });
      setMatches(r.data.matches || []);
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
          <h1>Deteksi Invoice Duplikat</h1>
          <p className="muted">Bandingkan invoice berdasarkan nomor, vendor, nilai, tanggal, hash, dan kemiripan teks untuk mendeteksi potensi duplikasi.</p>
        </div>
      </div>

      {invoices.map((inv, i) => (
        <div key={i} className="panel rounded-xl shadow-sm border border-slate-800" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 style={{ font: '600 13px Space Grotesk', margin: 0 }}>Invoice {inv.id || i + 1}</h2>
            {invoices.length > 2 && (
              <button className="ghost-btn rounded-md" onClick={() => remove(i)} style={{ padding: '3px 6px', color: 'var(--red)' }}>
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
            <div>
              <label className="field-label">No. Invoice</label>
              <input className="form-input rounded-md" value={inv.invoice_number} onChange={e => update(i, 'invoice_number', e.target.value)} placeholder="INV-00291" />
            </div>
            <div>
              <label className="field-label">Vendor</label>
              <input className="form-input rounded-md" value={inv.vendor} onChange={e => update(i, 'vendor', e.target.value)} placeholder="PT ABC" />
            </div>
            <div>
              <label className="field-label">Nilai (Rp)</label>
              <input className="form-input rounded-md" type="number" value={inv.amount} onChange={e => update(i, 'amount', e.target.value)} placeholder="75000000" />
            </div>
            <div>
              <label className="field-label">Tanggal</label>
              <input className="form-input rounded-md" type="date" value={inv.date} onChange={e => update(i, 'date', e.target.value)} />
            </div>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <button className="ghost-btn rounded-md" onClick={add}><Plus size={14} /> Tambah Invoice</button>
        <button className="primary-btn rounded-md" onClick={scan} disabled={loading}>
          <ClipboardCheck size={15} /> {loading ? 'Memindai…' : 'Scan Duplikasi'}
        </button>
      </div>

      {matches !== null && (
        <div className="panel rounded-xl shadow-sm border border-slate-800">
          <div className="panel-title">
            <div>
              <h2>Hasil Deteksi Duplikasi</h2>
              <p>{matches.length} potensi duplikasi ditemukan</p>
            </div>
          </div>
          {matches.length === 0 ? (
            <p style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Tidak ditemukan potensi duplikasi.</p>
          ) : (
            matches.map((m, i) => (
              <div key={i} className={`alert-card ${m.risk_level?.toLowerCase()} rounded-xl shadow-xs border p-4 transition-all duration-150 hover:shadow-md`}>
                <div className="alert-header">
                  <b><AlertTriangle size={14} style={{ verticalAlign: -2 }} /> Potensi Invoice Duplikat</b>
                  <span className={`risk ${m.risk_level?.toLowerCase()}`}>{m.risk_level}</span>
                </div>
                <div className="alert-detail">
                  <p><strong>Invoice A:</strong> {m.doc_a_id} &nbsp;↔&nbsp; <strong>Invoice B:</strong> {m.doc_b_id}</p>
                  <p><strong>Kemiripan teks:</strong> {(m.similarity_score * 100).toFixed(1)}%</p>
                  <p><strong>Field yang cocok:</strong> {m.match_fields.join(', ') || 'Tidak ada field persis cocok'}</p>
                  <p style={{ marginTop: 6, fontStyle: 'italic', color: 'var(--muted)' }}>{m.explanation}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}