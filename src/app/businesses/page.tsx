"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Building2 } from "lucide-react";

import { BusinessCard } from "@/components/business/business-card";
import { SearchFilters } from "@/components/business/search-filters";
import { businessApi } from "@/lib/api/business";
import { serviceCategoriesApi } from "@/lib/api/service-categories";
import { Business } from "@/types/api";

export default function BusinessesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    sortBy: "rating",
    sortOrder: "desc" as "asc" | "desc",
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch businesses with enhanced search
  const {
    data: businessesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["businesses", debouncedSearchQuery, filters],
    queryFn: () => {
      if (debouncedSearchQuery.trim()) {
        return businessApi.searchBusinesses(debouncedSearchQuery.trim());
      }
      return businessApi.getBusinesses({
        page: 1,
        limit: 20,
        ...filters,
      });
    },
    enabled: true,
  });

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => serviceCategoriesApi.getCategories(),
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: {
      category: string;
      location: string;
      sortBy: string;
      sortOrder: "asc" | "desc";
    }) => {
      // Convert "all" category to empty string for API
      const apiFilters = {
        ...newFilters,
        category: newFilters.category === "all" ? "" : newFilters.category,
      };
      setFilters(apiFilters);
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({
      category: "",
      location: "",
      sortBy: "rating",
      sortOrder: "desc",
    });
  }, []);

  // The API response structure is: { success: true, data: { businesses: [...], pagination: {...} } }
  const businesses = businessesData?.data?.businesses || [];
  const categories =
    categoriesData?.data?.categories?.map((cat) => cat.name) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Find Services</h1>
          </div>
          <p className="text-lg text-gray-600">
            Discover and book appointments with the best service providers in
            your area.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            categories={categories}
            isLoading={isLoading || categoriesLoading}
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                {debouncedSearchQuery
                  ? "Searching businesses..."
                  : "Loading businesses..."}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                Failed to load businesses. Please try again.
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Results Count */}
          {!isLoading && !error && (
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {businesses.length}{" "}
                {businesses.length === 1 ? "business" : "businesses"} found
                {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
              </p>
              {(debouncedSearchQuery ||
                filters.category ||
                filters.location) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Business Grid */}
          {!isLoading && !error && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business: Business) => (
                <BusinessCard key={business._id} business={business} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && businesses.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No businesses found
              </h3>
              <p className="text-gray-600 mb-4">
                {debouncedSearchQuery
                  ? `No businesses match your search for "${debouncedSearchQuery}". Try adjusting your search terms or filters.`
                  : "No businesses are available in this area. Try adjusting your filters or location."}
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
