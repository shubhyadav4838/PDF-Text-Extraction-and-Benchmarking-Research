from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz  # This is PyMuPDF

app = FastAPI()

# --- Prevent CORS Errors ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Your React/Vite local URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is running successfully!"}

@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    # 1. Read the uploaded PDF file into memory
    pdf_bytes = await file.read()
    
    # 2. Open it with PyMuPDF
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    
    # 3. Extract text from the first page just to test
    first_page_text = doc[0].get_text() if len(doc) > 0 else ""
    
    # 4. Return the data to React
    return {
        "filename": file.filename,
        "total_pages": len(doc),
        "first_page_preview": first_page_text[:200] # Return first 200 chars
    }