import React, { useState } from 'react';
import axios from 'axios';
import { GitCompare, Plus, Trash2, AlertCircle, ShieldCheck } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;
const money = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n);

const EMPTY_DOC = { type: 'RAB', items: [{ product: '', qty: '', price: '' }], vendor: '' };

export default function CrossDocumentView() {
  const [documents, setDocuments] = useState([{ ...EMPTY_DOC }, { ...EMPTY_DOC, type: 'Invoice' }]);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateDoc = (di, field, val) => {
    const next = [...documents];
    next[di] = { ...next[di], [field]: val };
    setDocuments(next);
  };

  const updateItem = (di, ii, field, val) => {
    const next = [...documents];
    next[di].items = [...next[di].items];
    next[di].items[ii] = { ...next[di].items[ii], [field]: val };
    setDocuments(next);
  };

  const addItem = (di) => {
    const next = [...documents];
    next[di].items = [...next[di].items, { product: '', qty: '', price: '' }];
    setDocuments(next);
  };

  const addDoc = () => setDocuments([...documents, { ...EMPTY_DOC, type: 'BAST' }]);
  const removeDoc = (i) => setDocuments(documents.filter((_, j) => j !== i));

  const run = async () => {
    setLoading(true);
    try {
      const payload = documents.map((d, i) => ({
        id: `doc-${i + 1}`,
        type: d.type,
        vendor: d.vendor || 'Tidak disebutkan',
        items: d.items.filter(it => it.product).map(it => ({
          product: it.product,
          qty: parseInt(it.qty) || 0,
          price: parseFloat(it.price) || 0,
        })),
      }));
      const r = await axios.post(`${API}/cross-document/verify`, { documents: payload });
      setAlerts(r.data.alerts || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const docTypes = ['RAB', 'Kontrak', 'Purchase Order', 'Invoice', 'BAST', 'SPJ'];

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">FRAUD ANALYTICS</p>
          <h1>Verifikasi Lintas Dokumen</h1>
          <p className="muted">Bandingkan entri antar dokumen terkait (RAB ↔ Kontrak ↔ Invoice ↔ BAST) untuk mendeteksi inkonsistensi kuantitas dan harga.</p>
        </div>
      </div>

      <div className="notice">
        <ShieldCheck size={16} />
        <span>Perbedaan yang ditemukan merupakan <b>indikasi</b> yang memerlukan verifikasi auditor, bukan bukti final.</span>
      </div>

      {documents.map((doc, di) => (
        <div key={di} className="panel rounded-xl shadow-sm border border-slate-800" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ font: '600 14px Space Grotesk', margin: 0 }}>Dokumen {di + 1}</h2>
            {documents.length > 2 && (
              <button className="ghost-btn rounded-md" onClick={() => removeDoc(di)} style={{ color: 'var(--red)', padding: '4px 8px' }}>
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="form-row">
            <div>
              <label className="field-label">Jenis Dokumen</label>
              <select className="form-input rounded-md" value={doc.type} onChange={e => updateDoc(di, 'type', e.target.value)}>
                {docTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Vendor</label>
              <input className="form-input rounded-md" value={doc.vendor} onChange={e => updateDoc(di, 'vendor', e.target.value)} placeholder="PT Ejemplo" />
            </div>
          </div>
          {doc.items.map((item, ii) => (
            <div key={ii} className="form-row" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
              <div>
                <label className="field-label">Nama Barang/Jasa</label>
                <input className="form-input rounded-md" value={item.product} onChange={e => updateItem(di, ii, 'product', e.target.value)} placeholder="Laptop ASUS Vivobook" />
              </div>
              <div>
                <label className="field-label">Kuantitas</label>
                <input className="form-input rounded-md" type="number" value={item.qty} onChange={e => updateItem(di, ii, 'qty', e.target.value)} placeholder="20" />
              </div>
              <div>
                <label className="field-label">Harga Satuan (Rp)</label>
                <input className="form-input rounded-md" type="number" value={item.price} onChange={e => updateItem(di, ii, 'price', e.target.value)} placeholder="14000000" />
              </div>
            </div>
          ))}
          <button className="ghost-btn rounded-md" onClick={() => addItem(di)} style={{ fontSize: 11 }}><Plus size={13} /> Tambah item</button>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {documents.length < 6 && (
          <button className="ghost-btn rounded-md" onClick={addDoc}><Plus size={15} /> Tambah Dokumen</button>
        )}
        <button className="primary-btn rounded-md" onClick={run} disabled={loading}>
          <GitCompare size={15} /> {loading ? 'Memproses…' : 'Jalankan Verifikasi Silang'}
        </button>
      </div>

      {alerts !== null && (
        <div className="panel rounded-xl shadow-sm border border-slate-800">
          <div className="panel-title">
            <div>
              <h2>Hasil Verifikasi Silang</h2>
              <p>{alerts.length} inkonsistensi ditemukan</p>
            </div>
          </div>
          {alerts.length === 0 ? (
            <p style={{ color: 'var(--green)', fontWeight: 600 }}>✓ Tidak ditemukan inkonsistensi antar dokumen.</p>
          ) : (
            alerts.map((a, i) => (
              <div key={i} className={`alert-card ${a.risk_level?.toLowerCase()} rounded-xl shadow-xs border p-4 transition-all duration-150 hover:shadow-md`}>
                <div className="alert-header">
                  <b><AlertCircle size={14} style={{ verticalAlign: -2 }} /> {a.field === 'quantity' ? 'Ketidaksesuaian Kuantitas' : 'Ketidaksesuaian Harga'} — {a.product}</b>
                  <span className={`risk ${a.risk_level?.toLowerCase()}`}>{a.risk_level}</span>
                </div>
                <div className="alert-detail">
                  <p><strong>{a.doc_a_label}:</strong> {a.field === 'quantity' ? `${a.doc_a_value} unit` : money(a.doc_a_value)}</p>
                  <p><strong>{a.doc_b_label}:</strong> {a.field === 'quantity' ? `${a.doc_b_value} unit` : money(a.doc_b_value)}</p>
                  <p><strong>Selisih:</strong> {a.field === 'quantity' ? `${a.difference} unit` : money(a.difference)}</p>
                  {a.exposure > 0 && <p><strong>Potensi exposure:</strong> <span className="red-text">{money(a.exposure)}</span></p>}
                  <p style={{ marginTop: 6, fontStyle: 'italic', color: 'var(--muted)' }}>{a.explanation}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}