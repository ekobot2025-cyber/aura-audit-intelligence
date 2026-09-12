import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cog, Save, Calculator, ShieldCheck } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

const CATEGORY_LABELS = {
  document_manipulation: 'Manipulasi Dokumen',
  price_anomaly: 'Anomali Harga',
  transaction_anomaly: 'Anomali Transaksi',
  cross_document: 'Inkonsistensi Lintas Dokumen',
  duplicate_invoice: 'Invoice Duplikat',
  vendor_risk: 'Risiko Vendor',
};

const riskClass = (level) => level?.toLowerCase() || 'low';

export default function FraudRulesView() {
  const [weights, setWeights] = useState({
    document_manipulation: 25, price_anomaly: 25, transaction_anomaly: 20,
    cross_document: 15, duplicate_invoice: 10, vendor_risk: 5,
  });
  const [scores, setScores] = useState({
    document_manipulation: 0, price_anomaly: 0, transaction_anomaly: 0,
    cross_document: 0, duplicate_invoice: 0, vendor_risk: 0,
  });
  const [calcResult, setCalcResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    axios.get(`${API}/fraud-rules`).then(r => {
      if (r.data.weights) setWeights(r.data.weights);
    }).catch(() => {});
  }, []);

  const total = Object.values(weights).reduce((s, v) => s + v, 0);

  const updateWeight = (key, val) => {
    setWeights({ ...weights, [key]: parseInt(val) || 0 });
  };

  const save = async () => {
    if (total !== 100) return;
    setSaving(true);
    try {
      await axios.put(`${API}/fraud-rules`, { weights });
      setToast('Bobot berhasil disimpan');
      setTimeout(() => setToast(''), 3000);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const updateScore = (key, val) => {
    setScores({ ...scores, [key]: parseFloat(val) || 0 });
  };

  const calculate = async () => {
    try {
      const r = await axios.post(`${API}/fraud-risk/calculate`, { scores, weights });
      setCalcResult(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">KONFIGURASI</p>
          <h1>Fraud Detection Rules</h1>
          <p className="muted">Konfigurasi bobot skor risiko dan parameter deteksi fraud. Bobot tidak di-hardcode — dapat disesuaikan administrator.</p>
        </div>
      </div>

      <div className="notice">
        <ShieldCheck size={16} />
        <span>Skor risiko: <b>0-39 LOW</b> · <b>40-69 MEDIUM</b> · <b>70-100 HIGH</b>. Total bobot harus = 100%.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        {/* Weights configuration */}
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2><Cog size={16} style={{ verticalAlign: -2 }} /> Bobot Skor Risiko</h2>
              <p>Total harus = 100%. Saat ini: <b style={{ color: total === 100 ? 'var(--green)' : 'var(--red)' }}>{total}%</b></p>
            </div>
          </div>

          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <div className="weight-row" key={key}>
              <label>{label}</label>
              <input type="range" min="0" max="50" value={weights[key] || 0} onChange={e => updateWeight(key, e.target.value)} />
              <span className="weight-val">{weights[key]}%</span>
            </div>
          ))}

          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button className="primary-btn" onClick={save} disabled={total !== 100 || saving}>
              <Save size={14} /> {saving ? 'Menyimpan…' : 'Simpan Bobot'}
            </button>
            {total !== 100 && <span style={{ color: 'var(--red)', fontSize: 12, alignSelf: 'center' }}>⚠ Total bobot harus 100%</span>}
          </div>
          {toast && <p style={{ color: 'var(--green)', fontSize: 12, marginTop: 8 }}>✓ {toast}</p>}
        </div>

        {/* Risk calculator */}
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2><Calculator size={16} style={{ verticalAlign: -2 }} /> Kalkulator Skor Risiko</h2>
              <p>Masukkan skor per kategori (0-100)</p>
            </div>
          </div>

          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <label style={{ flex: 1, fontSize: 12, color: '#cbd5e1', fontWeight: 500 }}>{label}</label>
              <input className="form-input" type="number" min="0" max="100"
                style={{ width: 70, textAlign: 'center', marginBottom: 0 }}
                value={scores[key]} onChange={e => updateScore(key, e.target.value)} />
            </div>
          ))}

          <button className="primary-btn" onClick={calculate} style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
            <Calculator size={14} /> Hitung Skor Komposit
          </button>

          {calcResult && (
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <div className={`score-circle ${riskClass(calcResult.risk_level)}`}>
                <div>
                  <strong>{calcResult.final_score?.toFixed(1)}</strong>
                  <small>/100</small>
                </div>
              </div>
              <span className={`risk ${riskClass(calcResult.risk_level)}`} style={{ fontSize: 13, padding: '6px 14px' }}>
                {calcResult.risk_level}
              </span>
              <p style={{ color: 'var(--muted)', fontSize: 11, marginTop: 12 }}>{calcResult.explanation}</p>

              {calcResult.contributing_factors && (
                <div className="table-wrap" style={{ marginTop: 16, textAlign: 'left' }}>
                  <table>
                    <thead><tr><th>KATEGORI</th><th>SKOR</th><th>BOBOT</th><th>KONTRIBUSI</th></tr></thead>
                    <tbody>
                      {calcResult.contributing_factors.map(f => (
                        <tr key={f.name}>
                          <td>{CATEGORY_LABELS[f.name] || f.name}</td>
                          <td>{f.score}</td>
                          <td>{f.weight}%</td>
                          <td><b>{f.weighted_score?.toFixed(1)}</b></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}