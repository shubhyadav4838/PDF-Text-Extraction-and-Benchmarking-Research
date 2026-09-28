import time
from typing import Dict, Any, List
from schemas.benchmark import BenchmarkResponse
from services.parsers.pymupdf_parser import PyMuPDFParser
from services.parsers.pdfplumber_parser import PDFPlumberParser
from services.parsers.pdfminer_parser import PDFMinerParser

class BenchmarkService:
    def __init__(self):
        self.parsers = [
            PyMuPDFParser(),
            PDFPlumberParser(),
            PDFMinerParser()
        ]

    def run_benchmark(self, filename: str, file_bytes: bytes) -> BenchmarkResponse:
        summary_metrics = []
        text_comparison = []

        for parser in self.parsers:
            start_time = time.time()
            try:
                result = parser.extract(file_bytes)
                latency = (time.time() - start_time) * 1000  # ms
                
                summary_metrics.append({
                    "engine_id": parser.engine_id,
                    "engine_name": parser.engine_name,
                    "latency_ms": latency,
                    "total_words": result.get("total_words", 0),
                    "total_characters": result.get("total_characters", 0),
                    "status": "success"
                })
                
                text_comparison.append({
                    "engine_id": parser.engine_name,
                    "extracted_text": result.get("text", "")[:5000] # truncate for comparison view
                })
            except Exception as e:
                latency = (time.time() - start_time) * 1000
                summary_metrics.append({
                    "engine_id": parser.engine_id,
                    "engine_name": parser.engine_name,
                    "latency_ms": latency,
                    "total_words": 0,
                    "total_characters": 0,
                    "status": "error"
                })
                text_comparison.append({
                    "engine_id": parser.engine_name,
                    "extracted_text": f"Error: {str(e)}"
                })

        return BenchmarkResponse(
            summary_metrics=summary_metrics,
            text_comparison=text_comparison
        )
