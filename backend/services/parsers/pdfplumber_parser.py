import pdfplumber
import io
from typing import Dict, Any
from services.parsers.base import BaseParser
from core.config import settings

class PDFPlumberParser(BaseParser):
    engine_id = "pdfplumber"
    engine_name = "pdfplumber"
    coordinate_origin = "top-left"
    
    def extract(self, file_bytes: bytes) -> Dict[str, Any]:
        text_full = []
        total_words = 0
        total_chars = 0
        spatial_samples = []
        
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            total_pages = len(pdf.pages)
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    text_full.append(text)
                    total_chars += len(text)
                    total_words += len(text.split())
                
                if len(spatial_samples) < settings.BBOX_SAMPLE_LIMIT:
                    for char in page.chars:
                        spatial_samples.append({
                            "text": char.get("text", ""),
                            "x0": char.get("x0", 0),
                            "top": char.get("top", 0),
                            "x1": char.get("x1", 0),
                            "bottom": char.get("bottom", 0),
                            "font": char.get("fontname"),
                            "size": char.get("size")
                        })
                        if len(spatial_samples) >= settings.BBOX_SAMPLE_LIMIT:
                            break
                            
            return {
                "text": "\n".join(text_full),
                "total_words": total_words,
                "total_characters": total_chars,
                "font_metadata_supported": True,
                "spatial_samples": spatial_samples,
                "total_pages": total_pages
            }
