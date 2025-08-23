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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Eye,
  Shield,
  UserCheck,
  UserX,
  Calendar,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "service_provider" | "admin";
  isVerified: boolean;
  isActive: boolean;
  profilePicture?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  lastLogin?: string;
  business?: {
    _id: string;
    name: string;
    category: string;
  };
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
    verification: "all",
  });

  // Mock data for now - will be replaced with real API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        _id: "1",
        name: "Sarah Johnson",
        email: "sarah@beautyhaven.com",
        phone: "+1 (555) 123-4567",
        role: "service_provider",
        isVerified: true,
        isActive: true,
        profilePicture: "",
        address: {
          street: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
        },
        createdAt: "2024-01-15T10:00:00Z",
        lastLogin: "2024-01-25T14:30:00Z",
        business: {
          _id: "business1",
          name: "Beauty Haven Salon",
          category: "beauty",
        },
      },
      {
        _id: "2",
        name: "Dr. Robert Wilson",
        email: "dr.wilson@dentalcareplus.com",
        phone: "+1 (555) 987-6543",
        role: "service_provider",
        isVerified: true,
        isActive: true,
        profilePicture: "",
        address: {
          street: "456 Oak Avenue",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90210",
          country: "USA",
        },
        createdAt: "2024-01-10T14:30:00Z",
        lastLogin: "2024-01-25T16:45:00Z",
        business: {
          _id: "business2",
          name: "Dental Care Plus",
          category: "dental",
        },
      },
      {
        _id: "3",
        name: "Alex Thompson",
        email: "alex@fitnessfirst.com",
        phone: "+1 (555) 456-7890",
        role: "service_provider",
        isVerified: false,
        isActive: true,
        profilePicture: "",
        address: {
          street: "789 Fitness Street",
          city: "Chicago",
          state: "IL",
          zipCode: "60601",
          country: "USA",
        },
        createdAt: "2024-01-20T09:15:00Z",
        lastLogin: "2024-01-24T11:20:00Z",
        business: {
          _id: "business3",
          name: "Fitness First Gym",
          category: "fitness",
        },
      },
      {
        _id: "4",
        name: "Emily Davis",
        email: "emily.davis@email.com",
        phone: "+1 (555) 111-2222",
        role: "customer",
        isVerified: true,
        isActive: true,
        profilePicture: "",
        address: {
          street: "321 Customer Lane",
          city: "Miami",
          state: "FL",
          zipCode: "33101",
          country: "USA",
        },
        createdAt: "2024-01-05T12:00:00Z",
        lastLogin: "2024-01-25T10:15:00Z",
      },
      {
        _id: "5",
        name: "Michael Brown",
        email: "michael.brown@email.com",
        phone: "+1 (555) 333-4444",
        role: "customer",
        isVerified: true,
        isActive: true,
        profilePicture: "",
        address: {
          street: "654 User Street",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
          country: "USA",
        },
        createdAt: "2024-01-12T15:30:00Z",
        lastLogin: "2024-01-25T09:45:00Z",
      },
      {
        _id: "6",
        name: "Admin User",
        email: "admin@servicebooking.com",
        phone: "+1 (555) 999-8888",
        role: "admin",
        isVerified: true,
        isActive: true,
        profilePicture: "",
        address: {
          street: "999 Admin Boulevard",
          city: "San Francisco",
          state: "CA",
          zipCode: "94101",
          country: "USA",
        },
        createdAt: "2024-01-01T00:00:00Z",
        lastLogin: "2024-01-25T17:00:00Z",
      },
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  // Filter users based on current filters
  useEffect(() => {
    let filtered = users;

    if (filters.search) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          (user.phone && user.phone.includes(filters.search))
      );
    }

    if (filters.role !== "all") {
      filtered = filtered.filter((user) => user.role === filters.role);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((user) =>
        filters.status === "active" ? user.isActive : !user.isActive
      );
    }

    if (filters.verification !== "all") {
      filtered = filtered.filter((user) =>
        filters.verification === "verified" ? user.isVerified : !user.isVerified
      );
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      customer: "Customer",
      service_provider: "Service Provider",
      admin: "Administrator",
    };
    return roles[role] || role;
  };

  const getRoleBadge = (role: string) => {
    const badgeVariants: Record<
      string,
      "default" | "secondary" | "destructive"
    > = {
      customer: "default",
      service_provider: "secondary",
      admin: "destructive",
    };
    return (
      <Badge variant={badgeVariants[role] || "default"}>
        {getRoleLabel(role)}
      </Badge>
    );
  };

  const getStatusBadge = (user: User) => {
    if (!user.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    if (!user.isVerified) {
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          Pending Verification
        </Badge>
      );
    }
    return <Badge variant="default">Active & Verified</Badge>;
  };

  const viewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = {
    total: users.length,
    customers: users.filter((u) => u.role === "customer").length,
    serviceProviders: users.filter((u) => u.role === "service_provider").length,
    admins: users.filter((u) => u.role === "admin").length,
    verified: users.filter((u) => u.isVerified).length,
    pending: users.filter((u) => !u.isVerified).length,
    active: users.filter((u) => u.isActive).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users in the system
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.customers}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Providers
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.serviceProviders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administrators
            </CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.admins}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Users
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
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
            <UserX className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
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
          <CardDescription>Filter users by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Input
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            <Select
              value={filters.role}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
                <SelectItem value="service_provider">
                  Service Providers
                </SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
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

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>{filteredUsers.length} users found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profilePicture} alt={user.name} />
                    <AvatarFallback className="bg-gray-100 text-gray-600">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      {getRoleBadge(user.role)}
                      {user.phone && (
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined: {formatDate(user.createdAt)}
                      </span>
                      {user.business && (
                        <span className="text-xs text-muted-foreground">
                          Business: {user.business.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(user)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewUser(user)}
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

      {/* User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedUser.profilePicture}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-lg">
                    {getInitials(selectedUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser)}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-medium mb-2">Contact Information</h3>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedUser.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {selectedUser.address && (
                <div>
                  <h3 className="font-medium mb-2">Address</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedUser.address.street}, {selectedUser.address.city}
                      , {selectedUser.address.state}{" "}
                      {selectedUser.address.zipCode},{" "}
                      {selectedUser.address.country}
                    </span>
                  </div>
                </div>
              )}

              {/* Business Info */}
              {selectedUser.business && (
                <div>
                  <h3 className="font-medium mb-2">Business Information</h3>
                  <div className="grid gap-2 text-sm">
                    <p>
                      <span className="font-medium">Business Name:</span>{" "}
                      {selectedUser.business.name}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedUser.business.category}
                    </p>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div>
                <h3 className="font-medium mb-2">Account Information</h3>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">User ID:</span>{" "}
                    {selectedUser._id}
                  </p>
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(selectedUser.createdAt)}
                  </p>
                  {selectedUser.lastLogin && (
                    <p>
                      <span className="font-medium">Last Login:</span>{" "}
                      {formatDate(selectedUser.lastLogin)}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Role:</span>{" "}
                    {getRoleLabel(selectedUser.role)}
                  </p>
                  <p>
                    <span className="font-medium">Verified:</span>{" "}
                    {selectedUser.isVerified ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">Active:</span>{" "}
                    {selectedUser.isActive ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
