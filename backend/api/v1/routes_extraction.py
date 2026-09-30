from fastapi import APIRouter, UploadFile, File, HTTPException
from schemas.extraction import ExtractionResponse, ExtractionDocumentMeta, PageResult, PageMetrics
from services.hybrid_extractor_service import HybridExtractor
from core.config import settings

router = APIRouter()
hybrid_extractor = HybridExtractor()

@router.post("/extract", response_model=ExtractionResponse)
async def run_extraction(file: UploadFile = File(...)):
    # 1. Check file extension
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=415, detail="Invalid file extension")
        
    file_bytes = await file.read()
    
    # 2. Check magic bytes
    if not file_bytes.startswith(b"%PDF"):
        raise HTTPException(status_code=400, detail="Invalid PDF binary header")
        
    # 3. Check byte length
    if len(file_bytes) > settings.MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds limit")
        
    # Delegate to service
    result = hybrid_extractor.process_pdf(file_bytes)
    
    # Construct response
    doc_meta = ExtractionDocumentMeta(
        filename=file.filename,
        total_pages=result["total_pages"],
        pages_native=result["routing_stats"].get("NATIVE", 0),
        pages_ocr=result["routing_stats"].get("OCR", 0),
        total_latency_ms=result.get("total_latency_ms", 0.0)
    )
    
    return ExtractionResponse(
        document_meta=doc_meta,
        pages=result.get("pages", [])
    )
