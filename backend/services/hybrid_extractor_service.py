import pymupdf as fitz
from typing import Dict, Any
import time
from services.routing.page_detector import PageDetector
from services.parsers.ocr_parser import OCRParser

class HybridExtractor:
    def process_pdf(self, file_bytes: bytes) -> Dict[str, Any]:
        start_time = time.time()
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        total_pages = len(doc)
        
        full_text = []
        spatial_samples = []
        total_words = 0
        total_chars = 0
        pages_data = []
        
        routing_stats = {"NATIVE": 0, "OCR": 0}
        ocr_parser = OCRParser()
        
        try:
            from core.config import settings
            limit = settings.BBOX_SAMPLE_LIMIT
        except (ImportError, AttributeError):
            limit = 500
        
        for page_num, page in enumerate(doc):
            route = PageDetector.classify(page)
            routing_stats[route] += 1
            
            # Extract metrics for the response payload
            page_word_count = PageDetector.get_word_count(page)
            image_coverage_pct = PageDetector.get_image_coverage(page) * 100.0
            page_extracted_text = ""
            
            if route == "NATIVE":
                page_text = page.get_text("text", sort=True)
                if page_text:
                    full_text.append(page_text)
                    page_extracted_text = page_text
                    total_chars += len(page_text)
                    
                words = page.get_text("words")
                total_words += len(words)
                
                if len(spatial_samples) < limit:
                    blocks = page.get_text("dict", sort=True).get("blocks", [])
                    for block in blocks:
                        if block.get("type") != 0: continue
                        for line in block.get("lines", []):
                            for span in line.get("spans", []):
                                text = span.get("text", "").strip()
                                if not text: continue
                                bbox = span.get("bbox")
                                spatial_samples.append({
                                    "text": text,
                                    "x0": bbox[0],
                                    "top": bbox[1],
                                    "x1": bbox[2],
                                    "bottom": bbox[3],
                                    "font": span.get("font"),
                                    "size": span.get("size")
                                })
                                if len(spatial_samples) >= limit: break
                            if len(spatial_samples) >= limit: break
                        if len(spatial_samples) >= limit: break

            else:
                # OCR Route: pass 1-indexed page number to pdf2image
                ocr_result = ocr_parser.extract(file_bytes, page_num=page_num + 1)
                if ocr_result.get("text"):
                    full_text.append(ocr_result["text"])
                    page_extracted_text = ocr_result["text"]
                    
                total_chars += ocr_result.get("total_characters", 0)
                total_words += ocr_result.get("total_words", 0)
                
                space_left = limit - len(spatial_samples)
                if space_left > 0:
                    spatial_samples.extend(ocr_result.get("spatial_samples", [])[:space_left])

            # Append per-page data for API response mapping
            pages_data.append({
                "page_number": page_num + 1,
                "routing_decision": route,
                "metrics": {
                    "word_count": page_word_count,
                    "image_coverage_pct": image_coverage_pct,
                    "ocr_confidence": None
                },
                "extracted_text": page_extracted_text
            })
                
        doc.close()
        
        text_content = "\n".join(full_text)
        
        return {
            "text": text_content,
            "total_words": total_words,
            "total_characters": total_chars,
            "font_metadata_supported": routing_stats["NATIVE"] > 0,
            "spatial_samples": spatial_samples,
            "total_pages": total_pages,
            "routing_stats": routing_stats,
            "pages": pages_data,
            "total_latency_ms": (time.time() - start_time) * 1000.0
        }
