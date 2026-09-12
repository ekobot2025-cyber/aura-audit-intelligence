"""
Cross-Requester Travel & SPPD Duplicate Detection Engine
Diadopsi dari AppZen Expense AI.
Mendeteksi klaim ganda tiket pesawat, invoice hotel, atau kuitansi perjalanan dinas
yang diajukan oleh dosen / pengaju berbeda pada kegiatan mata anggaran terpisah.
"""
from typing import List, Dict, Any

DEMO_TRAVEL_DUPLICATES = [
    {
        "id": "DUP-SPPD-01",
        "type": "TIKET_PESAWAT_GANDA",
        "item_description": "Tiket Garuda Indonesia GA-650 (Jayapura DJJ ➔ Jakarta CGK)",
        "shared_identifier": "PNR: 6Z8KL9 / E-Ticket: 126-2489102911",
        "amount": 4_850_000,
        "first_claim": {
            "requester": "Dr. Markus W., S.E., M.Si.",
            "unit": "Jurusan Akuntansi FEB",
            "activity": "SPPD Workshop Kurikulum IAI Jakarta",
            "date": "14 Agustus 2026",
            "document_id": "DOC-SPPD-AUG-012",
            "status": "DISETUJUI & DICAIRKAN"
        },
        "duplicate_claim": {
            "requester": "Drs. Samuel K., M.M.",
            "unit": "Pusat Kajian Ekonomi Papua FEB",
            "activity": "SPPD Rapat Koordinasi Hibah Riset Kemendikbud",
            "date": "18 Agustus 2026",
            "document_id": "DOC-SPPD-AUG-088",
            "status": "DALAM REVIEW (TERTAHAN)"
        },
        "similarity_score": 100,
        "risk_level": "HIGH",
        "red_flag": "Nomor E-Ticket & PNR Penerbangan yang sama persis diajukan oleh 2 dosen berbeda untuk 2 kegiatan terpisah."
    },
    {
        "id": "DUP-SPPD-02",
        "type": "HOTEL_INVOICE_GANDA",
        "item_description": "Hotel Santika Premiere Jakarta (Kamar Deluxe 3 Malam)",
        "shared_identifier": "Folio No: HTL-JKT-889102 / Kamar: 0714",
        "amount": 3_600_000,
        "first_claim": {
            "requester": "Panitia Akreditasi Internasional ABEST21",
            "unit": "Program Magister Manajemen FEB",
            "activity": "Akomodasi Tim Reviewer Jakarta",
            "date": "22 Juli 2026",
            "document_id": "DOC-HTL-JUL-044",
            "status": "DICAIRKAN"
        },
        "duplicate_claim": {
            "requester": "Tim Pendamping Akreditasi LAMEMBA",
            "unit": "Dekanat FEB Universitas Cenderawasih",
            "activity": "Konsinyasi Penyusunan Borang Akreditasi",
            "date": "25 Juli 2026",
            "document_id": "DOC-HTL-JUL-099",
            "status": "TERDETEKSI OLEH AI AUDITOR"
        },
        "similarity_score": 98,
        "risk_level": "HIGH",
        "red_flag": "Nomor folio tagihan hotel dan nomor kamar yang sama dilampirkan ganda pada dua pertanggungjawaban kegiatan panitia berbeda."
    },
    {
        "id": "DUP-SPPD-03",
        "type": "KUITANSI_KONSUMSI_IDENTIK",
        "item_description": "Kuitansi Jamuan Konsumsi Delegasi Rektorat & Tamu Asing",
        "shared_identifier": "Nota Kontan: RM-PAPUA-0891 / Stempel: RM Yougwa",
        "amount": 2_450_000,
        "first_claim": {
            "requester": "Biro Kerjasama & Alumni FEB",
            "unit": "Fakultas Ekonomi dan Bisnis",
            "activity": "Jamuan Makan Malam Kerjasama Universitas",
            "date": "05 September 2026",
            "document_id": "DOC-NOT-SEP-015",
            "status": "DICAIRKAN"
        },
        "duplicate_claim": {
            "requester": "Panitia Yudisium Gelombang III",
            "unit": "Bagian Akademik FEB",
            "activity": "Konsumsi Rapat Pleno Kelulusan",
            "date": "06 September 2026",
            "document_id": "DOC-NOT-SEP-022",
            "status": "TERTANGKAP AUDIT"
        },
        "similarity_score": 95,
        "risk_level": "HIGH",
        "red_flag": "Nomor seri nota dan rincian menu makanan identik, tanggal hanya selisih 1 hari dengan cap tanda tangan kasir yang sama."
    }
]

def scan_travel_claims() -> Dict[str, Any]:
    """
    Memindai seluruh klaim perjalanan dinas dan konsumsi untuk mendeteksi duplikasi.
    """
    total_potential_leak = sum(item["amount"] for item in DEMO_TRAVEL_DUPLICATES)
    return {
        "status": "success",
        "total_duplicate_cases": len(DEMO_TRAVEL_DUPLICATES),
        "total_financial_exposure": total_potential_leak,
        "findings": DEMO_TRAVEL_DUPLICATES,
        "prevention_recommendation": (
            "Ditemukan 3 berkas pertanggungjawaban dengan indikasi pencairan ganda (double-claiming) "
            f"senilai total Rp {total_potential_leak:,.0f}. Disarankan bendahara menahan pencairan "
            "dan meminta pengesahan tiket/boarding pass fisik asli beserta manifest penumpang resmi dari maskapai/hotel."
        ).replace(",", ".")
    }
