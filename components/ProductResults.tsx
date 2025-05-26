import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/product";
import { ArrowUp, ArrowDown } from "lucide-react";

interface ProductResultsProps {
  products: any[]; // raw scraped items (not yet typed)
}

type SortOption = "price-asc" | "price-desc" | "rating-desc" | "site";

/** 🔍 Detect the e‑commerce site from a URL */
const detectSite = (url: string | undefined): string => {
  if (!url) return "unknown";
  const host = (() => {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  })();
  if (host.includes("amazon")) return "amazon";
  if (host.includes("ebay")) return "ebay";
  if (host.includes("walmart")) return "walmart";
  if (host.includes("bestbuy")) return "bestbuy";
  if (host.includes("target")) return "target";
  return "unknown";
};

/** 🔧 Map whatever fields the scraper gives us to our internal Product shape */
const normalise = (raw: any): Product => {
  const url = raw.url || raw.link || "#";
  return {
    id: raw.id || url || raw.title,
    name: raw.name || raw.title || "Unknown Product",
    price:
      typeof raw.price === "string"
        ? Number(raw.price.replace(/[^\d.]/g, ""))
        : raw.price,
    rating: raw.rating || 0,
    reviews: raw.reviews || 0,
    site: raw.site || raw.source || detectSite(url),
    imageUrl: raw.imageUrl || raw.img || "/placeholder.jpg",
    url,
    availability: "in-stock",
  } as Product;
};

const ProductResults = ({ products }: ProductResultsProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [filteredSite, setFilteredSite] = useState<string>("all");

  const items = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    return products.map(normalise);
  }, [products]);

  const sortFn = (a: Product, b: Product) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating-desc":
        return b.rating - a.rating;
      case "site":
        return a.site.localeCompare(b.site);
      default:
        return 0;
    }
  };

  const sorted = useMemo(() => [...items].sort(sortFn), [items, sortBy]);
  const filtered = useMemo(
    () =>
      filteredSite === "all"
        ? sorted
        : sorted.filter((p) => p.site === filteredSite),
    [sorted, filteredSite]
  );
  const uniqueSites = useMemo(
    () => [...new Set(items.map((p) => p.site))],
    [items]
  );

  const formatSiteName = (site?: string) =>
    site && site !== "unknown"
      ? site.charAt(0).toUpperCase() + site.slice(1)
      : "Unknown";

  const badgeStyle = (site?: string) => {
    const styles: Record<string, string> = {
      amazon: "bg-orange-100 text-orange-700 border-orange-200",
      ebay: "bg-blue-100 text-blue-700 border-blue-200",
      walmart: "bg-blue-100 text-blue-700 border-blue-200",
      bestbuy: "bg-yellow-100 text-yellow-700 border-yellow-200",
      target: "bg-red-100 text-red-700 border-red-200",
    };
    return styles[site ?? ""] ?? "bg-gray-100 text-gray-700 border-gray-200";
  };

  const badgeEmoji = (site?: string) => {
    const map: Record<string, string> = {
      amazon: "🛒",
      ebay: "🏪",
      walmart: "🏬",
      bestbuy: "💻",
      target: "🎯",
    };
    return map[site ?? ""] ?? "📦";
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-xl border-0">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Found {filtered.length} products
            </h2>
            <p className="text-gray-600">
              Showing results from {uniqueSites.length} e-commerce site
              {uniqueSites.length === 1 ? "" : "s"}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">
                  <ArrowUp size={16} /> Price: Low to High
                </SelectItem>
                <SelectItem value="price-desc">
                  <ArrowDown size={16} /> Price: High to Low
                </SelectItem>
                <SelectItem value="rating-desc">
                  ⭐ Rating: High to Low
                </SelectItem>
                <SelectItem value="site">🏪 Site Name</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filteredSite} onValueChange={setFilteredSite}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {uniqueSites.map((site) => (
                  <SelectItem key={site} value={site}>
                    {badgeEmoji(site)} {formatSiteName(site)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <Card
              key={p.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-contain p-6"
                />
                <div
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border ${badgeStyle(
                    p.site
                  )}`}
                >
                  {badgeEmoji(p.site)} {formatSiteName(p.site)}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                  {p.rating > 0 && (
                    <span className="text-sm text-gray-600">
                      ⭐ {p.rating.toFixed(1)} ({p.reviews})
                    </span>
                  )}
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={() => window.open(p.url, "_blank")}
                >
                  View on {formatSiteName(p.site)}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search for a different product.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductResults;
