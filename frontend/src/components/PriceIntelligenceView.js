import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, Calculator, Plus, RefreshCw, ShieldCheck, 
  Search, ExternalLink, Globe, CheckCircle2, Zap, X, Check
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;
const money = (n) => 'Rp' + new Intl.NumberFormat('id-ID').format(n || 0);

const REGIONS = [
  { label: 'Nasional (1.0x)', val: 1.0 },
  { label: 'Jawa & Sumatera (1.15x)', val: 1.15 },
  { label: 'Kalimantan & Sulawesi (1.25x)', val: 1.25 },
  { label: 'Papua & Maluku (1.35x)', val: 1.35 },
  { label: 'Papua Pegunungan (1.50x)', val: 1.50 },
];

export default function PriceIntelligenceView() {
  // Calculator state
  const [itemName, setItemName] = useState('Laptop ASUS Vivobook 14');
  const [txPrice, setTxPrice] = useState('18500000');
  const [refPrice, setRefPrice] = useState('13800000');
  const [multiplier, setMultiplier] = useState(1.35);
  const [selectedLkppItem, setSelectedLkppItem] = useState(null);
  const [calcResult, setCalcResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // LKPP Live Search Modal state
  const [showLkppModal, setShowLkppModal] = useState(false);
  const [lkppQuery, setLkppQuery] = useState('');
  const [lkppResults, setLkppResults] = useState([]);
  const [searchingLkpp, setSearchingLkpp] = useState(false);
  const [syncingLkpp, setSyncingLkpp] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Reference prices table state
  const [prices, setPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newPrice, setNewPrice] = useState({
    code: '', name: '', category: 'Perangkat IT', unit: 'unit', reference_price: '', region: 'Papua & Maluku', source: 'E-Katalog LKPP Resmi'
  });
  const [savingPrice, setSavingPrice] = useState(false);

  const fetchPrices = () => {
    setLoadingPrices(true);
    axios.get(`${API}/prices`)
      .then(r => setPrices(r.data.prices || []))
      .catch(() => {})
      .finally(() => setLoadingPrices(false));
  };

  useEffect(fetchPrices, []);

  // Initial calculation on load
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    if (!txPrice || !refPrice) return;
    setCalculating(true);
    try {
      const res = await axios.post(`${API}/price-intelligence/analyze`, {
        transaction_price: parseFloat(txPrice),
        reference_price: parseFloat(refPrice),
        regional_multiplier: parseFloat(multiplier)
      });
      setCalcResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const handleOpenLkppModal = (initialTerm) => {
    const query = initialTerm || itemName || '';
    setLkppQuery(query);
    setShowLkppModal(true);
    searchLkppCatalog(query);
  };

  const searchLkppCatalog = async (q) => {
    setSearchingLkpp(true);
    try {
      const res = await axios.get(`${API}/lkpp/search`, {
        params: { q, region: 'Papua' }
      });
      setLkppResults(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingLkpp(false);
    }
  };

  const handleSelectLkpp = (item) => {
    setSelectedLkppItem(item);
    setItemName(item.name);
    setRefPrice(item.reference_price.toString());
    setShowLkppModal(false);
    setToastMessage(`Komoditas LKPP "${item.name}" dipilih (Acuan: ${item.price_formatted})`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSyncLkpp = async () => {
    setSyncingLkpp(true);
    try {
      const res = await axios.post(`${API}/lkpp/sync`);
      setToastMessage(res.data.message || 'Sinkronisasi data komoditas E-Katalog LKPP berhasil.');
      fetchPrices();
      setTimeout(() => setToastMessage(''), 5000);
    } catch (err) {
      console.error(err);
      setToastMessage('Gagal menyinkronkan data LKPP.');
    } finally {
      setSyncingLkpp(false);
    }
  };

  const handleAddPrice = async (e) => {
    e.preventDefault();
    if (!newPrice.name || !newPrice.reference_price) return;
    setSavingPrice(true);
    try {
      const payload = {
        ...newPrice,
        reference_price: parseFloat(newPrice.reference_price),
        code: newPrice.code || `REF-${Math.floor(1000 + Math.random() * 9000)}`
      };
      const res = await axios.post(`${API}/prices`, payload);
      if (res.data?.item) {
        setPrices(prev => [res.data.item, ...prev]);
      } else {
        fetchPrices();
      }
      setShowModal(false);
      setNewPrice({
        code: '', name: '', category: 'Perangkat IT', unit: 'unit', reference_price: '', region: 'Papua & Maluku', source: 'E-Katalog LKPP Resmi'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPrice(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">FINANCIAL & PROCUREMENT INTELLIGENCE</p>
          <h1>Price Intelligence Engine</h1>
          <p className="muted">Analisis deviasi harga terhadap basis harga referensi E-Katalog LKPP & standar regional Papua untuk mendeteksi indikasi mark-up atau abnormalitas harga.</p>
        </div>
        <div className="head-actions">
          <button 
            className="ghost-btn" 
            style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
            onClick={handleSyncLkpp} 
            disabled={syncingLkpp}
          >
            <Zap size={14} className={syncingLkpp ? 'animate-spin' : ''} />
            {syncingLkpp ? 'Menyinkronkan…' : '⚡ Sync Live E-Katalog LKPP'}
          </button>
          <button className="ghost-btn" onClick={fetchPrices} disabled={loadingPrices}>
            <RefreshCw size={14} className={loadingPrices ? 'animate-spin' : ''} /> Segarkan Data
          </button>
          <button className="primary-btn" onClick={() => setShowModal(true)}>
            <Plus size={15} /> Tambah Harga Acuan
          </button>
        </div>
      </div>

      {toastMessage && (
        <div style={{
          marginBottom: 16,
          padding: '11px 16px',
          background: 'rgba(56, 189, 248, 0.12)',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 8,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
        }}>
          <CheckCircle2 size={16} /> <span>{toastMessage}</span>
        </div>
      )}

      <div className="notice" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={18} style={{ color: '#34d399', flexShrink: 0 }} />
          <span>
            <b>Integrasi E-Katalog LKPP (e-katalog.lkpp.go.id):</b> Standar harga terhubung dengan katalog elektronik nasional V6 dan memperhitungkan indeks kemahalan logistik regional Papua (1.35x - 1.50x). Selisih deviasi membantu auditor menetapkan kewajaran harga pengadaan.
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <span className="live-dot" /> GATEWAY LKPP ONLINE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: 16, marginBottom: 20 }}>
        {/* Calculator */}
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2><Calculator size={16} style={{ verticalAlign: -2 }} /> Kalkulator Deviasi Harga</h2>
              <p>Simulasi perbandingan harga SPJ dengan standar acuan E-Katalog LKPP</p>
            </div>
            <button
              type="button"
              className="ghost-btn"
              style={{ fontSize: 11, padding: '4px 8px', color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.3)' }}
              onClick={() => handleOpenLkppModal(itemName)}
            >
              <Globe size={13} /> Cek Real-time LKPP
            </button>
          </div>

          <form onSubmit={handleCalculate}>
            <label className="field-label">Nama Komoditas / Barang SPJ</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                className="form-input"
                style={{ marginBottom: 0 }}
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder="Contoh: Laptop ASUS Vivobook..."
              />
              <button
                type="button"
                className="ghost-btn"
                style={{ whiteSpace: 'nowrap', borderColor: '#38bdf8', color: '#38bdf8', padding: '0 12px' }}
                onClick={() => handleOpenLkppModal(itemName)}
              >
                <Search size={14} /> Cek LKPP
              </button>
            </div>

            <div className="form-row">
              <div>
                <label className="field-label">Harga Satuan SPJ (Rp)</label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={txPrice}
                  onChange={e => setTxPrice(e.target.value)}
                  placeholder="Contoh: 18500000"
                />
              </div>
              <div>
                <label className="field-label">
                  Harga Acuan Terpilih (Rp)
                  {selectedLkppItem && <span style={{ color: '#34d399', fontSize: 10, marginLeft: 4 }}>● E-Katalog</span>}
                </label>
                <input
                  type="number"
                  className="form-input"
                  required
                  value={refPrice}
                  onChange={e => setRefPrice(e.target.value)}
                  placeholder="Contoh: 13800000"
                />
              </div>
            </div>

            <label className="field-label">Wilayah & Indeks Kemahalan Regional</label>
            <select
              className="form-input"
              value={multiplier}
              onChange={e => setMultiplier(parseFloat(e.target.value))}
            >
              {REGIONS.map(r => (
                <option key={r.val} value={r.val}>{r.label}</option>
              ))}
            </select>

            <button type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={calculating}>
              <BarChart3 size={15} /> {calculating ? 'Menganalisis…' : 'Analisis Deviasi Harga vs E-Katalog'}
            </button>
          </form>

          {calcResult && (
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(37, 100, 232, 0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Hasil Audit Deviasi Harga</span>
                <span className={`risk ${(calcResult.risk_level || 'LOW').toLowerCase()}`}>
                  {calcResult.risk_level} RISK
                </span>
              </div>

              <div style={{ background: 'rgba(5, 10, 26, 0.75)', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '14px 16px', borderRadius: 8, fontSize: 13, lineHeight: 1.9, color: '#f1f5f9' }}>
                <div><span style={{ color: '#94a3b8' }}>Komoditas:</span> <strong style={{ color: '#ffffff' }}>{itemName}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Harga Transaksi SPJ:</span> <strong style={{ color: '#ffffff', fontWeight: 600 }}>{money(calcResult.transaction_price)}</strong></div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Acuan Terkoreksi:</span> <strong style={{ color: '#38bdf8', fontWeight: 600 }}>{money(calcResult.adjusted_reference_price)}</strong> 
                  <span style={{ color: '#64748b', fontSize: 12, marginLeft: 6 }}>(Basis: {money(calcResult.reference_price)} · Indeks {multiplier}x)</span>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Selisih Deviasi:</span> 
                  <span className={calcResult.difference > 0 ? 'red-text' : 'green-text'} style={{ fontWeight: 700, fontSize: 14, marginLeft: 6 }}>
                    {money(calcResult.difference)}
                  </span> 
                  <span style={{ fontWeight: 600, marginLeft: 6, color: calcResult.deviation_percent > 0 ? '#fb7185' : '#34d399' }}>
                    ({calcResult.deviation_percent > 0 ? `+${calcResult.deviation_percent.toFixed(2)}%` : `${calcResult.deviation_percent.toFixed(2)}%`})
                  </span>
                </div>
              </div>

              {selectedLkppItem && (
                <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: 6, border: '1px solid rgba(56, 189, 248, 0.25)', fontSize: 11.5, color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                      ✓ Terverifikasi E-Katalog LKPP ({selectedLkppItem.commodity_code})
                    </span>
                    <a 
                      href={selectedLkppItem.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                    >
                      Buka di LKPP <ExternalLink size={11} />
                    </a>
                  </div>
                  <div style={{ marginTop: 4, color: '#94a3b8' }}>
                    Penyedia Resmi: {selectedLkppItem.vendor} · TKDN: {selectedLkppItem.tkdn_percent}%
                  </div>
                </div>
              )}

              <p style={{ marginTop: 10, fontSize: 12, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.5 }}>
                {calcResult.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Master Table */}
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2>Master Data Harga Acuan</h2>
              <p>{prices.length} data komoditas standar E-Katalog & regional</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className="ghost-btn"
                style={{ fontSize: 11, padding: '5px 10px', color: '#38bdf8' }}
                onClick={() => handleOpenLkppModal('')}
              >
                <Search size={13} /> Cari di E-Katalog LKPP
              </button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>KODE & NAMA KOMODITAS</th>
                  <th>KATEGORI</th>
                  <th>WILAYAH</th>
                  <th>HARGA ACUAN</th>
                  <th>SUMBER RESMI</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((p, idx) => {
                  const isLkpp = (p.source && p.source.toLowerCase().includes('katalog')) || p.lkpp_url;
                  return (
                    <tr key={p.code || idx}>
                      <td>
                        <b style={{ color: '#ffffff' }}>{p.name}</b>
                        <small style={{ color: '#94a3b8' }}>
                          {p.code} · per {p.unit || 'unit'}
                          {p.tkdn && (
                            <span style={{ marginLeft: 6, color: '#34d399', fontWeight: 600 }}>
                              · TKDN {p.tkdn}%
                            </span>
                          )}
                        </small>
                      </td>
                      <td style={{ color: '#cbd5e1' }}>{p.category}</td>
                      <td>
                        <span style={{ fontSize: 11, color: '#e2e8f0', background: 'rgba(37, 100, 232, 0.15)', padding: '2px 7px', borderRadius: 4, border: '1px solid rgba(37, 100, 232, 0.3)' }}>
                          {p.region || 'National'}
                        </span>
                      </td>
                      <td>
                        <b style={{ color: '#38bdf8' }}>{money(p.reference_price)}</b>
                      </td>
                      <td>
                        {isLkpp ? (
                          <a 
                            href={p.lkpp_url || 'https://e-katalog.lkpp.go.id'} 
                            target="_blank" 
                            rel="noreferrer"
                            style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontSize: 11, fontWeight: 600 }}
                            title="Buka portal resmi LKPP di tab baru"
                          >
                            <Globe size={12} /> {p.source || 'E-Katalog LKPP'} <ExternalLink size={10} />
                          </a>
                        ) : (
                          <small style={{ color: '#94a3b8' }}>{p.source || 'Daftar Internal'}</small>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── MODAL: LIVE SEARCH E-KATALOG LKPP ── */}
      {showLkppModal && (
        <div className="modal-overlay" onClick={() => setShowLkppModal(false)}>
          <div className="modal-box" style={{ maxWidth: 740, width: '95%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Globe size={20} className="text-cyan-400" />
                  Pencarian Komoditas Real-time E-Katalog LKPP
                </h2>
                <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 12 }}>
                  Basis Data Terverifikasi Portal Pengadaan Nasional V6 (e-katalog.lkpp.go.id)
                </p>
              </div>
              <button 
                className="ghost-btn" 
                style={{ padding: 6, borderRadius: '50%', border: 'none', color: '#94a3b8' }}
                onClick={() => setShowLkppModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Search bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ marginBottom: 0, paddingLeft: 36 }}
                  placeholder="Ketik nama produk, merk, spesifikasi, atau kode KBKI..."
                  value={lkppQuery}
                  onChange={e => setLkppQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchLkppCatalog(lkppQuery)}
                />
                <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#64748b' }} />
              </div>
              <button 
                type="button"
                className="primary-btn" 
                onClick={() => searchLkppCatalog(lkppQuery)}
                disabled={searchingLkpp}
              >
                {searchingLkpp ? 'Mencari…' : 'Cari di LKPP'}
              </button>
            </div>

            {/* Quick preset chips */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#64748b' }}>Kata Kunci Cepat:</span>
              {['Laptop', 'Monitor', 'Printer', 'Kertas', 'Sarung Tangan', 'Proyektor', 'Meja'].map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => { setLkppQuery(k); searchLkppCatalog(k); }}
                  className="ghost-btn"
                  style={{ padding: '2px 8px', fontSize: 11, borderRadius: 999 }}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Results table */}
            <div style={{ maxHeight: 380, overflowY: 'auto', border: '1px solid rgba(37, 100, 232, 0.25)', borderRadius: 10 }}>
              {searchingLkpp ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#38bdf8' }}>
                  <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                  <p style={{ margin: 0, fontSize: 12 }}>Menghubungkan ke gateway ISB LKPP…</p>
                </div>
              ) : lkppResults.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                  <p style={{ margin: 0, fontSize: 13 }}>Tidak ada komoditas LKPP yang cocok dengan kata kunci.</p>
                  <small style={{ color: '#64748b' }}>Coba gunakan kata kunci umum seperti "Laptop", "Printer", atau "Kertas".</small>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {lkppResults.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(10, 18, 38, 0.75)',
                        borderBottom: '1px solid rgba(37, 100, 232, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <b style={{ color: '#ffffff', fontSize: 13 }}>{item.name}</b>
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontFamily: "'JetBrains Mono', monospace" }}>
                            {item.commodity_code}
                          </span>
                          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 600 }}>
                            TKDN {item.tkdn_percent}%
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                          Penyedia: <span style={{ color: '#cbd5e1' }}>{item.vendor}</span> · {item.catalog_type}
                        </div>
                        <div style={{ marginTop: 3 }}>
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{ fontSize: 11, color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                          >
                            Verifikasi di e-katalog.lkpp.go.id <ExternalLink size={10} />
                          </a>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>Harga Tayang Resmi (Papua):</div>
                        <b style={{ color: '#38bdf8', fontSize: 15, display: 'block' }}>{item.price_formatted}</b>
                        <button
                          type="button"
                          className="primary-btn"
                          style={{ marginTop: 6, padding: '4px 10px', fontSize: 11 }}
                          onClick={() => handleSelectLkpp(item)}
                        >
                          <Check size={12} /> Gunakan Harga Ini
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: '#64748b' }}>
              <span>Sumber Data: Portal Pengadaan Nasional LKPP · Update Berkala</span>
              <button type="button" className="ghost-btn" style={{ fontSize: 11, padding: '4px 12px' }} onClick={() => setShowLkppModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: TAMBAH HARGA ACUAN MANUAL ── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Tambah Harga Acuan Baru</h2>
            <form onSubmit={handleAddPrice}>
              <div className="form-row">
                <div>
                  <label className="field-label">Kode Item</label>
                  <input
                    className="form-input"
                    placeholder="Contoh: IT-LAP-09"
                    value={newPrice.code}
                    onChange={e => setNewPrice({ ...newPrice, code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="field-label">Satuan</label>
                  <input
                    className="form-input"
                    placeholder="unit / box / rim"
                    value={newPrice.unit}
                    onChange={e => setNewPrice({ ...newPrice, unit: e.target.value })}
                  />
                </div>
              </div>

              <label className="field-label">Nama Barang / Jasa</label>
              <input
                className="form-input"
                required
                placeholder="Contoh: Proyektor 4000 Lumens"
                value={newPrice.name}
                onChange={e => setNewPrice({ ...newPrice, name: e.target.value })}
              />

              <div className="form-row">
                <div>
                  <label className="field-label">Kategori</label>
                  <select
                    className="form-input"
                    value={newPrice.category}
                    onChange={e => setNewPrice({ ...newPrice, category: e.target.value })}
                  >
                    <option>Perangkat IT</option>
                    <option>Alat Tulis Kantor</option>
                    <option>Alat Kesehatan</option>
                    <option>Peralatan Laboratorium</option>
                    <option>Bahan Bangunan</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Harga Referensi (Rp)</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    placeholder="Contoh: 8500000"
                    value={newPrice.reference_price}
                    onChange={e => setNewPrice({ ...newPrice, reference_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div>
                  <label className="field-label">Wilayah Berlaku</label>
                  <select
                    className="form-input"
                    value={newPrice.region}
                    onChange={e => setNewPrice({ ...newPrice, region: e.target.value })}
                  >
                    <option value="National">National (Umum)</option>
                    <option value="Jawa & Sumatera">Jawa & Sumatera</option>
                    <option value="Papua & Maluku">Papua & Maluku</option>
                    <option value="Papua Tengah">Papua Tengah</option>
                    <option value="Papua Pegunungan">Papua Pegunungan</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Sumber Acuan</label>
                  <input
                    className="form-input"
                    placeholder="E-Katalog LKPP / Standar Biaya Masukan (SBM)"
                    value={newPrice.source}
                    onChange={e => setNewPrice({ ...newPrice, source: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="ghost-btn" onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="primary-btn" disabled={savingPrice}>
                  {savingPrice ? 'Menyimpan…' : 'Simpan Acuan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}