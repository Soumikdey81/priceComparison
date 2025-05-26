// components/SiteSelector.tsx
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Site {
  id: string;
  name: string;
  logo: string;
  color: string;
}

interface Props {
  selectedSites: string[];
  onSiteToggle: (siteId: string) => void;
}

const sites: Site[] = [
  {
    id: "amazon",
    name: "Amazon",
    logo: "🛒",
    color: "from-orange-500 to-yellow-500",
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logo: "📦",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "myntra",
    name: "Myntra",
    logo: "👗",
    color: "from-pink-500 to-red-500",
  },
  {
    id: "ajio",
    name: "Ajio",
    logo: "🧥",
    color: "from-gray-700 to-blue-500",
  },
  {
    id: "nykaa",
    name: "Nykaa",
    logo: "💄",
    color: "from-pink-600 to-purple-500",
  },
  {
    id: "meesho",
    name: "Meesho",
    logo: "🎁",
    color: "from-fuchsia-500 to-pink-500",
  },
];

const SiteSelector = ({ selectedSites, onSiteToggle }: Props) => (
  <Card className="p-6 backdrop-blur-sm bg-white/80 shadow-xl border-0">
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Select E-commerce Sites
        </h3>
        <p className="text-sm text-gray-600">
          Choose 1-3 sites to compare prices ({selectedSites.length}/3 selected)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {sites.map((site) => {
          const isSelected = selectedSites.includes(site.id);
          const isDisabled = !isSelected && selectedSites.length >= 3;

          return (
            <div
              key={site.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : isDisabled
                  ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => !isDisabled && onSiteToggle(site.id)}
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={isSelected}
                  disabled={isDisabled}
                  className="pointer-events-none"
                />
                <span className="text-2xl">{site.logo}</span>
                <span className="font-medium text-gray-800">{site.name}</span>
              </div>

              {isSelected && (
                <div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-r ${site.color} opacity-10 pointer-events-none`}
                />
              )}
            </div>
          );
        })}
      </div>

      {selectedSites.length < 1 && (
        <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-amber-700 text-sm">
            ⚠️ Please select at least 1 site to start comparing prices
          </p>
        </div>
      )}
    </div>
  </Card>
);

export default SiteSelector;
