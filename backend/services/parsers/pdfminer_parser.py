import io
from typing import Dict, Any
from services.parsers.base import BaseParser
from core.config import settings

from pdfminer.high_level import extract_text, extract_pages
from pdfminer.layout import LTTextContainer, LTChar, LTTextLine, LAParams

class PDFMinerParser(BaseParser):
    engine_id = "pdfminer"
    engine_name = "pdfminer.six"
    coordinate_origin = "bottom-left"

    def extract(self, file_bytes: bytes) -> Dict[str, Any]:
        # Extract plain text
        laparams = LAParams()
        text_content = extract_text(io.BytesIO(file_bytes), laparams=laparams)
        total_chars = len(text_content)
        total_words = len(text_content.split())
        
        spatial_samples = []
        total_pages = 0
        
        # Extract layout for bbox and font
        for page_layout in extract_pages(io.BytesIO(file_bytes), laparams=laparams):
            total_pages += 1
            if len(spatial_samples) >= settings.BBOX_SAMPLE_LIMIT:
                continue
                
            for element in page_layout:
                if isinstance(element, LTTextContainer):
                    for text_line in element:
                        if isinstance(text_line, LTTextLine):
                            text_val = text_line.get_text().strip()
                            if not text_val: continue
                            
                            font_name = None
                            font_size = None
                            for char in text_line:
                                if isinstance(char, LTChar):
                                    font_name = char.fontname
                                    font_size = char.size
                                    break
                            
                            bbox = text_line.bbox
                            
                            spatial_samples.append({
                                "text": text_val,
                                "x0": bbox[0],
                                "top": bbox[1], 
                                "x1": bbox[2],
                                "bottom": bbox[3],
                                "font": font_name,
                                "size": font_size
                            })
                            
                            if len(spatial_samples) >= settings.BBOX_SAMPLE_LIMIT:
                                break
                    if len(spatial_samples) >= settings.BBOX_SAMPLE_LIMIT:
                        break
        
        return {
            "text": text_content,
            "total_words": total_words,
            "total_characters": total_chars,
            "font_metadata_supported": True,
            "spatial_samples": spatial_samples,
            "total_pages": total_pages
        }
