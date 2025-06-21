import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Upload, List, SlidersHorizontal } from "lucide-react";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-12">
          How PriceHunter Works
        </h1>

        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-xl text-gray-700 text-center mb-12">
            Finding the best deals across the web has never been easier. Follow
            these simple steps to start saving money on your online purchases.
          </p>

          <div className="space-y-8">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Search className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    1. Search for Products
                  </h3>
                  <p className="text-gray-600">
                    Enter the name of the product you're looking for in the
                    search bar.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <List className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    2. Select E-commerce Sites
                  </h3>
                  <p className="text-gray-600">
                    Choose between 3 to 5 e-commerce platforms you want to
                    compare prices from. We support all major online retailers
                    and many specialized stores.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-500">
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Upload className="h-6 w-6 text-indigo-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    3. Wait for Results
                  </h3>
                  <p className="text-gray-600">
                    Our system will scan the selected e-commerce platforms in
                    real-time and fetch the most current prices and product
                    information. This usually takes just a few seconds.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-700">
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <SlidersHorizontal className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    4. Compare and Sort Results
                  </h3>
                  <p className="text-gray-600">
                    View all matching products sorted by price, rating, or
                    popularity. Filter results based on your preferences and
                    find the best deal that meets your needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ready to Find the Best Deals?
          </h2>
          <p className="text-gray-600 mb-6">
            Start using PriceHunter today and never overpay for your online
            purchases again. Our service is completely free and doesn't require
            registration.
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Start Hunting Deals
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
