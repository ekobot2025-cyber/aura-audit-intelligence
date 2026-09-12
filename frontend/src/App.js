import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, FileCheck2, Activity, BarChart3, 
  GitCompare, ClipboardCheck, ShieldCheck, TrendingUp, 
  FolderKanban, Bot, SlidersHorizontal, Cog, Settings2, 
  Menu, Search, Bell, ChevronRight, FileSpreadsheet, Smartphone, Award,
  Check, CheckCheck, AlertTriangle, Flame, Clock, ShieldAlert, ExternalLink
} from 'lucide-react';
import './App.css';

import Dashboard from './components/Dashboard';
import DocumentsView from './components/DocumentsView';
import AuditorView from './components/AuditorView';
import VendorsView from './components/VendorsView';
import PriceIntelligenceView from './components/PriceIntelligenceView';
import CrossDocumentView from './components/CrossDocumentView';
import DuplicateDetectionView from './components/DuplicateDetectionView';
import FraudPatternsView from './components/FraudPatternsView';
import FraudRulesView from './components/FraudRulesView';
import TransactionsView from './components/TransactionsView';
import CasesView from './components/CasesView';
import RiskFinderView from './components/RiskFinderView';
import ReceiptInspectorView from './components/ReceiptInspectorView';
import EnterpriseForensicsView from './components/EnterpriseForensicsView';
import SettingsView from './components/SettingsView';
import LandingPage from './components/LandingPage';
import { LogOut, Home } from 'lucide-react';


const API = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api`;

const NAV = [
  { section: 'MONITORING' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'ANALYSIS' },
  { id: 'risk-finder', label: 'Excel Fraud Checker', icon: FileSpreadsheet },
  { id: 'receipt-inspector', label: 'Inspektur Struk & Transfer', icon: Smartphone },
  { id: 'documents', label: 'Documents', icon: FileCheck2 },
  { id: 'transactions', label: 'Transactions', icon: Activity },
  { id: 'price-intelligence', label: 'Price Intelligence', icon: BarChart3 },
  { section: 'FRAUD ANALYTICS' },
  { id: 'cross-document', label: 'Cross Document', icon: GitCompare },
  { id: 'duplicate-detection', label: 'Duplicate Detection', icon: ClipboardCheck },
  { id: 'fraud-patterns', label: 'Fraud Patterns', icon: TrendingUp },
  { id: 'vendor-risk', label: 'Vendor Risk', icon: ShieldCheck },
  { section: 'INVESTIGATION' },
  { id: 'enterprise-forensics', label: 'Enterprise Forensics 10/10', icon: Award },
  { id: 'cases', label: 'Cases', icon: FolderKanban },
  { id: 'ai-auditor', label: 'AI Auditor', icon: Bot },
  { section: 'KONFIGURASI' },
  { id: 'reference-prices', label: 'Reference Prices', icon: SlidersHorizontal },
  { id: 'fraud-rules', label: 'Fraud Rules', icon: Cog },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    severity: 'HIGH',
    title: 'Anomali Distribusi Benford (Digit 4)',
    message: 'Lonjakan 27.8% transaksi pada rentang nominal Rp46jt - Rp49jt (indikasi pemecahan pagu lelang langsung Rp50jt).',
    time: '5 mnt lalu',
    page: 'enterprise-forensics',
    unread: true,
  },
  {
    id: 'notif-2',
    severity: 'MEDIUM',
    title: 'Klaim SPPD & Tiket Ganda',
    message: 'Kode booking tiket Garuda GA-650 (PNR 6Z8KL9) dicairkan oleh dua kepanitiaan kegiatan terpisah.',
    time: '23 mnt lalu',
    page: 'enterprise-forensics',
    unread: true,
  },
  {
    id: 'notif-3',
    severity: 'CRITICAL',
    title: 'Potensi Tuntutan Ganti Rugi (TGR)',
    message: 'Kalkulasi potensi setor kas BLU Rp 74.290.000 atas selisih fisik meja BAST & markup laptop e-Katalog.',
    time: '1 jam lalu',
    page: 'enterprise-forensics',
    unread: true,
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aura_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.email && parsed.email.includes('@aura-intelligence.id')) {
        const prefix = parsed.email.split('@')[0];
        parsed.username = prefix;
        parsed.email = `@${prefix}`;
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [page, setPage] = useState('dashboard');
  const [data, setData] = useState(null);
  const [toast, setToast] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  // ── Notifications State ──
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('aura_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('aura_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    notify('Seluruh notifikasi telah ditandai sebagai dibaca');
  };

  const handleNotificationAction = (n) => {
    markNotificationAsRead(n.id);
    setShowNotifications(false);
    setPage(n.page);
    notify(`Menuju investigasi: ${n.title}`);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('aura_user', JSON.stringify(user));
    notify(`Selamat datang di AURA, ${user.role} (@${user.username || 'auditor'})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aura_user');
  };

  useEffect(() => {
    axios.get(`${API}/dashboard`)
      .then(r => setData(r.data))
      .catch(() => setData({
        kpis: { documents: 148, high: 12, medium: 28, low: 108, exposure: 264650000 },
        trend: [
          { month: 'Jan', fraud: 2, normal: 40 },
          { month: 'Feb', fraud: 4, normal: 38 },
          { month: 'Mar', fraud: 1, normal: 45 },
          { month: 'Apr', fraud: 5, normal: 42 },
          { month: 'Mei', fraud: 3, normal: 50 },
          { month: 'Jun', fraud: 8, normal: 48 },
          { month: 'Jul', fraud: 6, normal: 52 },
          { month: 'Agu', fraud: 9, normal: 47 },
          { month: 'Sep', fraud: 12, normal: 55 },
        ],
        transactions: [
          { id: 'TX-8091', date: '2026-09-10', vendor: 'CV Cenderawasih Cipta Solusi', desc: 'Pengadaan Laptop Laboratorium Komputer', amount: 49800000, risk: 'HIGH', score: 88 },
          { id: 'TX-8092', date: '2026-09-09', vendor: 'PT Arunika Teknologi', desc: 'Perangkat Jaringan Switch & Router Core', amount: 48500000, risk: 'HIGH', score: 82 },
          { id: 'TX-8093', date: '2026-09-08', vendor: 'CV Papua Prima Mandiri', desc: 'Pengadaan Meja Kursi Modular Ruang Kuliah', amount: 22440000, risk: 'MEDIUM', score: 65 },
          { id: 'TX-8094', date: '2026-09-07', vendor: 'Garuda Indonesia Airways', desc: 'Tiket Penerbangan Tim Assesor LAMEMBA', amount: 4850000, risk: 'HIGH', score: 91 },
        ],
        vendors: [
          { name: 'PT Arunika Teknologi', risk: 'HIGH', score: 89, flags: 4 },
          { name: 'CV Cenderawasih Cipta Solusi', risk: 'HIGH', score: 84, flags: 3 },
          { name: 'CV Papua Prima Mandiri', risk: 'MEDIUM', score: 62, flags: 2 },
          { name: 'PT Sentosa Abadi Jaya', risk: 'LOW', score: 18, flags: 0 },
        ],
      }));
  }, []);

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard data={data} onNavigate={setPage} />;
      case 'risk-finder': return <RiskFinderView />;
      case 'receipt-inspector': return <ReceiptInspectorView />;
      case 'enterprise-forensics': return <EnterpriseForensicsView currentUser={currentUser} />;
      case 'documents': return <DocumentsView onUpload={notify} />;
      case 'transactions': return <TransactionsView />;
      case 'cases': return <CasesView />;
      case 'ai-auditor': return <AuditorView />;
      case 'vendor-risk': return <VendorsView />;
      case 'price-intelligence':
      case 'reference-prices': return <PriceIntelligenceView />;
      case 'cross-document': return <CrossDocumentView />;
      case 'duplicate-detection': return <DuplicateDetectionView />;
      case 'fraud-patterns': return <FraudPatternsView />;
      case 'fraud-rules': return <FraudRulesView />;
      case 'settings': return <SettingsView currentUser={currentUser} />;
      default: return (
        <div className="empty-state">
          <Settings2 size={40} color="#9db3c5" />
          <p className="eyebrow">MODULE READY</p>
          <h2>{page.replace(/-/g, ' ')}</h2>
          <p className="muted">Modul ini siap digunakan dengan data analisis berbasis bukti.</p>
          <button className="primary-btn" onClick={() => setPage('dashboard')}>Kembali ke Dashboard</button>
        </div>
      );
    }
  };

  // If not authenticated, display Landing Page (Expertise-Showcase-19 adoption with Login Gateway)
  if (!currentUser) {
    return <LandingPage onLoginSuccess={handleLogin} />;
  }

  if (!data) return <div className="loading">Memuat workspace…</div>;

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="brand">
          <div className="brand-icon"><ShieldCheck size={18} /></div>
          {!collapsed && (
            <div className="brand-text">
              <b style={{ letterSpacing: '2px', fontSize: '18px', color: '#ffffff' }}>AURA</b>
              <span style={{ fontSize: '9px', letterSpacing: '1px', color: '#38bdf8', fontWeight: 700, display: 'block' }}>AUDIT & RISK ANALYTICS</span>
              <span style={{ fontSize: '7.5px', color: '#94a3b8', display: 'block', marginTop: '1px', letterSpacing: '0.2px' }}>AI-Assisted Audit Intelligence Platform</span>
            </div>
          )}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            <Menu size={18} />
          </button>
        </div>


        <nav>
          {NAV.map((item, i) =>
            item.section ? (
              !collapsed && <div key={i} className="nav-section">{item.section}</div>
            ) : (
              <button
                key={item.id}
                className={page === item.id ? 'active' : ''}
                onClick={() => setPage(item.id)}
              >
                <item.icon size={17} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          )}
        </nav>

        {!collapsed && (
          <div className="sidebar-foot">
            <div className="avatar" style={{ 
              background: currentUser?.role?.includes('Admin') 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : currentUser?.role?.includes('Pimpinan') || currentUser?.role?.includes('Dekan') 
                ? 'linear-gradient(135deg, #1d4ed8, #7c3aed)' 
                : (currentUser?.role?.includes('SPI') || currentUser?.role?.includes('Pengawas')) 
                ? 'linear-gradient(135deg, #059669, #10b981)' 
                : (currentUser?.role?.includes('PPK') || currentUser?.role?.includes('Pejabat')) 
                ? 'linear-gradient(135deg, #7c3aed, #9333ea)' 
                : 'linear-gradient(135deg, #0284c7, #2563eb)' 
            }}>
              {currentUser?.role?.includes('Admin') ? 'AD' : currentUser?.role?.includes('Pimpinan') ? 'PM' : (currentUser?.role?.includes('SPI') || currentUser?.role?.includes('Pengawas')) ? 'PW' : (currentUser?.role?.includes('PPK') || currentUser?.role?.includes('Pejabat')) ? 'PJ' : 'AU'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <b style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', display: 'block', fontSize: 12 }}>
                {currentUser?.role || 'Auditor Investigasi Utama'}
              </b>
              <small style={{ color: '#68cffa', fontFamily: 'monospace' }}>
                {currentUser?.username ? `@${currentUser.username}` : (currentUser?.email?.startsWith('@') ? currentUser?.email : `@${currentUser?.username || 'auditor'}`)}
              </small>
            </div>
          </div>
        )}
      </aside>

      {/* Main Area */}
      <div className="main-area flex flex-col min-h-screen">
        <header className="topbar">
          <div className="crumb">
            <span className="text-cyan-400 font-bold font-mono tracking-wider">AURA</span>
            <ChevronRight size={14} />
            <span className="font-semibold text-slate-200">Audit & Risk Analytics</span>
            <span className="text-slate-500 hidden xl:inline text-xs">· AI-Assisted Audit Intelligence Platform</span>
            <ChevronRight size={14} />
            <b style={{ textTransform: 'capitalize' }}>{page.replace(/-/g, ' ')}</b>
          </div>
          <div className="top-actions">
            {/* Active Role Badge */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs shadow-[0_0_15px_-5px_rgba(56,189,248,0.3)]">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-cyan-300 font-semibold">{currentUser?.role || 'Auditor Investigasi Utama'}</span>
              <span className="text-slate-400 font-mono text-[11px]">
                {currentUser?.username ? `@${currentUser.username}` : (currentUser?.email?.startsWith('@') ? currentUser?.email : `@${currentUser?.username || 'auditor'}`)}
              </span>
            </div>

            <button 
              onClick={handleLogout} 
              title="Kembali ke Landing Page / Keluar" 
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-colors mr-1"
            >
              <LogOut size={13} className="text-cyan-400" />
              <span>Keluar</span>
            </button>
            <span className="live-indicator"><span className="live-dot" /> Live Pipeline</span>
            <button 
              title="Cari Kasus & Dokumen..." 
              onClick={() => {
                setPage('cases');
                notify('Membuka pencarian berkas kasus');
              }}
            >
              <Search size={17} />
            </button>

            {/* ── Notification Bell with Popover ── */}
            <div className="relative" ref={notifRef}>
              <button 
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Pusat Peringatan & Notifikasi Audit"
                className={`relative transition-all ${showNotifications ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40 shadow-[0_0_12px_rgba(56,189,248,0.3)]' : ''}`}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="badge-dot animate-pulse">{unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-cyan-500/30 bg-[#090f26]/95 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8),0_0_25px_rgba(56,189,248,0.25)] z-50 overflow-hidden animate-fadeIn">
                  {/* Header */}
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-rose-500 animate-ping" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Pusat Peringatan Audit
                      </h4>
                    </div>
                    {unreadCount > 0 ? (
                      <button
                        type="button"
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors bg-transparent border-0 p-0 cursor-pointer"
                      >
                        <CheckCheck size={13} />
                        <span>Tandai Semua Dibaca</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <Check size={12} /> Semua Terbaca
                      </span>
                    )}
                  </div>

                  {/* Summary Bar */}
                  <div className="px-3.5 py-2 bg-cyan-500/5 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Status: <strong className="text-rose-400 font-mono">{unreadCount} temuan</strong> aktif
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">AURA Real-time Feed</span>
                  </div>

                  {/* List of Alerts */}
                  <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 transition-colors text-left flex gap-3 ${
                          n.unread ? 'bg-slate-900/50 hover:bg-slate-800/60' : 'bg-transparent hover:bg-slate-900/20 opacity-70'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {n.severity === 'CRITICAL' ? (
                            <div className="size-7 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                              <AlertTriangle size={14} />
                            </div>
                          ) : n.severity === 'HIGH' ? (
                            <div className="size-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                              <Flame size={14} />
                            </div>
                          ) : (
                            <div className="size-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                              <ShieldAlert size={14} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                              n.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                              n.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {n.severity}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Clock size={10} />
                              {n.time}
                            </span>
                          </div>

                          <h5 className="text-xs font-semibold text-white leading-snug mb-1">
                            {n.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
                            {n.message}
                          </p>

                          <div className="flex items-center justify-between pt-1">
                            <button
                              type="button"
                              onClick={() => handleNotificationAction(n)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[11px] font-semibold text-cyan-300 transition-all cursor-pointer"
                            >
                              <span>Investigasi Temuan</span>
                              <ChevronRight size={12} />
                            </button>

                            {n.unread && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markNotificationAsRead(n.id);
                                }}
                                title="Tandai sudah dibaca"
                                className="text-[10px] text-slate-400 hover:text-slate-200 font-mono flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                              >
                                <Check size={11} />
                                <span>Tandai Baca</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="p-2.5 border-t border-slate-800/80 bg-slate-950/80 text-center flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                      Engine v10.0 • AI-Assisted
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPage('enterprise-forensics');
                        setShowNotifications(false);
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      <span>Buka Forensic Center</span>
                      <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content flex-1">
          {renderPage()}
        </div>

        {/* ── Footer ── */}
        <footer className="mt-auto border-t border-slate-700/40 py-6 px-6 text-center text-xs text-slate-400 bg-[#0a1224]/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div>
              © 2026 AURA  • Audit &amp; Risk Analytics • AI-Assisted Audit Intelligence Platform. All rights reserved.
            </div>
            <div>
              Made With ❤️ by{' '}
              <a
                href="https://www.linkedin.com/in/papedatimur"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 decoration-cyan-400/50 transition-colors"
              >
                Enterdie
              </a>{' '}
              • Hak Cipta Dilindungi Undang-Undang
            </div>
          </div>
        </footer>

        {toast && (
          <div className="toast">
            <ShieldCheck size={16} />{toast}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
