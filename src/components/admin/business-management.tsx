"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react";

interface Business {
  _id: string;
  name: string;
  description: string;
  category: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  services: Array<{
    _id: string;
    name: string;
    price: number;
  }>;
  staff: Array<{
    _id: string;
    name: string;
    role: string;
  }>;
}

export function BusinessManagement() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
    verification: "all",
  });

  // Mock data for now - will be replaced with real API calls
  useEffect(() => {
    const mockBusinesses: Business[] = [
      {
        _id: "1",
        name: "Beauty Haven Salon",
        description:
          "Premium beauty salon offering hair, makeup, and spa services",
        category: "beauty",
        address: {
          street: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        contact: {
          phone: "+1 (555) 123-4567",
          email: "info@beautyhaven.com",
          website: "https://beautyhaven.com",
        },
        isVerified: true,
        isActive: true,
        createdAt: "2024-01-15T10:00:00Z",
        owner: {
          _id: "user1",
          name: "Sarah Johnson",
          email: "sarah@beautyhaven.com",
        },
        services: [
          { _id: "s1", name: "Hair Cut & Style", price: 75 },
          { _id: "s2", name: "Facial Treatment", price: 120 },
          { _id: "s3", name: "Manicure", price: 45 },
        ],
        staff: [
          { _id: "staff1", name: "Sarah Johnson", role: "Owner" },
          { _id: "staff2", name: "Emily Davis", role: "Stylist" },
          { _id: "staff3", name: "Michael Brown", role: "Esthetician" },
        ],
      },
      {
        _id: "2",
        name: "Dental Care Plus",
        description: "Comprehensive dental care and orthodontic services",
        category: "dental",
        address: {
          street: "456 Oak Avenue",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "USA",
        },
        contact: {
          phone: "+1 (555) 987-6543",
          email: "contact@dentalcareplus.com",
          website: "https://dentalcareplus.com",
        },
        isVerified: true,
        isActive: true,
        createdAt: "2024-01-10T14:30:00Z",
        owner: {
          _id: "user2",
          name: "Dr. Robert Wilson",
          email: "dr.wilson@dentalcareplus.com",
        },
        services: [
          { _id: "s4", name: "Dental Cleaning", price: 150 },
          { _id: "s5", name: "Cavity Filling", price: 200 },
          { _id: "s6", name: "Teeth Whitening", price: 300 },
        ],
        staff: [
          { _id: "staff4", name: "Dr. Robert Wilson", role: "Dentist" },
          { _id: "staff5", name: "Dr. Lisa Chen", role: "Orthodontist" },
          { _id: "staff6", name: "Maria Garcia", role: "Dental Hygienist" },
        ],
      },
      {
        _id: "3",
        name: "Fitness First Gym",
        description:
          "Modern fitness center with personal training and group classes",
        category: "fitness",
        address: {
          street: "789 Fitness Street",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA",
        },
        contact: {
          phone: "+1 (555) 456-7890",
          email: "info@fitnessfirst.com",
          website: "https://fitnessfirst.com",
        },
        isVerified: false,
        isActive: true,
        createdAt: "2024-01-20T09:15:00Z",
        owner: {
          _id: "user3",
          name: "Alex Thompson",
          email: "alex@fitnessfirst.com",
        },
        services: [
          { _id: "s7", name: "Personal Training", price: 80 },
          { _id: "s8", name: "Group Classes", price: 25 },
          { _id: "s9", name: "Nutrition Consultation", price: 100 },
        ],
        staff: [
          { _id: "staff7", name: "Alex Thompson", role: "Owner" },
          { _id: "staff8", name: "Jake Miller", role: "Personal Trainer" },
          { _id: "staff9", name: "Rachel Green", role: "Nutritionist" },
        ],
      },
    ];

    setBusinesses(mockBusinesses);
    setFilteredBusinesses(mockBusinesses);
  }, []);

  // Filter businesses based on current filters
  useEffect(() => {
    let filtered = businesses;

    if (filters.search) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          business.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          business.owner.name
            .toLowerCase()
            .includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== "all") {
      filtered = filtered.filter(
        (business) => business.category === filters.category
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((business) =>
        filters.status === "active" ? business.isActive : !business.isActive
      );
    }

    if (filters.verification !== "all") {
      filtered = filtered.filter((business) =>
        filters.verification === "verified"
          ? business.isVerified
          : !business.isVerified
      );
    }

    setFilteredBusinesses(filtered);
  }, [businesses, filters]);

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      beauty: "Beauty & Wellness",
      dental: "Dental Care",
      fitness: "Fitness & Sports",
      spa: "Spa & Relaxation",
      consulting: "Consulting",
      medical: "Medical",
      other: "Other",
    };
    return categories[category] || category;
  };

  const getStatusBadge = (business: Business) => {
    if (!business.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (!business.isVerified) {
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Pending Verification
        </Badge>
      );
    }
    return <Badge variant="default">Active & Verified</Badge>;
  };

  const viewBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setIsViewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = {
    total: businesses.length,
    verified: businesses.filter((b) => b.isVerified).length,
    pending: businesses.filter((b) => !b.isVerified).length,
    active: businesses.filter((b) => b.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Business Management
          </h1>
          <p className="text-muted-foreground">
            Manage all registered businesses in the system
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Businesses
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.verified}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter businesses by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Input
                placeholder="Search businesses..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                <SelectItem value="dental">Dental Care</SelectItem>
                <SelectItem value="fitness">Fitness & Sports</SelectItem>
                <SelectItem value="spa">Spa & Relaxation</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.verification}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, verification: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Businesses List */}
      <Card>
        <CardHeader>
          <CardTitle>All Businesses</CardTitle>
          <CardDescription>
            {filteredBusinesses.length} businesses found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBusinesses.map((business) => (
              <div
                key={business._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{business.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {business.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {getCategoryLabel(business.category)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Owner: {business.owner.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Joined: {formatDate(business.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(business)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewBusiness(business)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedBusiness?.name}</DialogTitle>
            <DialogDescription>
              Business details and information
            </DialogDescription>
          </DialogHeader>

          {selectedBusiness && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="font-medium mb-2">Basic Information</h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedBusiness.description}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {getCategoryLabel(selectedBusiness.category)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {getStatusBadge(selectedBusiness)}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(selectedBusiness.createdAt)}
                  </p>
                </div>
              </div>

              {/* Owner Info */}
              <div>
                <h3 className="font-medium mb-2">Owner Information</h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedBusiness.owner.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedBusiness.owner.email}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-medium mb-2">Address</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedBusiness.address.street},{" "}
                    {selectedBusiness.address.city},{" "}
                    {selectedBusiness.address.state}{" "}
                    {selectedBusiness.address.zipCode},{" "}
                    {selectedBusiness.address.country}
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-medium mb-2">Contact Information</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedBusiness.contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedBusiness.contact.email}</span>
                  </div>
                  {selectedBusiness.contact.website && (
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={selectedBusiness.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedBusiness.contact.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="font-medium mb-2">
                  Services ({selectedBusiness.services.length})
                </h3>
                <div className="grid gap-2">
                  {selectedBusiness.services.map((service) => (
                    <div
                      key={service._id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">{service.name}</span>
                      <span className="text-sm font-medium">
                        ${service.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff */}
              <div>
                <h3 className="font-medium mb-2">
                  Staff ({selectedBusiness.staff.length})
                </h3>
                <div className="grid gap-2">
                  {selectedBusiness.staff.map((member) => (
                    <div
                      key={member._id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">{member.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
