import os
from .document_parser import extract_pdf_text, extract_pdf_metadata, rasterize_pdf, load_image
from .ocr_engine import get_ocr_provider, preprocess_image

def process_document(file_path: str, filename: str, ocr_provider_name: str = 'paddleocr', ocr_lang: str = 'id') -> dict:
    ext = os.path.splitext(filename)[1].lower()
    
    if ext == '.pdf':
        # 1. Try text-layer extraction
        text_result = extract_pdf_text(file_path)
        metadata = extract_pdf_metadata(file_path)
        
        # If text is substantial (>40 chars per page on average or total > 100), use text layer
        if text_result.get("success") and text_result.get("total_chars", 0) > 40:
            return {
                "status": "success",
                "method": "text_layer",
                "filename": filename,
                "metadata": metadata,
                "pages": text_result["pages"],
                "total_chars": text_result["total_chars"]
            }
        
        # 2. PDF without text layer -> Rasterize + preprocess + OCR
        images = rasterize_pdf(file_path)
        ocr_provider = get_ocr_provider(ocr_provider_name, lang=ocr_lang)
        
        pages = []
        total_chars = 0
        for i, img in enumerate(images):
            preprocessed = preprocess_image(img)
            ocr_res = ocr_provider.ocr(preprocessed)
            pages.append({
                "page": i + 1,
                "text": ocr_res.get("text", ""),
                "confidence": ocr_res.get("avg_confidence"),
                "blocks": ocr_res.get("blocks", [])
            })
            total_chars += len(ocr_res.get("text", ""))
            
        return {
            "status": "success",
            "method": "ocr",
            "filename": filename,
            "metadata": metadata,
            "pages": pages,
            "total_chars": total_chars
        }
        
    elif ext in ['.jpg', '.jpeg', '.png']:
        # 3. Image -> preprocess + OCR
        img = load_image(file_path)
        preprocessed = preprocess_image(img)
        ocr_provider = get_ocr_provider(ocr_provider_name, lang=ocr_lang)
        ocr_res = ocr_provider.ocr(preprocessed)
        
        return {
            "status": "success",
            "method": "ocr",
            "filename": filename,
            "pages": [{
                "page": 1,
                "text": ocr_res.get("text", ""),
                "confidence": ocr_res.get("avg_confidence"),
                "blocks": ocr_res.get("blocks", [])
            }],
            "total_chars": len(ocr_res.get("text", ""))
        }
        
    # 4. Other
    return {
        "status": "unsupported",
        "filename": filename,
        "error": "Unsupported file format for text extraction"
    }
