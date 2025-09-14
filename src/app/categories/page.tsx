"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, Folder } from "lucide-react";

import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceCategoriesApi } from "@/lib/api/service-categories";
import { ServiceCategory } from "@/types/api";

export default function CategoriesPage() {
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => serviceCategoriesApi.getCategories(),
  });

  const categories = categoriesData?.data?.categories || [];
  const topLevelCategories = categories.filter(
    (category: ServiceCategory) => !category.parentCategory
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <span className="text-gray-600">Loading categories...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover services organized by categories. Find exactly what you
            need from our comprehensive service categories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topLevelCategories.map((category: ServiceCategory) => (
            <Card
              key={category._id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <Link href={`/categories/${category._id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Category Color Indicator or Icon */}
                      {category.color ? (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                      ) : (
                        <Folder className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{category.description}</p>

                  {/* Subcategories Preview */}
                  {category.subcategories &&
                    category.subcategories.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">
                          Subcategories ({category.subcategories.length}):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories
                            .slice(0, 3)
                            .map((subcategory: ServiceCategory) => (
                              <span
                                key={subcategory._id}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                {subcategory.name}
                              </span>
                            ))}
                          {category.subcategories.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {topLevelCategories.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories available
            </h3>
            <p className="text-gray-600">
              Categories will appear here once they are added to the system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
