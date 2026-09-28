from pydantic import BaseModel
from typing import List, Dict, Any

class BenchmarkResponse(BaseModel):
    summary_metrics: List[Dict[str, Any]]
    text_comparison: List[Dict[str, Any]]
