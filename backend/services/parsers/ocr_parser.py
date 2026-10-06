import pdf2image
import numpy as np
import cv2
import pytesseract
from typing import Dict, Any, Optional
from services.parsers.base import BaseParser

class OCRParser(BaseParser):
    engine_id = "ocr"
    engine_name = "Tesseract OCR"
    coordinate_origin = "top-left"

    def extract(self, file_bytes: bytes, page_num: Optional[int] = None) -> Dict[str, Any]:
        images = pdf2image.convert_from_bytes(
            file_bytes, 
            first_page=page_num, 
            last_page=page_num, 
            dpi=150
        )
        
        full_text = []
        spatial_samples = []
        total_words = 0
        total_chars = 0
        
        try:
            from core.config import settings
            limit = settings.BBOX_SAMPLE_LIMIT
        except (ImportError, AttributeError):
            limit = 500
            
        for pil_img in images:
            img_arr = np.array(pil_img)
            gray = cv2.cvtColor(img_arr, cv2.COLOR_RGB2GRAY)
            
            data = pytesseract.image_to_data(gray, output_type=pytesseract.Output.DICT)
            
            n_boxes = len(data['level'])
            page_text = []
            
            for i in range(n_boxes):
                text = str(data['text'][i]).strip()
                if not text:
                    continue
                    
                page_text.append(text)
                total_words += 1
                total_chars += len(text)
                
                if len(spatial_samples) < limit:
                    x0 = data['left'][i]
                    top = data['top'][i]
                    w = data['width'][i]
                    h = data['height'][i]
                    
                    spatial_samples.append({
                        "text": text,
                        "x0": x0,
                        "top": top,
                        "x1": x0 + w,
                        "bottom": top + h,
                        "font": None,
                        "size": None
                    })
            
            if page_text:
                full_text.append(" ".join(page_text))
                
        text_content = "\n".join(full_text)
        
        return {
            "text": text_content,
            "total_words": total_words,
            "total_characters": total_chars,
            "font_metadata_supported": False,
            "spatial_samples": spatial_samples,
            "total_pages": len(images) if page_num is None else 1
        }
