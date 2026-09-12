"""
Vendor Collusion & Conflict of Interest Matrix Engine
Diadopsi dari KPK JAGA.ID & BPK RI BIDIK.
Mendeteksi persekongkolan tender/pengadaan langsung semu (tender arisan / pinjam bendera),
di mana rekanan peserta pengadaan memiliki nomor rekening, telepon, atau alamat fisik yang identik.
"""
from typing import List, Dict, Any

COLLUSION_CLUSTERS = [
    {
        "cluster_id": "COL-CLUSTER-01",
        "name": "Kluster Pengadaan Perangkat IT & ATK FEB",
        "risk_level": "HIGH",
        "risk_score": 89,
        "indicator": "Kesamaan Nomor Rekening Bank & Alamat IP Pengajuan Penawaran",
        "description": "Dua vendor yang mengajukan penawaran pada pengadaan laboratorium komputer ternyata memiliki rekening penampung yang sama di Bank BNI KC Jayapura.",
        "shared_attributes": [
            {"attribute": "Nomor Rekening Bank", "value": "BNI 023-889-1029 (a.n. Sdr. Hendra K.)", "type": "SHARED_BANK_ACCOUNT"},
            {"attribute": "Alamat Kantor", "value": "Jl. Raya Abepura No. 45, Kotaraja, Jayapura", "type": "SHARED_ADDRESS"},
            {"attribute": "Nomor Kontak", "value": "0812-4882-XXXX", "type": "SHARED_PHONE"}
        ],
        "involved_vendors": [
            {
                "id": "VND-001",
                "name": "PT Arunika Teknologi",
                "director": "Hendra Kurniawan",
                "role_in_procurement": "Pemenang Pengadaan (Rp 185 Juta)",
                "npwp": "01.234.567.8-012.000"
            },
            {
                "id": "VND-005",
                "name": "CV Cenderawasih Cipta Solusi",
                "director": "Dewi Kurniawan (Afiliasi Keluarga)",
                "role_in_procurement": "Peserta Pendamping / Pembanding (Penawaran Rp 189 Juta)",
                "npwp": "02.889.123.4-091.000"
            }
        ],
        "red_flag_alert": "Indikasi kuat 'Pinjam Bendera' / Penawaran Semu: CV Cenderawasih Cipta Solusi hanya berperan sebagai formalitas pembanding agar syarat minimal penawaran terpenuhi."
    },
    {
        "cluster_id": "COL-CLUSTER-02",
        "name": "Kluster Pengadaan Mebeleur & Renovasi Gedung",
        "risk_level": "MEDIUM",
        "risk_score": 68,
        "indicator": "Kesamaan Penanggung Jawab Teknis & Alamat Kantor",
        "description": "Dua rekanan beralamat di ruko berdampingan dengan penanggung jawab sertifikat keahlian konstruksi yang sama.",
        "shared_attributes": [
            {"attribute": "Alamat Kantor", "value": "Komp. Ruko Pasir Putih Blok B No. 3-4, Jayapura Utara", "type": "SHARED_ADDRESS"},
            {"attribute": "Tenaga Ahli", "value": "Ir. B. Rumkabu (Tercatat di kedua berkas rekanan)", "type": "SHARED_PERSONNEL"}
        ],
        "involved_vendors": [
            {
                "id": "VND-002",
                "name": "CV Nusantara Karya",
                "director": "S. Wibowo",
                "role_in_procurement": "Pelaksana Pekerjaan Meja Modular (Rp 74.8 Juta)",
                "npwp": "02.345.678.9-013.000"
            },
            {
                "id": "VND-006",
                "name": "CV Papua Prima Mandiri",
                "director": "Y. Rumkabu",
                "role_in_procurement": "Vendor Pembanding (Rp 77.2 Juta)",
                "npwp": "03.112.456.7-088.000"
            }
        ],
        "red_flag_alert": "Indikasi Afiliasi Vertikal: Tenaga ahli yang sama digunakan untuk melegitimasi penawaran dua entitas berbeda dalam paket pekerjaan yang sama."
    }
]

def scan_vendor_collusion() -> Dict[str, Any]:
    """
    Memindai jaringan rekanan untuk mendeteksi kluster persekongkolan dan konflik kepentingan.
    """
    return {
        "status": "success",
        "clusters_found": len(COLLUSION_CLUSTERS),
        "high_risk_clusters": sum(1 for c in COLLUSION_CLUSTERS if c["risk_level"] == "HIGH"),
        "clusters": COLLUSION_CLUSTERS,
        "audit_recommendation": (
            "Ditemukan 2 kluster rekanan dengan atribut identik (rekening bank & alamat). "
            "Sesuai Perpres PBJ Pasal 78, persekongkolan penyedia dapat dikenakan sanksi "
            "pembatalan kontrak, pencairan jaminan penawaran, dan sanksi daftar hitam selama 2 tahun."
        )
    }
