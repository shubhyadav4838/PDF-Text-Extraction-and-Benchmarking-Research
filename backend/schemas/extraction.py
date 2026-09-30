from pydantic import BaseModel
from typing import Optional, List, Literal

class PageMetrics(BaseModel):
    word_count: int
    image_coverage_pct: float
    ocr_confidence: Optional[float] = None

class PageResult(BaseModel):
    page_number: int
    routing_decision: Literal["NATIVE", "OCR"]
    metrics: PageMetrics
    extracted_text: str

class ExtractionDocumentMeta(BaseModel):
    filename: str
    total_pages: int
    pages_native: int
    pages_ocr: int
    total_latency_ms: float

class ExtractionResponse(BaseModel):
    document_meta: ExtractionDocumentMeta
    pages: List[PageResult]
