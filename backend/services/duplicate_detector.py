from typing import List, Dict, Any
from difflib import SequenceMatcher

class DuplicateDetector:
    def find_duplicates(self, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        duplicates = []
        
        for i in range(len(documents)):
            for j in range(i + 1, len(documents)):
                doc_a = documents[i]
                doc_b = documents[j]
                
                match_fields = []
                
                # Check exact matches
                if doc_a.get("invoice_number") and doc_a.get("invoice_number") == doc_b.get("invoice_number"):
                    match_fields.append("invoice_number")
                if doc_a.get("amount") and doc_a.get("amount") == doc_b.get("amount"):
                    match_fields.append("amount")
                if doc_a.get("date") and doc_a.get("date") == doc_b.get("date"):
                    match_fields.append("date")
                if doc_a.get("vendor") and doc_a.get("vendor") == doc_b.get("vendor"):
                    match_fields.append("vendor")
                if doc_a.get("hash") and doc_a.get("hash") == doc_b.get("hash"):
                    match_fields.append("hash")
                    
                # Text similarity
                text_a = doc_a.get("ocr_text", "")
                text_b = doc_b.get("ocr_text", "")
                
                similarity = 0.0
                if text_a and text_b:
                    similarity = SequenceMatcher(None, text_a, text_b).ratio()
                    
                if similarity >= 0.95 or len(match_fields) >= 3:
                    risk_level = "HIGH"
                elif similarity >= 0.80 or len(match_fields) >= 2:
                    risk_level = "MEDIUM"
                else:
                    continue
                    
                duplicates.append({
                    "doc_a_id": doc_a.get("id"),
                    "doc_b_id": doc_b.get("id"),
                    "similarity_score": similarity,
                    "match_fields": match_fields,
                    "risk_level": risk_level,
                    "explanation": f"Indikasi Potensi Fraud: Kemungkinan duplikasi terdeteksi dengan kemiripan {similarity*100:.1f}% dan {len(match_fields)} field cocok."
                })
                
        return duplicates
