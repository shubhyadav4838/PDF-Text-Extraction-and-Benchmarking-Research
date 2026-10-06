from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router as api_router
from api.v1.routes_benchmark import router as benchmark_router
from api.v1.routes_extraction import router as extraction_router

app = FastAPI(title="PDF Extraction Backend")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://pdf-text-extraction-and-benchmarking-research.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Matches any Vercel preview branch deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router)
app.include_router(benchmark_router, prefix="/api/v1")
app.include_router(extraction_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
