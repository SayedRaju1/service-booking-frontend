"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Folder, FileText, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { serviceCategoriesApi } from "@/lib/api/service-categories";
import { ServiceCategory } from "@/types/api";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string[];

  // The last item in the slug array is the current category ID
  const currentCategoryId = slug[slug.length - 1];

  // Build breadcrumb path by fetching each category in the hierarchy
  const { data: breadcrumbData, isLoading: breadcrumbLoading } = useQuery({
    queryKey: ["category-breadcrumb", slug],
    queryFn: async () => {
      const breadcrumb: ServiceCategory[] = [];

      // Fetch each category in the hierarchy
      for (const categoryId of slug) {
        try {
          const response = await serviceCategoriesApi.getCategoryById(
            categoryId
          );
          if (response.data) {
            breadcrumb.push(response.data);
          }
        } catch (error) {
          console.error(`Failed to fetch category ${categoryId}:`, error);
        }
      }

      return breadcrumb;
    },
    enabled: slug.length > 0,
  });

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["category", currentCategoryId],
    queryFn: () => serviceCategoriesApi.getCategoryById(currentCategoryId),
    enabled: !!currentCategoryId,
  });

  const {
    data: categoryServicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["category-services", currentCategoryId],
    queryFn: () => serviceCategoriesApi.getCategoryServices(currentCategoryId),
    enabled: !!currentCategoryId,
  });

  // Get category from the services response since it includes the category data
  const category = categoryServicesData?.data?.category || categoryData?.data;
  const services = categoryServicesData?.data?.services || [];
  const pagination = categoryServicesData?.data?.pagination;
  const breadcrumb = breadcrumbData || [];

  if (categoryLoading || breadcrumbLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <span className="text-gray-600">Loading category...</span>
          </div>
        </div>
      </div>
    );
  }

  if (categoryError || servicesError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              Error loading category:{" "}
              {categoryError?.message || servicesError?.message}
            </div>
            <Link href="/categories">
              <Button>Back to Categories</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            Category not found. Please try again.
          </div>
          <Link href="/categories">
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Build breadcrumb navigation
  const buildBreadcrumbPath = (index: number) => {
    return `/categories/${slug.slice(0, index + 1).join("/")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Breadcrumb Navigation */}
        {/* <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="flex items-center hover:text-blue-600">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/categories" className="hover:text-blue-600">
              Categories
            </Link>
            {breadcrumb.map((cat, index) => (
              <div key={cat._id} className="flex items-center">
                <ChevronRight key={`chevron-${cat._id}`} className="h-4 w-4" />
                <Link
                  key={`link-${cat._id}`}
                  href={buildBreadcrumbPath(index)}
                  className={`ml-2 hover:text-blue-600 ${
                    index === breadcrumb.length - 1
                      ? "text-gray-900 font-medium"
                      : ""
                  }`}
                >
                  {cat.name}
                </Link>
              </div>
            ))}
          </nav>
        </div> */}

        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link
            href={
              breadcrumb.length > 1
                ? buildBreadcrumbPath(breadcrumb.length - 2)
                : "/categories"
            }
          >
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to{" "}
              {breadcrumb.length > 1
                ? breadcrumb[breadcrumb.length - 2].name
                : "Categories"}
            </Button>
          </Link>
        </div>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {category.name}
          </h1>
        </div>

        <div
          className={`grid grid-cols-1 ${
            category.subcategories && category.subcategories.length > 0
              ? "lg:grid-cols-3"
              : "lg:grid-cols-1"
          } gap-8`}
        >
          {/* Subcategories Section - Only show if there are subcategories */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    Subcategories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.subcategories.map(
                      (subcategory: ServiceCategory) => (
                        <Link
                          key={subcategory._id}
                          href={`/categories/${slug.join("/")}/${
                            subcategory._id
                          }`}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            {subcategory.color ? (
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: subcategory.color }}
                              />
                            ) : (
                              <FileText className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="font-medium text-gray-900">
                              {subcategory.name}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </Link>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Services Section */}
          <div
            className={
              category.subcategories && category.subcategories.length > 0
                ? "lg:col-span-2"
                : "lg:col-span-1"
            }
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Services ({pagination?.total || services.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {servicesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <span className="text-gray-600">Loading services...</span>
                  </div>
                ) : services.length > 0 ? (
                  <div className="space-y-3">
                    {services.map((service) => (
                      <div
                        key={service._id}
                        className="bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-200"
                      >
                        {/* Header with title and price */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-base leading-tight">
                              {service.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                            <Badge
                              variant="secondary"
                              className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1"
                            >
                              {service.priceFormatted || `$${service.price}`}
                            </Badge>
                            {service.isFeatured && (
                              <Badge
                                variant="default"
                                className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 font-medium"
                              >
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {service.description}
                        </p>

                        {/* Service details - stacked on mobile */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium">Duration:</span>
                            <span>
                              {service.durationFormatted ||
                                `${service.duration} min`}
                            </span>
                          </div>

                          {service.business &&
                            typeof service.business === "object" && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="font-medium">Clinic:</span>
                                <span className="text-blue-600 font-medium">
                                  {service.business.name}
                                </span>
                              </div>
                            )}

                          {service.category &&
                            typeof service.category === "object" && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="font-medium">Type:</span>
                                <span className="text-blue-600 font-medium">
                                  {service.category.name}
                                </span>
                              </div>
                            )}
                        </div>

                        {/* Requirements and button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          {service.requirements &&
                            service.requirements.length > 0 && (
                              <div className="text-xs text-gray-500 flex-1">
                                <span className="font-medium">
                                  Requirements:
                                </span>{" "}
                                <span className="leading-relaxed">
                                  {service.requirements[0]}
                                  {service.requirements.length > 1 &&
                                    ` +${service.requirements.length - 1} more`}
                                </span>
                              </div>
                            )}

                          <Link
                            href={`/services/${service._id}`}
                            className="flex-shrink-0"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full sm:w-auto text-xs font-medium"
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">
                      No services available in this category
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
