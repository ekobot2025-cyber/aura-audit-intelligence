"""
TGR (Tuntutan Ganti Rugi) & State Loss Recovery Engine
Diadopsi dari Standar LHP BPK RI & SIKWAP BPKP.
Menghitung estimasi pasti kerugian keuangan negara / kas BLU yang dapat diselamatkan/ditagih kembali
beserta perumusan rekomendasi tindak lanjut berstandar APIP (Aparat Pengawasan Intern Pemerintah).
"""
from typing import List, Dict, Any

TGR_FINDINGS = [
    {
        "case_id": "TGR-2026-001",
        "reference_dossier": "SPJ-2026-FEB-019",
        "category": "Mark-up Harga di Atas E-Katalog LKPP",
        "source_doc": "Invoice & BAST Pengadaan Laptop ASUS Vivobook 14 (10 Unit)",
        "unit": "Laboratorium Komputer & Akuntansi FEB",
        "responsible_party": "Pejabat Pembuat Komitmen (PPK) & Rekanan PT Arunika Teknologi",
        "invoiced_amount": 185_000_000,
        "valid_benchmark_amount": 138_000_000,
        "tgr_recovery_amount": 47_000_000,
        "legal_basis": "Perpres No. 12 Tahun 2021 Pasal 78 (Kewajaran Harga) & Standar E-Katalog LKPP Wilayah Papua",
        "sanction_category": "Kategori II (Finansial - Tuntutan Ganti Rugi)",
        "action_required": "Penyetoran kelebihan bayar sebesar Rp 47.000.000 ke Rekening Kas BLU Universitas Cenderawasih.",
        "due_date_days": 60,
        "status": "DRAFT_REKOMENDASI_TERBIT"
    },
    {
        "case_id": "TGR-2026-002",
        "reference_dossier": "SPJ-2026-FEB-014",
        "category": "Kekurangan Volume Fisik Penyerahan BAST",
        "source_doc": "BAST Meja & Kursi Kuliah Modular (Fisik 35 Unit vs SPJ 50 Unit)",
        "unit": "Subbag Perlengkapan & Sarana Prasarana FEB",
        "responsible_party": "Panitia Penerima Hasil Pekerjaan (PPHP) & CV Nusantara Karya",
        "invoiced_amount": 74_800_000,
        "valid_benchmark_amount": 52_360_000,
        "tgr_recovery_amount": 22_440_000,
        "legal_basis": "Pasal 57 Perpres PBJ (Kesesuaian Volume BAST) & UU No. 1 Tahun 2004 tentang Perbendaharaan Negara",
        "sanction_category": "Kategori II (Finansial) & Kategori I (Administratif)",
        "action_required": "Rekanan diwajibkan menyerahkan sisa 15 unit fisik dalam 14 hari atau menyetor kembali senilai Rp 22.440.000.",
        "due_date_days": 14,
        "status": "MENUNGGU_KLARIFIKASI"
    },
    {
        "case_id": "TGR-2026-003",
        "reference_dossier": "SPJ-2026-FEB-008",
        "category": "Pencairan Kuitansi SPPD Ganda",
        "source_doc": "Tiket Penerbangan Jayapura-Jakarta (Garuda GA-650)",
        "unit": "Jurusan Akuntansi & Pusat Kajian Ekonomi FEB",
        "responsible_party": "Pengaju Klaim SPPD & Bendahara Pengeluaran Pembantu",
        "invoiced_amount": 4_850_000,
        "valid_benchmark_amount": 0,
        "tgr_recovery_amount": 4_850_000,
        "legal_basis": "PMK Standar Biaya Masukan (SBM) Perjalanan Dinas Jabatan Dalam Negeri",
        "sanction_category": "Kategori II (Pengembalian Kas) & Kategori III (Teguran Tertulis)",
        "action_required": "Pembatalan SP2D kedua dan penyetoran pengembalian sisa uang muka ke Kas BLU.",
        "due_date_days": 7,
        "status": "TINDAK_LANJUT_BERJALAN"
    }
]

def calculate_tgr_summary() -> Dict[str, Any]:
    """
    Menghitung total potensi pemulihan kerugian kas dan matriks rekomendasi APIP.
    """
    total_tgr = sum(item["tgr_recovery_amount"] for item in TGR_FINDINGS)
    total_invoiced = sum(item["invoiced_amount"] for item in TGR_FINDINGS)
    
    return {
        "status": "success",
        "total_tgr_recovery": total_tgr,
        "total_invoiced_under_review": total_invoiced,
        "cases_count": len(TGR_FINDINGS),
        "recovery_rate_percent": round((total_tgr / total_invoiced * 100.0), 1) if total_invoiced > 0 else 0,
        "findings": TGR_FINDINGS,
        "apip_action_plan": [
            {
                "tier": "Kategori I - Administratif",
                "description": "Koreksi dokumen, kelengkapan BAST fisik, dan penyesuaian catatan aset tetap BMN/BLU.",
                "timeline": "Maksimal 14 Hari Kalender"
            },
            {
                "tier": "Kategori II - Finansial (Setor Kas)",
                "description": f"Penyetoran pemulihan kerugian sebesar Rp {total_tgr:,.0f} ke Kas BLU Universitas Cenderawasih.",
                "timeline": "Maksimal 60 Hari Kalender (Pasal 20 UU BPK No. 15/2004)"
            },
            {
                "tier": "Kategori III - Sanksi Rekanan",
                "description": "Pengenaan sanksi daftar hitam (blacklist) selama 1 tahun di portal E-Katalog & LPSE untuk rekanan wanprestasi.",
                "timeline": "Segera setelah Berita Acara Final"
            }
        ]
    }
