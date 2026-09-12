# AURA • Audit & Risk Analytics
> **AI-Assisted Audit Intelligence & Financial Forensics Platform**  
> *Sistem Pengawasan Keuangan Berbasis Kecerdasan Buatan & Investigasi Forensik Multi-Dimensi*

[![React](https://img.shields.io/badge/Frontend-React%2018-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%203-38bdf8.svg)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel%20Ready-black.svg)](https://vercel.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-yellow.svg)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ?? Sekilas Tentang AURA

**AURA (Audit & Risk Analytics)** adalah platform intelijen audit dan analitik risiko generasi baru yang dirancang untuk membantu auditor internal (SPI/APIP), pimpinan pengarah, inspektorat, dan pejabat keuangan dalam mendeteksi anomali pengadaan belanja, manipulasi bukti kas kuitansi, pemecahan faktur (*split invoice*), klaim perjalanan ganda (*duplicate travel expense*), persekongkolan rekanan (*vendor collusion*), hingga estimasi Tuntutan Ganti Rugi (TGR).

AURA mengadopsi standar emas audit forensik dunia (**MindBridge AI, AppZen Expense AI**) dan standar pengawasan nasional (**BPK RI & BPKP**), dengan tetap mematuhi prinsip kehati-hatian: **semua hasil analisis disajikan sebagai indikasi risiko objektif berbasis bukti, bukan vonis mutlak.**

---

## ?? Fitur Unggulan

### 1. Excel Risk Finder (Audit Transaksi & LPJ)
* **Split Invoice Detection**: Deteksi transaksi pecahan terencana di bawah ambang batas lelang pengadaan langsung (Rp 50.000.000).
* **Weekend & Holiday Outliers**: Memfilter transaksi SPJ yang dicairkan pada hari libur atau di luar jam operasional.
* **Vendor Concentration Index**: Analisis konsentrasi monopoli rekanan berisiko tinggi.

### 2. Inspektur Struk & Transfer (Deep Vision Forensics)
* **Error Level Analysis (ELA)**: Sensor kompresi piksel visual untuk mengungkap teks nominal yang ditimpa (*tampered*) menggunakan software editing gambar.
* **Multi-OCR Cross Check**: Pengecekan digit ganda untuk mencegah pemalsuan font nominal.
* **QRIS & Ref-ID Validator**: Pengecekan keabsahan nomor referensi m-Banking (BCA, Mandiri, BRI, BNI).
* **Integrasi Basis Data Penipuan**: Verifikasi silang otomatis ke database CekRekening.id & OJK.

### 3. Enterprise Forensics 10/10
* **Uji Matematis Hukum Benford (*Benford's Law*)**: Menguji deviasi digit awal nominal transaksi ( \in [1..9]$) dengan metrik Mean Absolute Deviation (MAD Nigrini) dan Chi-Square.
* **Deteksi Klaim SPPD & Tiket Ganda Lintas Unit**: Pelacakan kesamaan kode *booking* (PNR maskapai), folio hotel, dan kuitansi makan yang diklaim ganda oleh unit/panitia berbeda.
* **Kalkulator Tuntutan Ganti Rugi (TGR)**: Estimasi potensi pemulihan uang kas negara/BLU dengan tenggat waktu 60 hari kalender sesuai Pasal 20 UU BPK No. 15/2004.
* **Matriks Afiliasi & Persekongkolan Rekanan**: Pemetaan penawaran semu (*pinjam bendera*) berdasarkan kesamaan nomor rekening bank, kontak, dan alamat rekanan.
* **Digital Sign-off & Dossier**: Penerbitan Berita Acara temuan digital yang dikunci dengan kriptografi SHA-256 dan kode QR verifikasi keaslian.

### 4. Interactive Real-Time Notification Center
* Panel lonceng notifikasi di *topbar* dengan *live alert counter*, indikator tingkat keparahan (*Critical, High, Medium*), dan navigasi langsung satu-klik menuju berkas investigasi.

---

## ?? Akun Demo Praktis (1-Click Login)

Pada layar masuk, Anda dapat menggunakan salah satu akun siap pakai berikut (kata sandi bebas / ura):

| Username | Peran (*Role*) | Cakupan Akses |
| :--- | :--- | :--- |
| **uditor** | **Auditor Investigasi Utama** | Analisis forensik, uji Benford, inspeksi struk, audit dokumen |
| **pimpinan** | **Pimpinan / Pengarah Audit** | Dashboard eksekutif, persetujuan lembar BAP, mitigasi kerugian |
| **pengawas** | **Satuan Pengawas Internal (SPI)** | Audit kepatuhan, pengawasan SPPD ganda, penetapan TGR |
| **pejabat** | **Pejabat Pembuat Komitmen (PPK)** | Verifikasi SPJ, BAST fisik barang, pemantauan pagu lelang |
| **dmin** | **Administrator Sistem** | Konfigurasi parameter engine, ambang batas pagu, integrasi API |

---

## ??? Struktur Repositori

`	ext
fraud_detection/
+-- frontend/                     # Aplikasi Web React 18 + TailwindCSS
¦   +-- public/                   # Static assets & HTML template
¦   +-- src/
¦   ¦   +-- components/           # Seluruh modul tampilan audit AURA
¦   ¦   ¦   +-- LandingPage.js    # Gateway masuk & showcase fitur
¦   ¦   ¦   +-- Dashboard.js      # Executive monitoring & KPIs
¦   ¦   ¦   +-- EnterpriseForensicsView.js # Benford, SPPD, TGR, Afiliasi
¦   ¦   ¦   +-- ReceiptInspectorView.js    # Deep Vision ELA & Struk
¦   ¦   ¦   +-- RiskFinderView.js          # Excel Transaction Auditor
¦   ¦   ¦   +-- DocumentsView.js           # BAST, Kuitansi, Faktur OCR
¦   ¦   ¦   +-- SettingsView.js            # Tata kelola & kebijakan
¦   ¦   +-- App.js                # Routing, Topbar & Notification Center
¦   ¦   +-- App.css               # Styling & animasi cyber-forensics
¦   +-- package.json
¦   +-- vercel.json               # Konfigurasi rewrite SPA Vercel
+-- backend/                      # Engine API FastAPI Python
¦   +-- server.py                 # Endpoint analitik forensik, ELA & Benford
¦   +-- requirements.txt          # Dependensi Python
¦   +-- uploads/                  # Direktori penyimpanan berkas audit
+-- vercel.json                   # Konfigurasi root deployment Vercel
+-- README.md                     # Dokumentasi resmi proyek
`

---

## ?? Panduan Menjalankan Secara Lokal

### Prasyarat
* Node.js v18+ dan npm
* Python 3.10+
* Git

### 1. Jalankan Backend (FastAPI)
`ash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python server.py
`
Backend berjalan di: http://localhost:8001 (Dokumentasi Swagger di http://localhost:8001/docs)

### 2. Jalankan Frontend (React)
`ash
cd frontend
npm install
npm start
`
Frontend berjalan di: http://localhost:3000

---

## ?? Panduan Hosting ke GitHub & Vercel

### Langkah 1: Push ke Repositori GitHub
1. Buka terminal di folder utama proyek (raud_detection).
2. Jalankan perintah berikut:
`ash
git init
git add .
git commit -m "feat: initial commit AURA platform with enterprise forensics & alert center"
git branch -M main
`
3. Buat repositori baru di [GitHub](https://github.com/new) (misalnya diberi nama ura-audit-intelligence).
4. Hubungkan remote dan push:
`ash
git remote add origin https://github.com/USERNAME_ANDA/NAMA_REPO.git
git push -u origin main
`

### Langkah 2: Deploy ke Vercel
1. Masuk ke dashboard [Vercel](https://vercel.com).
2. Klik tombol **"Add New..."** ? **"Project"**.
3. Hubungkan akun GitHub Anda dan pilih repositori yang baru saja di-push.
4. Pada bagian konfigurasi proyek:
   * **Framework Preset**: Pilih **Create React App**.
   * **Root Directory**: Biarkan ./ (karena sudah ada ercel.json di root) **atau** klik Edit dan pilih folder rontend.
   * **Build Command**: 
pm run build
   * **Output Directory**: uild
5. *(Opsional)* Pada menu **Environment Variables**, tambahkan:
   * REACT_APP_BACKEND_URL: https://url-backend-anda.com (bisa diatur nanti jika backend telah dihosting di Render/Railway).
6. Klik **"Deploy"**.
7. Dalam ~1 menit, aplikasi AURA Anda akan langsung aktif secara publik dengan URL seperti https://aura-audit.vercel.app! ??

---

## ?? Landasan Regulasi & Kepatuhan
Sistem audit AURA diselaraskan dengan kerangka hukum pengawasan keuangan di Indonesia:
* **UU No. 15 Tahun 2004** tentang Pemeriksaan Pengelolaan dan Tanggung Jawab Keuangan Negara.
* **Perpres No. 12 Tahun 2021** tentang Perubahan atas Perpres No. 16 Tahun 2018 tentang Pengadaan Barang/Jasa Pemerintah.
* **Peraturan BPKP No. 5 Tahun 2021** tentang Penilaian Maturitas Penyelenggaraan Sistem Pengendalian Intern Pemerintah (SPIP).
* **PMK No. 129/PMK.05/2020** tentang Pedoman Pengelolaan Badan Layanan Umum (BLU).

---

## ????? Kontributor & Lisensi
Dikembangkan dengan ?? oleh **Enterdie**  
LinkedIn: [papedatimur](https://www.linkedin.com/in/papedatimur)  
Hak Cipta © 2026 **AURA • Audit & Risk Analytics • AI-Assisted Audit Intelligence Platform**. All rights reserved.
