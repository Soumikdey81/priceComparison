from __future__ import annotations
from seleniumwire import webdriver  # must be seleniumwire, not selenium
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from dotenv import load_dotenv
from typing import List, Dict, Any
import os
import re

class FlipkartScraper:
    def __init__(self) -> None:
        load_dotenv()
        key = os.getenv("SCRAPERAPI_KEY")
        if not key:
            raise EnvironmentError("SCRAPERAPI_KEY missing")

        self._proxy = {
            "proxy": {
                "http": f"https://scraperapi:{key}@proxy-server.scraperapi.com:8001",
                "https": f"https://scraperapi:{key}@proxy-server.scraperapi.com:8001",
                "no_proxy": "localhost,127.0.0.1",
            },
            "connection_timeout": None,
            "verify_ssl": False,
        }

        self._opts = Options()
        self._opts.add_argument("--headless=new")
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
                    "javascript": 2,
                    "plugins": 2,
                    "popups": 2,
                    "notifications": 2,
                    "geolocation": 2,
                    "media_stream": 2,
                }
            },
        )

    def search(self, query: str) -> List[Dict[str, Any]]:
        drv = webdriver.Chrome(seleniumwire_options=self._proxy, options=self._opts)
        try:
            drv.get(f"https://www.flipkart.com/search?q={query}")

            # Wait for main container
            container = WebDriverWait(drv, 15).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div.DOjaWF.gdgoEp"))
            )[-1]

            product_containers = container.find_elements(By.CSS_SELECTOR, "div.cPHDOP")[1:-2]

            products = []
            for product_container in product_containers:
                products.extend(product_container.find_elements(By.CSS_SELECTOR, "div._75nlfW > div"))

            return self._parse(products[:10])

        finally:
            drv.quit()

    def search_image(self, image_keywords: str) -> List[Dict[str, Any]]:
        # Simulated image-based search using keywords
        return self.search(image_keywords)



    def _parse(self, product_cards) -> List[Dict[str, Any]]:
        results = []
        for item in product_cards:
            try:
                title = item.find_element(By.CSS_SELECTOR, "div.KzDlHZ").text
                link = item.find_element(By.CSS_SELECTOR, "a.CGtC98").get_attribute("href")
                img = item.find_element(By.CSS_SELECTOR, "img").get_attribute("src")

                try:
                    price_text = item.find_element(By.CSS_SELECTOR, "div.Nx9bqj").text
                    # Clean the price string and convert to float
                    price = float(re.sub(r"[^\d.]", "", price_text.replace(",", "")))
                except Exception:
                    price = 0.0  # Or use `None` if you prefer

                results.append({
                    "id": f"flipkart-{hash(title)}",
                    "name": title,
                    "price": price,
                    "rating": 0.0,
                    "reviews": 0,
                    "imageUrl": img,
                    "url": link,
                    "site": "flipkart",
                    "availability": "in-stock",
                })

            except Exception as e:
                print(f"[Parse Error] {e}")
                continue
        return results

