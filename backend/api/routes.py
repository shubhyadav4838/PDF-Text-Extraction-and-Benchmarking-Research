from fastapi import APIRouter, UploadFile, File
from services.pdf_extractor import process_pdf_document

router = APIRouter()

@router.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    print("file is uploaded and hit the /upload-pdf/ route")
    content = await file.read()
    result = process_pdf_document(content, file.filename)
    return {"message": "PDF uploaded successfully", "data": result}

@router.get("/")
async def root():
    return {"message": "PDF Extraction API"}
