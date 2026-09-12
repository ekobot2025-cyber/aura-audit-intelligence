def calculate_price_anomaly(
    transaction_price: float,
    reference_price: float,
    regional_multiplier: float = 1.0,
    high_threshold: float = 30.0,
    medium_threshold: float = 10.0,
    underprice_threshold: float = -25.0
) -> dict:
    adjusted_reference = reference_price * regional_multiplier
    difference = transaction_price - adjusted_reference
    
    if adjusted_reference == 0:
        deviation_percent = 0.0
    else:
        deviation_percent = (difference / adjusted_reference) * 100.0
        
    is_anomaly = False
    risk_level = "LOW"
    explanation = "Harga wajar"
    
    if deviation_percent > high_threshold:
        is_anomaly = True
        risk_level = "HIGH"
        explanation = f"Indikasi Potensi Fraud: Harga lebih tinggi {deviation_percent:.1f}% dari referensi"
    elif deviation_percent > medium_threshold:
        is_anomaly = True
        risk_level = "MEDIUM"
        explanation = f"Indikasi Potensi Fraud: Harga lebih tinggi {deviation_percent:.1f}% dari referensi"
    elif deviation_percent < underprice_threshold:
        is_anomaly = True
        risk_level = "MEDIUM"
        explanation = f"Indikasi Potensi Fraud: Harga terlalu rendah ({deviation_percent:.1f}%), periksa kualitas atau spesifikasi"
        
    return {
        "transaction_price": transaction_price,
        "reference_price": reference_price,
        "adjusted_reference_price": adjusted_reference,
        "difference": difference,
        "deviation_percent": deviation_percent,
        "risk_level": risk_level,
        "is_anomaly": is_anomaly,
        "explanation": explanation
    }
