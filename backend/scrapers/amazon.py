from __future__ import annotations
from dotenv import load_dotenv
from seleniumwire import webdriver  # seleniumwire is required
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from typing import List, Dict, Any
import os, time, logging


class AmazonScraper:
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
            "--user-agent=Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) "
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

        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    # ------------------------------------- #
    def search(self, query: str) -> List[Dict[str, Any]]:
        drv = webdriver.Chrome(seleniumwire_options=self._proxy, options=self._opts)
        try:
            drv.get(f"https://www.amazon.in/s?k={query}")
            slot = WebDriverWait(drv, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.s-main-slot"))
            )

            cards = slot.find_elements(By.CSS_SELECTOR, ".s-result-item.s-asin")
            results = self._parse(cards[:10])

            self.logger.info(f"[AmazonScraper] Found {len(results)} products for query '{query}'")
            return results
        finally:
            drv.quit()

    # ------------------------------------- #
    def search_image(self, path: str) -> List[Dict[str, Any]]:
        drv = webdriver.Chrome(seleniumwire_options=self._proxy, options=self._opts)
        try:
            drv.get("https://www.amazon.in")
            wait = WebDriverWait(drv, 15)
            btn = self._find_cam(wait)
            btn.click()
            time.sleep(2)
            drv.find_element(By.CSS_SELECTOR, "input[type='file']").send_keys(path)
            slot = WebDriverWait(drv, 20).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div.s-main-slot"))
            )
            cards = slot.find_elements(By.CSS_SELECTOR, ".s-result-item.s-asin")
            return self._parse(cards[:10])
        finally:
            drv.quit()

    # ------------------------------------- #
    def _parse(self, elems) -> List[Dict[str, Any]]:
        out = []
        for el in elems:
            try:
                title = el.find_element(By.CSS_SELECTOR, "a h2 span").text
                link = el.find_element(By.CSS_SELECTOR, "a").get_attribute("href")
                img = el.find_element(By.CSS_SELECTOR, "img").get_attribute("src")

                try:
                    price_text = el.find_element(By.CSS_SELECTOR, ".a-price-whole").text
                    price = float(price_text.replace(",", ""))
                except Exception:
                    price = None

                out.append({
                    "id": f"amazon-{hash(title)}",
                    "name": title,
                    "price": price,
                    "rating": 0.0,
                    "reviews": 0,
                    "imageUrl": img,
                    "url": link,
                    "site": "amazon",
                    "availability": "in-stock",
                })
            except Exception:
                continue
        return out

    # ------------------------------------- #
    @staticmethod
    def _find_cam(wait):
        for sel in [
            "div#nav-search-submit-button + div[data-action='show-image-search'] button",
            "div#nav-search-scope button[data-action='show-image-search']",
        ]:
            try:
                return wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, sel)))
            except Exception:
                continue
        raise RuntimeError("Camera button not found")
