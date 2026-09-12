from typing import Dict, Any, List

class FraudRiskEngine:
    def __init__(self):
        self.default_weights = {
            "document_manipulation": 25,
            "price_anomaly": 25,
            "transaction_anomaly": 20,
            "cross_document": 15,
            "duplicate_invoice": 10,
            "vendor_risk": 5
        }

    def calculate_risk(self, scores: Dict[str, float], weights: Dict[str, float] = None) -> Dict[str, Any]:
        use_weights = weights if weights else self.default_weights
        
        total_weight = sum(use_weights.values())
        if total_weight == 0:
            total_weight = 1
            
        final_score = 0.0
        contributing_factors = []
        
        for category, weight in use_weights.items():
            score = scores.get(category, 0.0)
            weighted = (score * weight) / 100.0  # Assumes score is 0-100, so we normalize to max 100 based on weights
            final_score += weighted
            
            contributing_factors.append({
                "name": category,
                "score": score,
                "weight": weight,
                "weighted_score": weighted
            })
            
        # Normalize final score just in case total weights wasn't 100
        final_score = (final_score / total_weight) * 100
        
        if final_score >= 70:
            risk_level = "HIGH"
        elif final_score >= 40:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
            
        return {
            "final_score": final_score,
            "risk_level": risk_level,
            "contributing_factors": contributing_factors,
            "explanation": f"Indikasi Potensi Fraud: Skor risiko komposit {final_score:.1f} ({risk_level})"
        }
