import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FolderKanban, ShieldCheck, Send, RefreshCw } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

function StatusBadge({ status }) {
  let colorStyle = { background: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: '1px solid rgba(148, 163, 184, 0.3)' };
  if (status === 'Under Review') colorStyle = { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)' };
  if (status === 'Need Evidence') colorStyle = { background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.35)' };
  if (status === 'New') colorStyle = { background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.35)' };
  if (status === 'Closed') colorStyle = { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)' };

  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999, display: 'inline-block', fontFamily: "'JetBrains Mono', monospace", ...colorStyle }}>
      {status}
    </span>
  );
}

export default function CasesView() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [notesList, setNotesList] = useState({});

  const fetchCases = () => {
    setLoading(true);
    axios.get(`${API}/cases`)
      .then(r => setCases(r.data.cases || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchCases, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedCase) return;
    setSavingNote(true);
    try {
      await axios.post(`${API}/cases/${selectedCase.id}/notes`, { text: noteText });
      const newEntry = {
        text: noteText,
        actor: 'Auditor Anda',
        time: 'Baru saja'
      };
      setNotesList(prev => ({
        ...prev,
        [selectedCase.id]: [...(prev[selectedCase.id] || []), newEntry]
      }));
      setNoteText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">INVESTIGATION / AUDIT CASES</p>
          <h1>Kasus Investigasi & Audit Trail</h1>
          <p className="muted">Pelacakan penanganan indikasi anomali, catatan telaah auditor, dan status verifikasi bukti pendukung.</p>
        </div>
        <div className="head-actions">
          <button className="ghost-btn" onClick={fetchCases} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Segarkan
          </button>
        </div>
      </div>

      <div className="notice">
        <ShieldCheck size={16} />
        <span>
          <b>Kaidah Audit:</b> Perubahan status dari "New" ke "Under Review" hingga "Confirmed Anomaly" tidak mengubah praduga tak bersalah tanpa penetapan berwenang. Catatan audit tersimpan permanen pada audit trail.
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        {/* Cases Table */}
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2>Daftar Kasus Aktif</h2>
              <p>{cases.length} kasus memerlukan telaah</p>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>KASUS</th>
                  <th>JUDUL & DESKRIPSI</th>
                  <th>STATUS</th>
                  <th>PENANGGUNG JAWAB</th>
                  <th>RISK SCORE</th>
                  <th>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => {
                  const isSelected = selectedCase?.id === c.id;
                  return (
                    <tr
                      key={c.id}
                      className={isSelected ? 'selected' : ''}
                      style={{
                        background: isSelected ? 'rgba(56, 189, 248, 0.14)' : 'transparent',
                        boxShadow: isSelected ? 'inset 3px 0 0 #38bdf8' : 'none',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onClick={() => setSelectedCase(c)}
                    >
                      <td>
                        <b style={{ color: isSelected ? '#38bdf8' : '#ffffff', fontFamily: "'JetBrains Mono', monospace" }}>
                          {c.id}
                        </b>
                      </td>
                      <td>
                        <b style={{ color: '#ffffff' }}>{c.title}</b>
                        <small style={{ color: isSelected ? '#bae6fd' : '#94a3b8' }}>
                          Pembaruan: {c.updated || 'Baru-baru ini'}
                        </small>
                      </td>
                      <td><StatusBadge status={c.status} /></td>
                      <td style={{ color: isSelected ? '#f1f5f9' : '#cbd5e1' }}>
                        {c.owner || 'Belum Ditugaskan'}
                      </td>
                      <td>
                        <span className={`risk ${c.risk > 70 ? 'high' : 'medium'}`}>
                          {c.risk} · {c.risk > 70 ? 'HIGH' : 'MEDIUM'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="text-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCase(c);
                          }}
                        >
                          Buka Telaah
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes & Evidence Drawer */}
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2>Catatan Telaah Auditor</h2>
              <p>{selectedCase ? `Kasus: ${selectedCase.id}` : 'Pilih kasus untuk melihat atau menambahkan telaah'}</p>
            </div>
          </div>

          {selectedCase ? (
            <div>
              <div style={{ background: 'rgba(5, 10, 26, 0.75)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '14px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13, lineHeight: 1.8, color: '#f1f5f9' }}>
                <div><span style={{ color: '#94a3b8' }}>Judul:</span> <strong style={{ color: '#ffffff', fontWeight: 600 }}>{selectedCase.title}</strong></div>
                <div style={{ marginTop: 4 }}><span style={{ color: '#94a3b8' }}>Status Saat Ini:</span> <StatusBadge status={selectedCase.status} /></div>
                <div style={{ marginTop: 4 }}><span style={{ color: '#94a3b8' }}>Skor Risiko:</span> <strong style={{ color: '#fb7185', fontWeight: 700 }}>{selectedCase.risk}/100</strong></div>
              </div>

              <div style={{ maxHeight: 220, overflowY: 'auto', marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(!notesList[selectedCase.id] || notesList[selectedCase.id].length === 0) ? (
                  <p style={{ color: 'var(--muted)', fontSize: 12, fontStyle: 'italic' }}>
                    Belum ada catatan telaah untuk kasus ini. Tambahkan di bawah.
                  </p>
                ) : (
                  notesList[selectedCase.id].map((n, i) => (
                    <div key={i} style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(37, 100, 232, 0.25)', padding: 12, borderRadius: 6, fontSize: 12, color: '#f1f5f9' }}>
                      <p style={{ margin: '0 0 4px', color: '#f1f5f9' }}>{n.text}</p>
                      <small style={{ color: '#94a3b8' }}>Oleh {n.actor} · {n.time}</small>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddNote}>
                <label className="field-label">Tambah Catatan Investigasi / Rekomendasi</label>
                <textarea
                  className="form-input"
                  rows={3}
                  required
                  placeholder="Contoh: Telah dikonfirmasi dengan PPK, kuantitas pada BAST berkurang karena kendala pasokan..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                />
                <button type="submit" className="primary-btn" disabled={savingNote} style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={14} /> {savingNote ? 'Menyimpan…' : 'Kirim Catatan Telaah'}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
              <FolderKanban size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <p style={{ fontSize: 13 }}>Klik salah satu kasus pada tabel di sebelah kiri untuk membuka lembar telaah.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
