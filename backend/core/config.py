import os

class Settings:
    PROJECT_NAME: str = "PDF Extraction API"
    API_V1_STR: str = "/api/v1"
    MAX_FILE_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB limit for PDF uploads
    BBOX_SAMPLE_LIMIT: int = 500  # Limit number of spatial layout samples to avoid huge payloads
    
settings = Settings()
