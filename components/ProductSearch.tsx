"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { SearchType } from "@/types/search";
import { Upload, Search, Image } from "lucide-react";

interface Props {
  isLoading: boolean;
  onSearch: (query: string, type: SearchType, file?: File) => void;
}

const ProductSearch = ({ isLoading, onSearch }: Props) => {
  const [searchType, setSearchType] = useState<SearchType>("text");
  const [textQuery, setTextQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // User not logged in, redirect to login page
      router.push("/login");
      return;
    }

    if (searchType === "text" && textQuery.trim()) {
      onSearch(textQuery.trim(), "text");
    } else if (searchType === "image" && selectedFile) {
      onSearch("", "image", selectedFile);
    }
  };

  return (
    <Card className="p-8 backdrop-blur-sm bg-white/80 shadow-xl border-0">
      <div className="space-y-6">
        {/* Toggle */}
        <div className="flex justify-center">
          {/* Removed toggle buttons for simplicity */}
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
            Search for a product
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {searchType === "text" ? (
            <>
              <div className="relative">
                <Input
                  id="search"
                  value={textQuery}
                  onChange={(e) => setTextQuery(e.target.value)}
                  placeholder="e.g., iPhone 15 Pro, Samsung Galaxy S24…"
                  className="h-12 pr-12 text-lg"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <Search
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </>
          ) : (
            <>
              <label className="text-sm font-medium text-gray-700">
                Upload product image
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : selectedFile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/"))
                    setSelectedFile(file);
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type.startsWith("image/"))
                      setSelectedFile(file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <Image className="text-green-600" size={32} />
                    </div>
                    <p className="text-green-700 font-medium">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-green-600">
                      Image ready for search
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                      <Upload className="text-gray-500" size={32} />
                    </div>
                    <p className="text-gray-700">
                      Drop an image here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports JPG, PNG, GIF up to 10 MB
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={
              isLoading ||
              (searchType === "text" && !textQuery.trim()) ||
              (searchType === "image" && !selectedFile)
            }
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? "Searching…" : "Search Products"}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ProductSearch;
