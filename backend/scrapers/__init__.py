from backend.scrapers.amazon import AmazonScraper
from backend.scrapers.flipkart import FlipkartScraper
from backend.scrapers.jiomart import JioMartScraper 
from backend.scrapers.croma import CromaScraper 

def get_scraper(site_id: str):
    return {
        "amazon": AmazonScraper(),
        "flipkart": FlipkartScraper(), 
        "jiomart": JioMartScraper(),
        "croma": CromaScraper(),
    }.get(site_id)
