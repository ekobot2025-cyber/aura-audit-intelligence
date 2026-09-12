from typing import List, Dict, Any
from datetime import datetime, timedelta

class SplittingDetector:
    def detect(self, transactions: List[Dict[str, Any]], threshold: float, time_window_days: int, min_count: int) -> List[Dict[str, Any]]:
        results = []
        
        # Group by vendor
        vendor_tx = {}
        for tx in transactions:
            vendor = tx.get("vendor")
            if not vendor:
                continue
            if vendor not in vendor_tx:
                vendor_tx[vendor] = []
            vendor_tx[vendor].append(tx)
            
        for vendor, txs in vendor_tx.items():
            # Sort by date
            try:
                txs.sort(key=lambda x: datetime.fromisoformat(x.get("date", "2000-01-01")))
            except ValueError:
                pass # skip if bad date
                
            # Sliding window
            for i in range(len(txs)):
                window = [txs[i]]
                start_date_str = txs[i].get("date")
                if not start_date_str:
                    continue
                start_date = datetime.fromisoformat(start_date_str)
                
                for j in range(i + 1, len(txs)):
                    curr_date_str = txs[j].get("date")
                    if not curr_date_str:
                        continue
                    curr_date = datetime.fromisoformat(curr_date_str)
                    
                    if (curr_date - start_date).days <= time_window_days:
                        window.append(txs[j])
                    else:
                        break
                        
                if len(window) >= min_count:
                    total_amount = sum(t.get("amount", 0) for t in window)
                    avg_amount = total_amount / len(window)
                    
                    # Check if average is close to but under threshold (e.g., between 50% and 100% of threshold)
                    # And total > threshold
                    if total_amount > threshold and all(t.get("amount", 0) < threshold for t in window):
                        # Avoid duplicates in results if multiple overlapping windows match
                        existing = any(r["vendor"] == vendor and set(t["id"] for t in r["transactions"]) == set(t["id"] for t in window) for r in results)
                        if not existing:
                            results.append({
                                "vendor": vendor,
                                "transactions": window,
                                "total": total_amount,
                                "count": len(window),
                                "avg_per_transaction": avg_amount,
                                "threshold": threshold,
                                "risk_level": "HIGH",
                                "explanation": f"Indikasi Potensi Fraud: {len(window)} transaksi dipecah untuk menghindari limit {threshold} dalam {time_window_days} hari."
                            })
                            
        return results
