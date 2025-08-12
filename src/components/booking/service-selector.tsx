"use client";

import { useState } from "react";
import { Service } from "@/types/api";
import { formatDuration } from "@/lib/utils/date-time";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, DollarSign, Info } from "lucide-react";

interface ServiceSelectorProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
  selectedService?: Service | null;
  isLoading?: boolean;
}

export function ServiceSelector({
  services,
  onServiceSelect,
  selectedService,
  isLoading = false,
}: ServiceSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories from services
  const categories = [
    "all",
    ...Array.from(
      new Set(
        services.map((s) =>
          typeof s.category === "string" ? s.category : s.category.name
        )
      )
    ),
  ];

  // Filter services based on search and category
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (typeof service.category === "string"
        ? service.category
        : service.category.name) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      salon: "bg-pink-100 text-pink-800",
      dental: "bg-blue-100 text-blue-800",
      beauty: "bg-purple-100 text-purple-800",
      spa: "bg-green-100 text-green-800",
      consulting: "bg-orange-100 text-orange-800",
      fitness: "bg-red-100 text-red-800",
      medical: "bg-indigo-100 text-indigo-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select a Service
        </h2>
        <p className="text-gray-600">
          Choose from our available services to get started with your booking
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? "All Services" : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No services found
          </h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or category filter"
              : "No services are currently available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isSelected = selectedService?._id === service._id;
            const categoryName =
              typeof service.category === "string"
                ? service.category
                : service.category.name;

            return (
              <Card
                key={service._id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : "hover:border-gray-300"
                }`}
                onClick={() => onServiceSelect(service)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 line-clamp-2">
                        {service.name}
                      </CardTitle>
                      <Badge
                        className={`${getCategoryColor(categoryName)} text-xs`}
                      >
                        {categoryName}
                      </Badge>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="font-semibold text-green-600">
                        ${service.price}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4"
                    variant={isSelected ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onServiceSelect(service);
                    }}
                  >
                    {isSelected ? "Selected" : "Select Service"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Results Summary */}
      {filteredServices.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {filteredServices.length} of {services.length} services
        </div>
      )}
    </div>
  );
}
