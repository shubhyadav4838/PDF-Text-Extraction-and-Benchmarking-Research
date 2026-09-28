from typing import Dict, Any
from abc import ABC, abstractmethod

class BaseParser(ABC):
    engine_id: str
    engine_name: str
    coordinate_origin: str

    @abstractmethod
    def extract(self, file_bytes: bytes) -> Dict[str, Any]:
        pass
