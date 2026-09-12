import cv2
import numpy as np
import time
from typing import Dict, Any, Optional

def preprocess_image(img: np.ndarray) -> np.ndarray:
    # Convert to grayscale if it's RGB
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    else:
        gray = img
        
    # Denoise
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    
    # CLAHE contrast
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    contrast = clahe.apply(denoised)
    
    # Deskew via Hough transform (simplified deskew)
    edges = cv2.Canny(contrast, 50, 150, apertureSize=3)
    lines = cv2.HoughLines(edges, 1, np.pi/180, 200)
    
    if lines is not None:
        angles = []
        for line in lines:
            rho, theta = line[0]
            angles.append(theta)
        
        median_angle = np.median(angles)
        angle_deg = (median_angle * 180) / np.pi
        
        # Adjust angle to be between -45 and 45
        if angle_deg > 45 and angle_deg < 135:
            angle_deg -= 90
            
        (h, w) = contrast.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle_deg, 1.0)
        contrast = cv2.warpAffine(contrast, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
        
    return contrast

class OCRProvider:
    def ocr(self, image: np.ndarray) -> Dict[str, Any]:
        raise NotImplementedError

class PaddleOCRProvider(OCRProvider):
    _instance = None
    
    def __init__(self, lang='id'):
        if not hasattr(self, 'provider'):
            from paddleocr import PaddleOCR
            # Lazy singleton initialization
            self.provider = PaddleOCR(use_angle_cls=True, lang=lang, show_log=False)
            
    @classmethod
    def get_instance(cls, lang='id'):
        if cls._instance is None:
            cls._instance = cls(lang)
        return cls._instance

    def ocr(self, image: np.ndarray) -> Dict[str, Any]:
        start_time = time.time()
        try:
            result = self.provider.ocr(image, cls=True)
            text_parts = []
            blocks = []
            confidences = []
            
            # paddleocr returns a list of lists if multiple text regions
            if result and result[0]:
                for line in result[0]:
                    bbox = line[0]
                    text = line[1][0]
                    confidence = float(line[1][1])
                    
                    text_parts.append(text)
                    confidences.append(confidence)
                    blocks.append({
                        "text": text,
                        "confidence": confidence,
                        "bbox": bbox
                    })
                    
            full_text = "\n".join(text_parts)
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
            
            return {
                "provider": "paddleocr",
                "success": True,
                "text": full_text,
                "blocks": blocks,
                "avg_confidence": avg_confidence,
                "processing_time": time.time() - start_time
            }
        except Exception as e:
            return {
                "provider": "paddleocr",
                "success": False,
                "error": str(e),
                "processing_time": time.time() - start_time
            }

class UnavailableProvider(OCRProvider):
    def ocr(self, image: np.ndarray) -> Dict[str, Any]:
        return {
            "provider": "unavailable",
            "success": False,
            "error": "No OCR engine available",
            "text": "",
            "blocks": [],
            "avg_confidence": None,
            "processing_time": 0.0
        }

def get_ocr_provider(name: str, lang: str = 'id') -> OCRProvider:
    if name.lower() == 'paddleocr':
        try:
            return PaddleOCRProvider.get_instance(lang=lang)
        except ImportError:
            return UnavailableProvider()
    return UnavailableProvider()
