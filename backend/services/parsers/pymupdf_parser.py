import pymupdf as fitz
from typing import Dict, Any
from services.parsers.base import BaseParser
from core.config import settings

class PyMuPDFParser(BaseParser):
    engine_id = "pymupdf"
    engine_name = "PyMuPDF (fitz)"
    coordinate_origin = "top-left"

    def extract(self, file_bytes: bytes) -> Dict[str, Any]:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        
        full_text = []
        spatial_samples = []
        total_pages = len(doc)
        total_words = 0
        total_chars = 0
        font_supported = True
        
        for page_num, page in enumerate(doc):
            page_text = page.get_text("text", sort=True)
            if page_text:
                full_text.append(page_text)
                total_chars += len(page_text)
            
            words = page.get_text("words")
            total_words += len(words)
            
            if len(spatial_samples) < settings.BBOX_SAMPLE_LIMIT:
                blocks = page.get_text("dict", sort=True).get("blocks", [])
                for block in blocks:
                    if block.get("type") != 0: continue
                    for line in block.get("lines", []):
                        for span in line.get("spans", []):
                            text = span.get("text", "").strip()
                            if not text: continue
                            bbox = span.get("bbox") # [x0, y0, x1, y1]
                            spatial_samples.append({
                                "text": text,
                                "x0": bbox[0],
                                "top": bbox[1],
                                "x1": bbox[2],
                                "bottom": bbox[3],
                                "font": span.get("font"),
                                "size": span.get("size")
                            })
                            if len(spatial_samples) >= settings.BBOX_SAMPLE_LIMIT:
                                break
                        if len(spatial_samples) >= settings.BBOX_SAMPLE_LIMIT:
                            break
                    if len(spatial_samples) >= settings.BBOX_SAMPLE_LIMIT:
                        break
        
        doc.close()
        
        text_content = "\n".join(full_text)
        
        return {
            "text": text_content,
            "total_words": total_words,
            "total_characters": total_chars,
            "font_metadata_supported": font_supported,
            "spatial_samples": spatial_samples,
            "total_pages": total_pages
        }
