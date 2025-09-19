"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Scissors, Search, Filter } from "lucide-react";

import { ServiceCard } from "@/components/services/service-card";
import { servicesApi } from "@/lib/api/services";
import { serviceCategoriesApi } from "@/lib/api/service-categories";
import { Service } from "@/types/api";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    businessId: "",
    sortBy: "name",
    sortOrder: "asc" as const,
    minPrice: 0,
    maxPrice: 1000,
    showFilters: false,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch services with enhanced search
  const {
    data: servicesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["services", debouncedSearchQuery, filters],
    queryFn: () => {
      // Prepare API parameters, excluding "all" values
      let apiParams = {
        page: 1,
        limit: 20,
        ...filters,
      };

      // Remove "all" category to avoid backend casting errors
      if (apiParams.category === "all") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { category, ...rest } = apiParams;
        apiParams = rest as typeof apiParams;
      }

      // Remove empty businessId
      if (!apiParams.businessId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { businessId, ...rest } = apiParams;
        apiParams = rest as typeof apiParams;
      }

      if (debouncedSearchQuery.trim()) {
        return servicesApi.searchServices(debouncedSearchQuery.trim());
      }
      return servicesApi.getServices(apiParams);
    },
    enabled: true,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["service-categories"],
    queryFn: () => serviceCategoriesApi.getCategories(),
  });

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({
      category: "all",
      businessId: "",
      sortBy: "name",
      sortOrder: "asc",
      minPrice: 0,
      maxPrice: 1000,
      showFilters: false,
    });
  }, []);

  // The API response structure is: { success: true, data: { services: [...], pagination: {...} } }
  const services = servicesData?.data?.services || [];
  const categories =
    categoriesData?.data?.categories?.map((cat) => cat.name) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Scissors className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Browse Services
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Discover and book a wide range of professional services from trusted
            providers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  showFilters: !prev.showFilters,
                }))
              }
              className="px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Simple Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.category}
              onChange={(e) =>
                handleFilterChange({ ...filters, category: e.target.value })
              }
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Categories</option>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({ ...filters, sortBy: e.target.value })
              }
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {(debouncedSearchQuery || filters.category !== "all") && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">
                {debouncedSearchQuery
                  ? "Searching services..."
                  : "Loading services..."}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                Failed to load services. Please try again.
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
                {services.length}{" "}
                {services.length === 1 ? "service" : "services"} found
                {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
              </p>
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && !error && services.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service: Service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  showBusinessInfo={true}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && services.length === 0 && (
            <div className="text-center py-12">
              <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-600 mb-4">
                {debouncedSearchQuery
                  ? `No services match your search for "${debouncedSearchQuery}". Try adjusting your search terms or filters.`
                  : "No services are available. Try adjusting your filters."}
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
