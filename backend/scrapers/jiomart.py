from __future__ import annotations
from seleniumwire import webdriver  # must be seleniumwire
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from typing import List, Dict, Any
import random
import sys


class JioMartScraper:
    def __init__(self, pincode: str = "400020") -> None:
        self.pincode = pincode

        ua = (
            f"Mozilla/5.0 (Linux; Android 10; SM-{random.randint(100,999)}F) "
            f"AppleWebKit/537.36 (KHTML, like Gecko) "
            f"Chrome/{random.randint(118,136)}.0.0.0 Mobile Safari/537.36"
        )

        self._opts = Options()
        self._opts.add_argument("--lang=en-IN")
        self._opts.add_argument("--disable-blink-features=AutomationControlled")
        self._opts.add_argument("--disable-gpu")
        self._opts.add_argument("--no-sandbox")
        self._opts.add_argument("--disable-dev-shm-usage")
        self._opts.add_argument(f"--user-agent={ua}")
        self._opts.add_argument("--window-size=414,896")
        self._opts.add_argument("--headless=new")

        self._opts.add_experimental_option(
            "prefs",
            {
                "profile.default_content_setting_values": {
                    "images": 1,
                    "javascript": 1,
                    "popups": 2,
                    "notifications": 2,
                    "geolocation": 2
                }
            }
        )

    def search(self, query: str, hits: int = 40) -> List[Dict[str, Any]]:
        drv = webdriver.Chrome(options=self._opts)
        wait = WebDriverWait(drv, 20)

        try:
            drv.get("https://www.jiomart.com/")
            drv.add_cookie({"name": "custPincode", "value": self.pincode})
            drv.get(f"https://www.jiomart.com/search?q={query}")

            # Close modal if it appears
            try:
                wait.until(EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "button[data-testid='closeIcon']"))).click()
            except TimeoutException:
                pass

            container = wait.until(EC.presence_of_element_located(
                (By.CSS_SELECTOR, "ol.ais-InfiniteHits-list")))

            product_items = container.find_elements(
                By.CSS_SELECTOR, "li.ais-InfiniteHits-item")[:hits]

            return self._parse(product_items)

        except TimeoutException:
            return []

        finally:
            drv.quit()

    def _parse(self, product_items) -> List[Dict[str, Any]]:
        results = []

        for it in product_items:
            try:
                title = it.find_element(
                    By.CSS_SELECTOR, "div.plp-card-details-name"
                ).get_attribute("textContent").strip()

                price_el = it.find_element(
                    By.CSS_SELECTOR, "div.plp-card-details-price span"
                )
                price_text = price_el.get_attribute("textContent").strip()
                price = float(price_text.replace("₹", "").replace(",", "").strip())

                img = it.find_element(By.CSS_SELECTOR, "img").get_attribute("src")
                link = it.find_element(By.CSS_SELECTOR, "a").get_attribute("href")

                results.append({
                    "id": f"jiomart-{hash(title)}",
                    "name": title,
                    "price": price,
                    "rating": 0.0,
                    "reviews": 0,
                    "imageUrl": img,
                    "url": link,
                    "site": "jiomart",
                    "availability": "in-stock",
                })

            except Exception as err:
                print(f"[Parse Error] {err}", file=sys.stderr)
                continue

        return results