from fastapi import FastAPI, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from backend.scrapers import get_scraper
from backend.models.product import Product
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # use your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/search", response_model=List[Product])
async def text_search(q: str = Query(...), sites: List[str] = Query(...)):
    all_results = []
    for site in sites:
        scraper = get_scraper(site)
        if scraper:
            results = scraper.search(q)
            print(f"[API] {site} returned {len(results)} results")
            all_results.extend(results)
    return all_results


@app.post("/api/search/image", response_model=List[Product])
async def image_search(file: UploadFile = File(...), sites: List[str] = Query(...)):
    tmp_path = f"/tmp/{file.filename}"
    with open(tmp_path, "wb") as f:
        f.write(await file.read())

    all_results = []
    for site in sites:
        scraper = get_scraper(site)
        if scraper and hasattr(scraper, "search_image"):
            all_results.extend(scraper.search_image(tmp_path))
    os.remove(tmp_path)
    return all_results

