"use client";

import { useState } from "react";
import { Search, Filter, X, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  isLoading?: boolean;
}

interface FilterState {
  category: string;
  location: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  minRating: number;
  maxPrice?: number;
}

export function SearchFilters({
  onSearch,
  onFilterChange,
  categories,
  isLoading,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    location: "",
    sortBy: "rating",
    sortOrder: "desc",
    minRating: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | number
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "all",
      location: "",
      sortBy: "rating",
      sortOrder: "desc" as const,
      minRating: 0,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.location ||
    filters.sortBy !== "rating" ||
    filters.minRating > 0;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search businesses, services, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading}>
          Search
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {Object.values(filters).filter(Boolean).length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      {isLoading
                        ? "Loading categories..."
                        : "No categories available"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Location
              </label>
              <Input
                placeholder="Enter city or area..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            {/* Sort Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Sort by
              </label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="reviewCount">Most Reviewed</SelectItem>
                  <SelectItem value="createdAt">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Minimum Rating
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= filters.minRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {filters.minRating}+
                </span>
              </div>
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) =>
                  handleFilterChange("minRating", value[0])
                }
                max={5}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {filters.category !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {filters.category}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("category", "all")}
                  />
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Location: {filters.location}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("location", "")}
                  />
                </Badge>
              )}
              {filters.sortBy !== "rating" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort: {filters.sortBy}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("sortBy", "rating")}
                  />
                </Badge>
              )}
              {filters.minRating > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Rating: {filters.minRating}+
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleFilterChange("minRating", 0)}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
