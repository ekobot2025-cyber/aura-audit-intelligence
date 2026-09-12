import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Plus, Search, Building2, AlertTriangle, RefreshCw } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;
const money = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n || 0);

function RiskBadge({ level, score }) {
  const l = (level || 'LOW').toLowerCase();
  return (
    <span className={`risk ${l}`}>
      {score !== undefined ? `${score} · ` : ''}{level || 'LOW'}
    </span>
  );
}

export default function VendorsView() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', npwp: '', category: 'Perangkat IT' });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');

  const fetchVendors = () => {
    setLoading(true);
    axios.get(`${API}/vendors`)
      .then(r => setVendors(r.data.vendors || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchVendors, []);

  const handleAddVendor = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/vendors`, form);
      if (res.data?.vendor) {
        setVendors(prev => [res.data.vendor, ...prev]);
      }
      setShowModal(false);
      setForm({ name: '', npwp: '', category: 'Perangkat IT' });
      setToast('Vendor berhasil ditambahkan');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = vendors.filter(v =>
    (v.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.npwp || '').toLowerCase().includes(search.toLowerCase()) ||
    (v.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">FRAUD ANALYTICS / VENDOR PROFILING</p>
          <h1>Profil Risiko Vendor</h1>
          <p className="muted">Monitoring komprehensif riwayat transaksi, konsentrasi pengadaan, dan indikator anomali vendor.</p>
        </div>
        <div className="head-actions">
          <button className="ghost-btn" onClick={fetchVendors} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Segarkan
          </button>
          <button className="primary-btn" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Tambah Vendor
          </button>
        </div>
      </div>

      <div className="notice">
        <ShieldCheck size={16} />
        <span>
          <b>Prinsip Praduga Tak Bersalah:</b> Skor risiko tinggi semata-mata menunjukkan anomali data (deviasi harga, frekuensi tidak lazim) yang membutuhkan audit lanjutan, bukan penetapan tindakan kecurangan terbukti.
        </span>
      </div>

      {toast && (
        <div style={{
          marginBottom: 16,
          padding: '11px 16px',
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: 8,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 0 16px rgba(16, 185, 129, 0.15)'
        }}>
          <ShieldCheck size={16} /> <span>{toast}</span>
        </div>
      )}

      <div className="panel">
        <div className="panel-title">
          <div>
            <h2>Daftar Rekanan & Profil Risiko</h2>
            <p>Menampilkan {filtered.length} dari {vendors.length} vendor terdaftar</p>
          </div>
          <div className="search-box">
            <Search size={14} />
            <input
              type="text"
              placeholder="Cari nama, NPWP, atau bidang..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>VENDOR</th>
                <th>NPWP</th>
                <th>KATEGORI</th>
                <th>TRANSAKSI</th>
                <th>TOTAL NILAI</th>
                <th>INDIKATOR ANOMALI</th>
                <th>RISK SCORE</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={v.id || i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="vendor-avatar">
                        <Building2 size={14} />
                      </div>
                      <div>
                        <b>{v.name}</b>
                        <small>{v.id || `VND-${i+1}`}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.npwp || '—'}</span>
                  </td>
                  <td>{v.category || 'Pengadaan Barang/Jasa'}</td>
                  <td>
                    <b>{v.transactions_count || v.flags ? (v.transactions_count || 12) : 0}</b>
                    <small>transaksi</small>
                  </td>
                  <td>
                    <b>{money(v.value)}</b>
                  </td>
                  <td>
                    {v.flags > 0 ? (
                      <span style={{ color: 'var(--amber)', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        <AlertTriangle size={13} /> {v.flags} temuan aktif
                      </span>
                    ) : (
                      <span style={{ color: 'var(--green)', fontSize: 12 }}>Normal</span>
                    )}
                  </td>
                  <td>
                    <RiskBadge level={v.risk_level} score={v.score} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
                    Tidak ada data vendor yang cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Tambah Vendor Baru</h2>
            <form onSubmit={handleAddVendor}>
              <label className="field-label">Nama Badan Usaha / Vendor</label>
              <input
                className="form-input"
                required
                placeholder="Contoh: PT Sumber Rezeki Mandiri"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />

              <label className="field-label">Nomor Pokok Wajib Pajak (NPWP)</label>
              <input
                className="form-input"
                placeholder="00.000.000.0-000.000"
                value={form.npwp}
                onChange={e => setForm({ ...form, npwp: e.target.value })}
              />

              <label className="field-label">Kategori Pengadaan</label>
              <select
                className="form-input"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option>Perangkat IT</option>
                <option>Peralatan Kantor</option>
                <option>Jasa Pengiriman & Logistik</option>
                <option>Alat Kesehatan</option>
                <option>Konstruksi & Renovasi</option>
                <option>Konsultasi & Jasa Lainnya</option>
              </select>

              <div className="modal-actions">
                <button type="button" className="ghost-btn" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Menyimpan…' : 'Simpan Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}