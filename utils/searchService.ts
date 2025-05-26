import { Product } from "@/types/product";
import { SearchType } from "@/types/search";

/* ------------------------------------------------------------------ */
/* 1 · helpers                                                        */
/* ------------------------------------------------------------------ */
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const buildSiteQuery = (sites: string[]) =>
  sites.map((s) => `sites=${encodeURIComponent(s)}`).join("&");

/* ------------------------------------------------------------------ */
/* 2 · mock generator                                                 */
/* ------------------------------------------------------------------ */
const generateMockProducts = (query: string, sites: string[]): Product[] => {
  const productNames = [
    `${query} - Premium Edition`,
    `${query} - Standard Model`,
    `${query} - Pro Version`,
    `${query} - Basic Edition`,
    `${query} - Deluxe Package`,
    `${query} - Enhanced Model`,
  ];

  const products: Product[] = [];

  sites.forEach((site, siteIndex) => {
    const numProducts = Math.floor(Math.random() * 3) + 2; // 2–4 per site

    for (let i = 0; i < numProducts; i++) {
      const basePrice = 50 + Math.random() * 500;
      const siteMultiplier: Record<string, number> = {
        amazon: 1.0,
        flipkart: 0.92,
        ebay: 0.85,
        walmart: 0.9,
        bestbuy: 1.1,
        target: 0.95,
      };

      products.push({
        id: `${site}-${i}-${Date.now()}`,
        name: productNames[Math.floor(Math.random() * productNames.length)],
        price: Math.round(basePrice * (siteMultiplier[site] ?? 1) * 100) / 100,
        rating: 3.5 + Math.random() * 1.5,
        reviews: Math.floor(Math.random() * 1000) + 50,
        imageUrl: `https://picsum.photos/400/400?random=${siteIndex * 10 + i}`,
        url: `https://${site}.com/product/${query
          .replace(/\s+/g, "-")
          .toLowerCase()}`,
        site,
        availability: Math.random() > 0.1 ? "in-stock" : "limited",
      });
    }
  });

  return products;
};

/* ------------------------------------------------------------------ */
/* 3 · main search function                                           */
/* ------------------------------------------------------------------ */
export const searchProducts = async (
  query: string,
  sites: string[],
  type: SearchType,
  file?: File
): Promise<Product[]> => {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    await new Promise((r) => setTimeout(r, 1500));
    return generateMockProducts(query, sites);
  }

  try {
    // image search
    if (type === "image" && file) {
      const form = new FormData();
      form.append("file", file);

      const url = `${API_BASE}/api/search/image?${buildSiteQuery(sites)}`;
      console.log("Image search fetch:", url);

      const res = await fetch(url, {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as Product[];
    }

    // text search
    const url = `${API_BASE}/api/search?q=${encodeURIComponent(
      query
    )}&${buildSiteQuery(sites)}`;
    console.log("Text search fetch:", url);

    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as Product[];
  } catch (err) {
    console.error("Search failed:", err);
    throw err;
  }
};
