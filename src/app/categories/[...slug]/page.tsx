"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft, Folder, FileText, ChevronRight, Home } from "lucide-react";

import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const category = categoryData?.data;
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
      <div className="min-h-screen bg-gray-50">
        <Header />
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
      </div>
    );
  }

  // Build breadcrumb navigation
  const buildBreadcrumbPath = (index: number) => {
    return `/categories/${slug.slice(0, index + 1).join("/")}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
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
                <ChevronRight className="h-4 w-4" />
                <Link
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
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={
              breadcrumb.length > 1
                ? buildBreadcrumbPath(breadcrumb.length - 2)
                : "/categories"
            }
          >
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to{" "}
              {breadcrumb.length > 1
                ? breadcrumb[breadcrumb.length - 2].name
                : "Categories"}
            </Button>
          </Link>
        </div>

        {/* Category Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex items-center space-x-3">
              {category.color ? (
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              ) : (
                <Folder className="h-8 w-8 text-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {category.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{category.subcategories?.length || 0} subcategories</span>
                <span>{pagination?.total || services.length} services</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subcategories Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Subcategories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {category.subcategories && category.subcategories.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No subcategories available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Services Section */}
          <div className="lg:col-span-2">
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
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {service.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {service.priceFormatted || `$${service.price}`}
                            </Badge>
                            {service.isFeatured && (
                              <Badge
                                variant="default"
                                className="text-xs bg-yellow-100 text-yellow-800"
                              >
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>
                              {service.durationFormatted ||
                                `${service.duration} min`}
                            </span>
                            {service.business &&
                              typeof service.business === "object" && (
                                <span>{service.business.name}</span>
                              )}
                            {service.category &&
                              typeof service.category === "object" && (
                                <span className="text-blue-600">
                                  {service.category.name}
                                </span>
                              )}
                          </div>
                          {service.requirements &&
                            service.requirements.length > 0 && (
                              <div className="mt-2 text-xs text-gray-500">
                                <span className="font-medium">
                                  Requirements:
                                </span>{" "}
                                {service.requirements[0]}
                                {service.requirements.length > 1 &&
                                  ` +${service.requirements.length - 1} more`}
                              </div>
                            )}
                        </div>
                        <Link href={`/services/${service._id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
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
