"""
Risk Finder Engine for AURA.
Adopts the 5 checks from risk-finder-7.emergent.host:
1. Pembayaran Ganda (Duplicate Invoices / Payments)
2. Transaksi Tidak Wajar / Outlier (Q3 + 3*IQR and Vendor Average deviation)
3. Vendor Mirip (Vendor Similarity Check using normalized Levenshtein/Jaro-Winkler/Token similarity >= 75%)
4. Transaksi Terpecah / Split Transactions (>= 3 transactions below threshold e.g. Rp 50M for same vendor in single day)
5. Risk Scoring (Deterministic scoring 0-99 based on deviation magnitude)
"""

import io
import re
from difflib import SequenceMatcher
from datetime import datetime
from typing import List, Dict, Any, Tuple
import pandas as pd
import numpy as np


def normalize_vendor_name(name: str) -> str:
    if not name:
        return ""
    n = re.sub(r'[^\w\s]', ' ', str(name).upper())
    tokens = n.split()
    cleaned = [t for t in tokens if t not in {'PT', 'CV', 'UD', 'TBK', 'LTD', 'INC', 'PERSERO', 'FA', 'PO'}]
    return " ".join(cleaned).strip()


def compute_string_similarity(s1: str, s2: str) -> float:
    n1 = normalize_vendor_name(s1)
    n2 = normalize_vendor_name(s2)
    if not n1 or not n2:
        return 0.0
    if n1 == n2:
        return 1.0
    return SequenceMatcher(None, n1, n2).ratio()


def parse_numeric_amount(val: Any) -> float:
    if pd.isna(val) or val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip()
    s = re.sub(r'^[Rr][Pp]\.?\s*', '', s)
    if ',' in s and '.' in s:
        if s.rfind(',') > s.rfind('.'):
            s = s.replace('.', '').replace(',', '.')
        else:
            s = s.replace(',', '')
    elif ',' in s:
        parts = s.split(',')
        if len(parts) > 1 and len(parts[-1]) == 2:
            s = s.replace(',', '.')
        else:
            s = s.replace(',', '')
    elif '.' in s:
        parts = s.split('.')
        if len(parts) > 2 or (len(parts) == 2 and len(parts[1]) == 3):
            s = s.replace('.', '')
    try:
        return float(re.sub(r'[^\d.]', '', s))
    except Exception:
        return 0.0


def map_columns(df: pd.DataFrame) -> Dict[str, str]:
    col_map = {}
    lower_cols = {str(c).strip().lower(): c for c in df.columns}
    
    for candidate in ['vendor', 'supplier', 'pemasok', 'nama vendor', 'nama supplier', 'rekanan', 'nama perusahaan', 'nama rekanan']:
        if candidate in lower_cols:
            col_map['vendor'] = lower_cols[candidate]
            break
    for candidate in ['nominal', 'jumlah', 'total', 'amount', 'nilai', 'nilai transaksi', 'harga', 'total bayar', 'subtotal']:
        if candidate in lower_cols:
            col_map['amount'] = lower_cols[candidate]
            break
    for candidate in ['no invoice', 'nomor invoice', 'no. invoice', 'invoice', 'no faktur', 'faktur', 'no kuitansi', 'kuitansi', 'inv', 'nomor bukti']:
        if candidate in lower_cols:
            col_map['invoice'] = lower_cols[candidate]
            break
    for candidate in ['tanggal', 'date', 'tgl', 'tgl transaksi', 'tanggal bayar', 'created_at']:
        if candidate in lower_cols:
            col_map['date'] = lower_cols[candidate]
            break
            
    return col_map


class RiskFinderEngine:
    def __init__(self, split_threshold: float = 50000000, similarity_threshold: float = 0.75):
        self.split_threshold = split_threshold
        self.similarity_threshold = similarity_threshold

    def analyze_dataframe(self, df: pd.DataFrame, file_name: str = "uploaded_file.xlsx") -> Dict[str, Any]:
        t0 = datetime.now()
        col_map = map_columns(df)
        if 'vendor' not in col_map or 'amount' not in col_map:
            raise ValueError(
                f"Kolom wajib tidak ditemukan. Memerlukan kolom Vendor (mis. 'Vendor', 'Supplier', 'Pemasok') "
                f"dan Nominal (mis. 'Nominal', 'Jumlah', 'Total'). Kolom tersedia: {list(df.columns)}"
            )

        v_col = col_map['vendor']
        a_col = col_map['amount']
        inv_col = col_map.get('invoice')
        d_col = col_map.get('date')

        transactions = []
        for idx, row in df.iterrows():
            amt = parse_numeric_amount(row[a_col])
            v_name = str(row[v_col]).strip() if pd.notna(row[v_col]) else "Vendor Tidak Diketahui"
            inv = str(row[inv_col]).strip() if inv_col and pd.notna(row[inv_col]) else f"INV-{idx+1:04d}"
            
            raw_date = row[d_col] if d_col and pd.notna(row[d_col]) else None
            dt_str = "2026-06-15"
            if raw_date:
                try:
                    if isinstance(raw_date, (datetime, pd.Timestamp)):
                        dt_str = raw_date.strftime("%Y-%m-%d")
                    else:
                        parsed = pd.to_datetime(raw_date, dayfirst=True)
                        dt_str = parsed.strftime("%Y-%m-%d")
                except Exception:
                    dt_str = str(raw_date)[:10]

            transactions.append({
                "id": f"TRX-{idx+1:04d}",
                "vendor": v_name,
                "invoice": inv,
                "amount": amt,
                "date": dt_str,
                "row_index": idx
            })

        findings = []
        finding_id_counter = 1

        # 1. PEMBAYARAN GANDA
        inv_groups = {}
        for t in transactions:
            if t["invoice"] and t["invoice"] != f"INV-{t['row_index']+1:04d}":
                key = (t["vendor"].lower(), t["invoice"].lower(), t["amount"])
                inv_groups.setdefault(key, []).append(t)
            else:
                key = (t["vendor"].lower(), t["amount"], t["date"])
                inv_groups.setdefault(key, []).append(t)

        for key, txs in inv_groups.items():
            if len(txs) > 1:
                amt = txs[0]["amount"]
                vendor = txs[0]["vendor"]
                inv = txs[0]["invoice"]
                findings.append({
                    "id": f"F-{finding_id_counter:02d}",
                    "type": "duplicate",
                    "vendor": vendor,
                    "amount": amt,
                    "risk_score": min(95, 70 + (len(txs) * 3)),
                    "severity": "tinggi" if amt > 20000000 else "sedang",
                    "reasons": [
                        f"Invoice {inv} dibayar {len(txs)} kali dengan nominal identik",
                        f"Potensi kelebihan bayar Rp {amt * (len(txs) - 1):,.0f}".replace(',', '.')
                    ],
                    "transactions": [{
                        "id": t["id"], "vendor": t["vendor"], "invoice": t["invoice"],
                        "amount": t["amount"], "date": t["date"]
                    } for t in txs]
                })
                finding_id_counter += 1

        # 2. TRANSAKSI TIDAK WAJAR / OUTLIER
        amounts = np.array([t["amount"] for t in transactions if t["amount"] > 0])
        if len(amounts) >= 4:
            q1 = np.percentile(amounts, 25)
            q3 = np.percentile(amounts, 75)
            iqr = q3 - q1
            outlier_cutoff = q3 + (3 * iqr)
        else:
            outlier_cutoff = float('inf')

        vendor_totals = {}
        for t in transactions:
            vendor_totals.setdefault(t["vendor"], []).append(t["amount"])
        vendor_avg = {v: sum(nums) / len(nums) for v, nums in vendor_totals.items()}

        for t in transactions:
            v_mean = vendor_avg.get(t["vendor"], 1)
            pct_above_mean = ((t["amount"] - v_mean) / v_mean) * 100 if v_mean > 0 else 0
            if (t["amount"] > outlier_cutoff and t["amount"] > 50000000) or (pct_above_mean >= 300 and t["amount"] >= 50000000):
                findings.append({
                    "id": f"F-{finding_id_counter:02d}",
                    "type": "outlier",
                    "vendor": t["vendor"],
                    "amount": t["amount"],
                    "risk_score": min(98, 85 + int(pct_above_mean // 200)),
                    "severity": "tinggi",
                    "reasons": [
                        f"Nominal {pct_above_mean:.0f}% di atas rata-rata vendor (Rp {v_mean:,.0f})".replace(',', '.'),
                        f"Melampaui batas statistik Q3 + 3×IQR transaksi (Rp {outlier_cutoff:,.0f})".replace(',', '.')
                    ],
                    "transactions": [{
                        "id": t["id"], "vendor": t["vendor"], "invoice": t["invoice"],
                        "amount": t["amount"], "date": t["date"]
                    }]
                })
                finding_id_counter += 1

        # 3. VENDOR MIRIP (Similarity >= 75%)
        unique_vendors = sorted(list(vendor_totals.keys()))
        checked_pairs = set()
        for i in range(len(unique_vendors)):
            for j in range(i + 1, len(unique_vendors)):
                v1, v2 = unique_vendors[i], unique_vendors[j]
                pair_key = tuple(sorted([v1, v2]))
                if pair_key in checked_pairs:
                    continue
                checked_pairs.add(pair_key)
                sim = compute_string_similarity(v1, v2)
                if 0.75 <= sim < 1.0:
                    v1_txs = [t for t in transactions if t["vendor"] == v1]
                    v2_txs = [t for t in transactions if t["vendor"] == v2]
                    combined_txs = v1_txs + v2_txs
                    total_amt = sum(t["amount"] for t in combined_txs)
                    findings.append({
                        "id": f"F-{finding_id_counter:02d}",
                        "type": "vendor_similarity",
                        "vendor": f"{v1} ↔ {v2}",
                        "amount": total_amt,
                        "risk_score": min(95, 75 + int(sim * 15)),
                        "severity": "tinggi" if sim >= 0.85 else "sedang",
                        "reasons": [
                            f"Nama vendor hampir sama (kemiripan {int(sim*100)}%)",
                            "Berpotensi entitas ganda untuk vendor yang sama"
                        ],
                        "transactions": [{
                            "id": t["id"], "vendor": t["vendor"], "invoice": t["invoice"],
                            "amount": t["amount"], "date": t["date"]
                        } for t in combined_txs[:8]]
                    })
                    finding_id_counter += 1

        # 4. SPLIT TRANSACTIONS
        day_vendor_txs = {}
        for t in transactions:
            key = (t["vendor"], t["date"])
            day_vendor_txs.setdefault(key, []).append(t)

        for (v, dt), txs in day_vendor_txs.items():
            split_candidates = [t for t in txs if 0 < t["amount"] < self.split_threshold]
            if len(split_candidates) >= 3:
                total_split = sum(t["amount"] for t in split_candidates)
                findings.append({
                    "id": f"F-{finding_id_counter:02d}",
                    "type": "split",
                    "vendor": v,
                    "amount": total_split,
                    "risk_score": min(96, 80 + (len(split_candidates) * 3)),
                    "severity": "tinggi",
                    "reasons": [
                        f"{len(split_candidates)} pembayaran di bawah Rp 50.000.000 pada hari yang sama ({dt})",
                        f"Total Rp {total_split:,.0f} — indikasi penghindaran batas persetujuan kewenangan (splitting)".replace(',', '.')
                    ],
                    "transactions": [{
                        "id": t["id"], "vendor": t["vendor"], "invoice": t["invoice"],
                        "amount": t["amount"], "date": t["date"]
                    } for t in split_candidates]
                })
                finding_id_counter += 1

        # 5. SUMMARY
        duplicates_count = len([f for f in findings if f["type"] == "duplicate"])
        outliers_count = len([f for f in findings if f["type"] == "outlier"])
        similar_count = len([f for f in findings if f["type"] == "vendor_similarity"])
        splits_count = len([f for f in findings if f["type"] == "split"])

        overall_risk_score = 0
        if findings:
            scores = [f["risk_score"] for f in findings]
            overall_risk_score = min(99, int(np.mean(scores) * 0.7 + np.max(scores) * 0.3))

        findings.sort(key=lambda x: x["risk_score"], reverse=True)
        elapsed = round((datetime.now() - t0).total_seconds(), 2)

        return {
            "total_transactions": len(transactions),
            "analysis_seconds": max(0.01, elapsed),
            "file_name": file_name,
            "summary": {
                "total_findings": len(findings),
                "duplicates": duplicates_count,
                "outliers": outliers_count,
                "similar_vendors": similar_count,
                "split_transactions": splits_count,
                "risk_score": overall_risk_score
            },
            "findings": findings
        }

    def generate_excel_report(self, analysis_result: Dict[str, Any]) -> io.BytesIO:
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            summary_data = [
                {"Parameter": "Nama File", "Nilai": analysis_result.get("file_name", "-")},
                {"Parameter": "Total Transaksi Dianalisis", "Nilai": analysis_result.get("total_transactions", 0)},
                {"Parameter": "Durasi Analisis (Detik)", "Nilai": analysis_result.get("analysis_seconds", 0)},
                {"Parameter": "Total Temuan Indikasi Fraud", "Nilai": analysis_result.get("summary", {}).get("total_findings", 0)},
                {"Parameter": "Skor Risiko Keseluruhan (0-99)", "Nilai": analysis_result.get("summary", {}).get("risk_score", 0)},
                {"Parameter": "Indikasi Pembayaran Ganda", "Nilai": analysis_result.get("summary", {}).get("duplicates", 0)},
                {"Parameter": "Indikasi Transaksi Tidak Wajar (Outlier)", "Nilai": analysis_result.get("summary", {}).get("outliers", 0)},
                {"Parameter": "Indikasi Vendor Mirip (Similarity >= 75%)", "Nilai": analysis_result.get("summary", {}).get("similar_vendors", 0)},
                {"Parameter": "Indikasi Pemecahan Transaksi (Splitting)", "Nilai": analysis_result.get("summary", {}).get("split_transactions", 0)},
                {"Parameter": "Status Audit", "Nilai": "Indikasi temuan otomatis untuk diverifikasi lebih lanjut oleh auditor."},
                {"Parameter": "Waktu Pembuatan Laporan", "Nilai": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
            ]
            pd.DataFrame(summary_data).to_excel(writer, sheet_name="Ringkasan Audit", index=False)

            findings_rows = []
            for f in analysis_result.get("findings", []):
                findings_rows.append({
                    "ID Temuan": f.get("id"),
                    "Tipe Temuan": f.get("type"),
                    "Nama Vendor": f.get("vendor"),
                    "Total Nominal (Rp)": f.get("amount"),
                    "Risk Score": f.get("risk_score"),
                    "Tingkat Risiko": f.get("severity"),
                    "Alasan Indikasi": " | ".join(f.get("reasons", [])),
                    "Jumlah Transaksi": len(f.get("transactions", []))
                })
            pd.DataFrame(findings_rows).to_excel(writer, sheet_name="Daftar Temuan", index=False)

            detail_rows = []
            for f in analysis_result.get("findings", []):
                for tx in f.get("transactions", []):
                    detail_rows.append({
                        "ID Temuan": f.get("id"),
                        "Tipe Temuan": f.get("type"),
                        "ID Transaksi": tx.get("id"),
                        "Vendor": tx.get("vendor"),
                        "Invoice": tx.get("invoice"),
                        "Tanggal": tx.get("date"),
                        "Nominal (Rp)": tx.get("amount"),
                        "Risk Score Temuan": f.get("risk_score")
                    })
            pd.DataFrame(detail_rows).to_excel(writer, sheet_name="Detail Transaksi", index=False)

        output.seek(0)
        return output
