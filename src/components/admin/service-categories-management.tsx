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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ServiceCategory {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentCategory?: string;
  sortOrder: number;
  isActive: boolean;
  subcategories?: ServiceCategory[];
}

interface CreateCategoryData {
  name: string;
  description: string;
  icon: string;
  color: string;
  parentCategory?: string;
  sortOrder: number;
}

export function ServiceCategoriesManagement() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    parentCategory: "",
    sortOrder: 0,
  });

  // Mock data for now - will be replaced with real API calls
  useEffect(() => {
    const mockCategories: ServiceCategory[] = [
      {
        _id: "1",
        name: "Beauty & Wellness",
        description: "Beauty treatments and wellness services",
        icon: "spa",
        color: "#EC4899",
        sortOrder: 1,
        isActive: true,
        subcategories: [
          {
            _id: "1-1",
            name: "Hair Styling",
            description: "Hair cutting, styling, and treatments",
            icon: "scissors",
            color: "#F59E0B",
            sortOrder: 1,
            isActive: true,
          },
          {
            _id: "1-2",
            name: "Facial Treatments",
            description: "Skincare and facial services",
            icon: "face",
            color: "#10B981",
            sortOrder: 2,
            isActive: true,
          },
        ],
      },
      {
        _id: "2",
        name: "Health & Medical",
        description: "Medical and healthcare services",
        icon: "heart",
        color: "#EF4444",
        sortOrder: 2,
        isActive: true,
        subcategories: [
          {
            _id: "2-1",
            name: "Dental Care",
            description: "Dental services and treatments",
            icon: "tooth",
            color: "#8B5CF6",
            sortOrder: 1,
            isActive: true,
          },
        ],
      },
      {
        _id: "3",
        name: "Fitness & Sports",
        description: "Fitness training and sports services",
        icon: "dumbbell",
        color: "#06B6D4",
        sortOrder: 3,
        isActive: true,
      },
    ];

    setCategories(mockCategories);
  }, []);

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await serviceCategoriesApi.createCategory(formData);

      // Mock success
      const newCategory: ServiceCategory = {
        _id: Date.now().toString(),
        ...formData,
        isActive: true,
      };

      setCategories((prev) => [...prev, newCategory]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success("Category created successfully");
    } catch {
      toast.error("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await serviceCategoriesApi.updateCategory(selectedCategory._id, formData);

      // Mock success
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === selectedCategory._id ? { ...cat, ...formData } : cat
        )
      );

      setIsEditDialogOpen(false);
      resetForm();
      toast.success("Category updated successfully");
    } catch {
      toast.error("Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      // await serviceCategoriesApi.deleteCategory(selectedCategory._id);

      // Mock success
      setCategories((prev) =>
        prev.filter((cat) => cat._id !== selectedCategory._id)
      );
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      toast.success("Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      color: "#3B82F6",
      parentCategory: "",
      sortOrder: 0,
    });
  };

  const openEditDialog = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      parentCategory: category.parentCategory || "",
      sortOrder: category.sortOrder,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const getParentCategoryName = (parentId: string) => {
    const parent = categories.find((cat) => cat._id === parentId);
    return parent ? parent.name : "None";
  };

  const renderCategory = (category: ServiceCategory, level: number = 0) => (
    <div key={category._id} className="space-y-3">
      <div
        className={`flex items-center justify-between p-4 border rounded-lg ${
          level > 0 ? "ml-6 bg-gray-50" : "bg-white"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <div>
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
            {category.parentCategory && (
              <p className="text-xs text-muted-foreground">
                Parent: {getParentCategoryName(category.parentCategory)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={category.isActive ? "default" : "secondary"}>
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openEditDialog(category)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDeleteDialog(category)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {category.subcategories && category.subcategories.length > 0 && (
        <div className="ml-4">
          {category.subcategories.map((subcat) =>
            renderCategory(subcat, level + 1)
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Service Categories
          </h1>
          <p className="text-muted-foreground">
            Manage service categories and subcategories
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Add a new service category to the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="col-span-3"
                  placeholder="Category name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="col-span-3"
                  placeholder="Category description"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icon
                </Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  className="col-span-3"
                  placeholder="Icon identifier"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                  className="col-span-3 h-10"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="parentCategory" className="text-right">
                  Parent
                </Label>
                <Select
                  value={formData.parentCategory}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, parentCategory: value }))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No parent category</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sortOrder" className="text-right">
                  Sort Order
                </Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sortOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="col-span-3"
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateCategory} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            {categories.length} categories found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => renderCategory(category))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-icon" className="text-right">
                Icon
              </Label>
              <Input
                id="edit-icon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, icon: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-color" className="text-right">
                Color
              </Label>
              <Input
                id="edit-color"
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, color: e.target.value }))
                }
                className="col-span-3 h-10"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-parentCategory" className="text-right">
                Parent
              </Label>
              <Select
                value={formData.parentCategory}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, parentCategory: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No parent category</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-sortOrder" className="text-right">
                Sort Order
              </Label>
              <Input
                id="edit-sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sortOrder: parseInt(e.target.value) || 0,
                  }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedCategory?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
