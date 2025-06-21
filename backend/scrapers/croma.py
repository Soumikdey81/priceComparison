from __future__ import annotations
from seleniumwire import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from dotenv import load_dotenv
from typing import List, Dict, Any
import os
import re
import time


class BaseScraper:
    def __init__(self) -> None:
        # Load environment variables from .env file
        load_dotenv()
        key = os.getenv("SCRAPERAPI_KEY")
        if not key:
            raise EnvironmentError("SCRAPERAPI_KEY missing")

        # Selenium Wire proxy and options config
        self._seleniumwire_options = {
            "proxy": {
                "http": f"https://scraperapi:{key}@proxy-server.scraperapi.com:8001",
                "https": f"https://scraperapi:{key}@proxy-server.scraperapi.com:8001",
                "no_proxy": "localhost,127.0.0.1",
            },
            "connection_timeout": None,
            "verify_ssl": False,
            "request_storage_base_dir": "/tmp/seleniumwire",
            "exclude_hosts": [
                "fonts.googleapis.com",
                "fonts.gstatic.com",
                "google-analytics.com",
                "googletagmanager.com",
                "googleadservices.com",
                "doubleclick.net",
            ],
        }

        # Chrome options for Selenium
        self._opts = Options()
        self._opts.add_argument("--headless=new")  # Use new headless mode
        self._opts.add_argument("--lang=en-IN")
        self._opts.add_argument("--disable-blink-features=AutomationControlled")
        self._opts.add_argument("--disable-gpu")
        self._opts.add_argument("--no-sandbox")
        self._opts.add_argument("--disable-dev-shm-usage")
        self._opts.add_argument(
            "--user-agent=Mozilla/5.0 (Linux; Android 6.0; Nexus 5) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36"
        )
        self._opts.add_experimental_option(
            "prefs",
            {
                "profile.default_content_setting_values": {
                    "images": 1,
                    "javascript": 1,
                    "plugins": 2,
                    "popups": 2,
                    "notifications": 2,
                    "geolocation": 2,
                    "media_stream": 2,
                }
            },
        )

    def _start_driver(self) -> webdriver.Chrome:
        # Start Selenium Wire Chrome driver with proxy and options
        driver = webdriver.Chrome(
            seleniumwire_options=self._seleniumwire_options,
            options=self._opts
        )

        # Override headers to mimic a real browser more closely
        driver.header_overrides = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/114.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
            # You can add more headers here if needed
        }

        return driver


class CromaScraper(BaseScraper):
    def search(self, query: str) -> List[Dict[str, Any]]:
        driver = self._start_driver()
        try:
            driver.get(f"https://www.croma.com/searchB?q={query}")

            try:
                WebDriverWait(driver, 20).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "li.product-item"))
                )
            except TimeoutException:
                print(f"[Croma] No results found for query: {query}")
                return []

            products = driver.find_elements(By.CSS_SELECTOR, "li.product-item")
            results = self._parse(products[:10])  # Limit to first 10 results

            # Add delay to throttle requests
            time.sleep(10)

            return results

        finally:
            driver.quit()

    def search_image(self, image_keywords: str) -> List[Dict[str, Any]]:
        # Image search simply delegates to text search
        return self.search(image_keywords)

    def _parse(self, product_cards) -> List[Dict[str, Any]]:
        results = []
        for item in product_cards:
            try:
                title = item.find_element(By.CSS_SELECTOR, "h3.product-title").text
                link = item.find_element(By.CSS_SELECTOR, "a.product-title").get_attribute("href")
                img = item.find_element(By.CSS_SELECTOR, "img").get_attribute("src")

                try:
                    price_text = item.find_element(By.CSS_SELECTOR, "span.new-price").text
                    # Remove commas and non-digit characters except dot for float conversion
                    price = float(re.sub(r"[^\d.]", "", price_text.replace(",", "")))
                except Exception:
                    price = 0.0

                results.append({
                    "id": f"croma-{hash(title)}",
                    "name": title,
                    "price": price,
                    "rating": 0.0,  # No rating data available
                    "reviews": 0,   # No reviews data available
                    "imageUrl": img,
                    "url": link,
                    "site": "croma",
                    "availability": "in-stock",  # Assumed in stock
                })

            except Exception as e:
                print(f"[Croma Parse Error] {e}")
                continue
        return results
