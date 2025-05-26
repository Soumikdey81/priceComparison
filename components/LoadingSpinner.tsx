import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface LoadingSpinnerProps {
  query: string;
  selectedSites: string[];
}

const LoadingSpinner = ({ query, selectedSites }: LoadingSpinnerProps) => {
  const [progress, setProgress] = useState(0);
  const [currentSite, setCurrentSite] = useState(0);

  const siteNames: Record<string, string> = {
    amazon: "Amazon",
    flipkart: "Flipkart",
    ebay: "eBay",
    walmart: "Walmart",
    bestbuy: "Best Buy",
    target: "Target",
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / selectedSites.length / 10;

        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Update current site being scraped
        const siteIndex = Math.floor(
          newProgress / (100 / selectedSites.length)
        );
        setCurrentSite(siteIndex);

        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [selectedSites.length]);

  // Helper to safely get site name
  const getSiteLabel = (siteId: string) => {
    const key = siteId.trim().toLowerCase();
    return siteNames[key] || siteId;
  };

  return (
    <Card className="p-8 backdrop-blur-sm bg-white/80 shadow-xl border-0">
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-spin">
            <div className="absolute inset-2 rounded-full bg-white"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-800">
            Searching for "{query}"
          </h3>
          <p className="text-gray-600">
            Scraping {selectedSites.length} e-commerce sites for the best
            deals...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-gray-500">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Current Site */}
        {currentSite < selectedSites.length && (
          <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700 font-medium">
              Currently scraping: {getSiteLabel(selectedSites[currentSite])}
            </span>
          </div>
        )}

        {/* Site List */}
        <div className="grid grid-cols-3 gap-2">
          {selectedSites.map((siteId, index) => {
            const label = getSiteLabel(siteId);
            return (
              <div
                key={siteId}
                className={`p-2 rounded text-sm transition-all ${
                  index < currentSite
                    ? "bg-green-100 text-green-700"
                    : index === currentSite
                    ? "bg-blue-100 text-blue-700 animate-pulse"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {index < currentSite && "✓ "}
                {index === currentSite && "⏳ "}
                {label}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default LoadingSpinner;
