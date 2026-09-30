import pymupdf as fitz

class PageDetector:
    @staticmethod
    def get_word_count(page: fitz.Page) -> int:
        return len(page.get_text("words"))

    @staticmethod
    def get_image_coverage(page: fitz.Page) -> float:
        page_area = page.rect.width * page.rect.height
        if page_area <= 0:
            return 0.0
            
        images_area = 0.0
        for img in page.get_image_info():
            bbox = img.get("bbox")
            if bbox:
                rect = fitz.Rect(bbox)
                images_area += rect.get_area()
                
        return min(1.0, images_area / page_area)

    @staticmethod
    def check_corruption(page: fitz.Page) -> bool:
        text = page.get_text("text")
        if "\ufffd" in text or "\u0000" in text:
            return True
        return False

    @staticmethod
    def classify(page: fitz.Page) -> str:
        if PageDetector.check_corruption(page):
            return "OCR"
            
        word_count = PageDetector.get_word_count(page)
        image_coverage = PageDetector.get_image_coverage(page)
        
        if word_count > 15 and image_coverage < 0.8:
            return "NATIVE"
            
        return "OCR"
