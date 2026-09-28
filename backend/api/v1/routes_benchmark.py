from fastapi import APIRouter, UploadFile, File, HTTPException, status
from schemas.benchmark import BenchmarkResponse
from services.benchmark_service import BenchmarkService
from core.config import settings

router = APIRouter()
benchmark_service = BenchmarkService()

@router.post("/benchmark", response_model=BenchmarkResponse)
async def run_benchmark(file: UploadFile = File(...)):
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
    return benchmark_service.run_benchmark(file.filename, file_bytes)
