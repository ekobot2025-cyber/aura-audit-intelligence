import fitz  # PyMuPDF
import pdfplumber
import numpy as np
from PIL import Image
import os
import io

def extract_pdf_metadata(pdf_path: str) -> dict:
    try:
        doc = fitz.open(pdf_path)
        metadata = doc.metadata
        return {
            "author": metadata.get("author"),
            "creator": metadata.get("creator"),
            "producer": metadata.get("producer"),
            "creation_date": metadata.get("creationDate"),
            "modification_date": metadata.get("modDate"),
            "page_count": len(doc)
        }
    except Exception as e:
        return {"error": str(e)}

def extract_pdf_text(pdf_path: str) -> dict:
    success = False
    pages = []
    total_chars = 0
    
    try:
        # Try PyMuPDF first
        doc = fitz.open(pdf_path)
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            pages.append({
                "page": page_num + 1,
                "text": text,
                "confidence": None  # Never fabricate confidence values for text-layer extraction
            })
            total_chars += len(text)
        
        success = True
        
        # Fallback to pdfplumber if < 40 chars extracted
        if total_chars < 40:
            pages = []
            total_chars = 0
            with pdfplumber.open(pdf_path) as plumber_doc:
                for page_num, page in enumerate(plumber_doc.pages):
                    text = page.extract_text() or ""
                    pages.append({
                        "page": page_num + 1,
                        "text": text,
                        "confidence": None
                    })
                    total_chars += len(text)
    except Exception as e:
        success = False
        return {"success": success, "error": str(e)}
        
    return {
        "success": success,
        "pages": pages,
        "total_chars": total_chars
    }

def rasterize_pdf(pdf_path: str, dpi: int = 220) -> list:
    images = []
    try:
        doc = fitz.open(pdf_path)
        zoom = dpi / 72.0
        mat = fitz.Matrix(zoom, zoom)
        for page_num in range(len(doc)):
            page = doc[page_num]
            pix = page.get_pixmap(matrix=mat)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            images.append(np.array(img))
    except Exception as e:
        pass
    return images

def load_image(path: str) -> np.ndarray:
    img = Image.open(path).convert("RGB")
    return np.array(img)
