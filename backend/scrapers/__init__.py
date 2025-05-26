from backend.scrapers.amazon import AmazonScraper
from backend.scrapers.flipkart import FlipkartScraper  # ✅ Import Flipkart scraper

def get_scraper(site_id: str):
    return {
        "amazon": AmazonScraper(),
        "flipkart": FlipkartScraper(),  # ✅ Add flipkart
    }.get(site_id)
