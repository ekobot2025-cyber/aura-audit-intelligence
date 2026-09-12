from typing import List, Dict, Any

class CrossDocumentVerifier:
    def verify(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        alerts = []
        
        # Group documents by some key like transaction ID or entity
        # Assuming documents is a list of dicts like: 
        # [{'id': 'doc1', 'type': 'BAST', 'items': [{'product': 'A', 'qty': 18, 'price': 100}]}, ...]
        
        # Build an index by product/item across docs
        item_index = {}
        for doc in documents:
            doc_type = doc.get("type", "Unknown")
            for item in doc.get("items", []):
                prod = item.get("product")
                if not prod:
                    continue
                if prod not in item_index:
                    item_index[prod] = []
                item_index[prod].append({
                    "doc_type": doc_type,
                    "doc_id": doc.get("id"),
                    "qty": item.get("qty", 0),
                    "price": item.get("price", 0),
                    "total": item.get("qty", 0) * item.get("price", 0),
                    "vendor": doc.get("vendor")
                })
                
        # Compare quantities and prices for the same product across different document types
        for prod, instances in item_index.items():
            if len(instances) < 2:
                continue
            
            # Compare every pair
            for i in range(len(instances)):
                for j in range(i + 1, len(instances)):
                    inst_a = instances[i]
                    inst_b = instances[j]
                    
                    if inst_a["doc_type"] == inst_b["doc_type"]:
                        continue # Only compare different doc types
                        
                    # Check qty mismatch
                    if inst_a["qty"] != inst_b["qty"]:
                        diff = abs(inst_a["qty"] - inst_b["qty"])
                        price_ref = max(inst_a["price"], inst_b["price"])
                        exposure = diff * price_ref
                        
                        alerts.append({
                            "field": "quantity",
                            "product": prod,
                            "doc_a_label": inst_a["doc_type"],
                            "doc_a_value": inst_a["qty"],
                            "doc_b_label": inst_b["doc_type"],
                            "doc_b_value": inst_b["qty"],
                            "difference": diff,
                            "risk_level": "HIGH",
                            "exposure": exposure,
                            "explanation": f"Indikasi Potensi Fraud: Ketidaksesuaian kuantitas {prod} antara {inst_a['doc_type']} ({inst_a['qty']}) dan {inst_b['doc_type']} ({inst_b['qty']})"
                        })
                    
                    # Check price mismatch
                    if inst_a["price"] != inst_b["price"]:
                        diff = abs(inst_a["price"] - inst_b["price"])
                        qty_ref = max(inst_a["qty"], inst_b["qty"])
                        exposure = diff * qty_ref
                        
                        alerts.append({
                            "field": "unit_price",
                            "product": prod,
                            "doc_a_label": inst_a["doc_type"],
                            "doc_a_value": inst_a["price"],
                            "doc_b_label": inst_b["doc_type"],
                            "doc_b_value": inst_b["price"],
                            "difference": diff,
                            "risk_level": "MEDIUM",
                            "exposure": exposure,
                            "explanation": f"Indikasi Potensi Fraud: Ketidaksesuaian harga satuan {prod} antara {inst_a['doc_type']} dan {inst_b['doc_type']}"
                        })
        
        return alerts
