// app/page.tsx  (unchanged but shown for completeness)
"use client";

import { useState } from "react";
import ProductSearch from "@/components/ProductSearch";
import SiteSelector from "@/components/SiteSelector";
import ProductResults from "@/components/ProductResults";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SearchType } from "@/types/search";
import { Product } from "@/types/product";
import { searchProducts } from "@/utils/searchService";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query: string, type: SearchType, file?: File) => {
    if (selectedSites.length < 1) {
      alert("Please select at least 1 e-commerce site");
      return;
    }

    setIsLoading(true);
    setSearchQuery(query);

    try {
      // just a fake delay for demo UX
      await new Promise((r) => setTimeout(r, 3000));
      const results = await searchProducts(query, selectedSites, type, file);
      console.log("Search results:", results);
      setProducts(results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSiteToggle = (siteId: string) =>
    setSelectedSites((prev) =>
      prev.includes(siteId)
        ? prev.filter((id) => id !== siteId)
        : prev.length < 3
        ? [...prev, siteId]
        : prev
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-4">
              PriceHunter
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the best deals across multiple e-commerce platforms. Search
              by text or upload an image to compare prices instantly.
            </p>
          </div>

          {/* Interface */}
          <div className="max-w-4xl mx-auto space-y-8">
            <ProductSearch onSearch={handleSearch} isLoading={isLoading} />

            <SiteSelector
              selectedSites={selectedSites}
              onSiteToggle={handleSiteToggle}
            />

            {isLoading && (
              <LoadingSpinner
                query={searchQuery}
                selectedSites={selectedSites}
              />
            )}

            {!isLoading && products.length > 0 && (
              <ProductResults products={products} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
