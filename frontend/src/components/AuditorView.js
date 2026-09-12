import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, FileCheck2, AlertTriangle, ChevronRight } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

export default function AuditorView() {
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('');

  useEffect(() => {
    axios.get(`${API}/documents`).then(r => setDocs(r.data.documents || [])).catch(() => {});
  }, []);

  const ask = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setAnswer('');
    try {
      const body = { question: q };
      if (selectedDoc) body.document_id = selectedDoc;

      const r = await fetch(`${API}/ai-auditor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value);
        setAnswer(text);
      }
    } catch (e) {
      setAnswer('Terjadi kesalahan saat menghubungi AI Auditor.');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">FRAUD ANALYTICS / AI</p>
          <h1>AI Auditor</h1>
          <p className="muted">Jawaban dibatasi pada bukti hasil OCR & data analisis. Tidak menuduh, hanya membantu verifikasi.</p>
        </div>
        <span className="ai-badge"><Bot size={15} /> Evidence-grounded</span>
      </div>

      <div className="auditor-layout">
        <div className="panel auditor-chat">
          <div className="chat-header">
            <div className="bot-icon"><Bot size={20} /></div>
            <div>
              <h2 style={{ margin: 0, font: '600 15px Space Grotesk' }}>Ruang kerja AI Auditor</h2>
              <p>Konteks: {selectedDoc ? `Dokumen ${selectedDoc}` : 'data agregat dashboard'}</p>
            </div>
          </div>

          <div style={{ padding: '10px 20px 0', borderBottom: '1px solid var(--line)' }}>
            <label className="field-label" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileCheck2 size={13} /> FOKUS DOKUMEN
            </label>
            <select className="form-input" value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)}
              style={{ marginBottom: 10 }}>
              <option value="">— Tidak ada (data agregat) —</option>
              {docs.filter(d => d.source !== 'simulation').map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
              ))}
            </select>
          </div>

          <div className="answer-area">
            {answer ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
            ) : (
              <div className="answer-placeholder">
                <Bot size={36} />
                <b>Mulai dengan pertanyaan audit</b>
                <span style={{ fontSize: 12 }}>Contoh: "Kenapa transaksi TX-2024-0098 high risk?"</span>
              </div>
            )}
          </div>

          <div className="ask-row">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask()}
              placeholder="Tulis pertanyaan auditor..."
              disabled={loading}
            />
            <button className="primary-btn" onClick={ask} disabled={!q.trim() || loading}>
              {loading ? 'Memeriksa…' : 'Tanyakan'} <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <aside className="panel evidence-sidebar">
          <p className="eyebrow">KONTEKS AKTIF</p>
          <h2>Sumber bukti</h2>
          {['1.284 dokumen dianalisis', '5 transaksi prioritas', '47 anomali harga', '12 vendor dalam review'].map(x => (
            <div className="evidence-item" key={x}><FileCheck2 size={15} />{x}</div>
          ))}
          <div className="mini-warning">
            <AlertTriangle size={15} />
            <span>AI tidak menetapkan fraud terbukti. Validasi auditor tetap diperlukan.</span>
          </div>
        </aside>
      </div>
    </>
  );
}