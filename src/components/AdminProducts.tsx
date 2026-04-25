import { useState, type ChangeEvent, type FormEvent } from "react";
import { categories } from "../data/products";
import type { Product } from "../types";
import { supabase } from "../lib/supabase";
import { AdminOrders } from "./AdminOrders";
import { getDiscountedPrice, hasDiscount } from "../utils/pricing";

interface AdminProductsProps {
  products: Product[];
  onAdd: (product: Product) => Promise<void> | void;
  onUpdate: (product: Product) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onSignOut: () => Promise<void> | void;
}

type AdminTab = "products" | "orders";

const initialFormState = {
  name: "",
  description: "",
  details: "",
  price: "0",
  discountPercent: "0",
  unit: "each",
  category: "fruits",
  image: "",
  image2: "",
  image3: "",
  badge: "",
  rating: "4.5",
  reviews: "0",
  inStock: true,
};

export function AdminProducts({
  products,
  onAdd,
  onUpdate,
  onDelete,
  onSignOut,
}: AdminProductsProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<{
    file1: File | null;
    file2: File | null;
    file3: File | null;
  }>({ file1: null, file2: null, file3: null });
  const [uploading, setUploading] = useState(false);

  const categoryOptions = categories.filter((category) => category.id !== "all");

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setError("");
    setSelectedFiles({ file1: null, file2: null, file3: null });
    setUploading(false);
  };

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    imageNumber: 1 | 2 | 3,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileKey = `file${imageNumber}` as keyof typeof selectedFiles;
    const imageKey = `image${imageNumber === 1 ? "" : imageNumber}` as const;

    setSelectedFiles((current) => ({
      ...current,
      [fileKey]: file,
    }));
    setForm((current) => ({
      ...current,
      [imageKey]: "",
    }));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.price.trim() || !form.category.trim()) {
      setError("Please complete the product name, category, and price.");
      return;
    }

    const discountPercent = Math.min(
      100,
      Math.max(0, Number(form.discountPercent) || 0),
    );

    let imageUrl = form.image;
    let imageUrl2 = form.image2;
    let imageUrl3 = form.image3;

    if (selectedFiles.file1) {
      const uploadedUrl = await uploadImage(selectedFiles.file1);
      if (!uploadedUrl) {
        setError("Failed to upload image 1. Please try again.");
        return;
      }
      imageUrl = uploadedUrl;
    }

    if (selectedFiles.file2) {
      const uploadedUrl = await uploadImage(selectedFiles.file2);
      if (!uploadedUrl) {
        setError("Failed to upload image 2. Please try again.");
        return;
      }
      imageUrl2 = uploadedUrl;
    }

    if (selectedFiles.file3) {
      const uploadedUrl = await uploadImage(selectedFiles.file3);
      if (!uploadedUrl) {
        setError("Failed to upload image 3. Please try again.");
        return;
      }
      imageUrl3 = uploadedUrl;
    }

    const product: Product = {
      id: editingId ?? Math.floor(Math.random() * 1000000).toString(),
      name: form.name.trim(),
      description: form.description.trim(),
      details: form.details.trim() || form.description.trim(),
      price: Number(form.price),
      discountPercent,
      unit: form.unit.trim() || "each",
      category: form.category as Product["category"],
      image:
        imageUrl ||
        "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600",
      image2: imageUrl2 || undefined,
      image3: imageUrl3 || undefined,
      badge: form.badge.trim() || undefined,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      inStock: form.inStock,
    };

    if (editingId) {
      await onUpdate(product);
    } else {
      await onAdd(product);
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setActiveTab("products");
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      details: product.details || "",
      price: String(product.price),
      discountPercent: String(product.discountPercent ?? 0),
      unit: product.unit,
      category: product.category,
      image: product.image,
      image2: product.image2 || "",
      image3: product.image3 || "",
      badge: product.badge || "",
      rating: String(product.rating),
      reviews: String(product.reviews),
      inStock: product.inStock,
    });
    setError("");
    setSelectedFiles({ file1: null, file2: null, file3: null });
    setUploading(false);
  };

  const handleDelete = async (product: Product) => {
    const shouldDelete = window.confirm(
      `Do you really want to delete the product "${product.name}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    await onDelete(product.id);

    if (editingId === product.id) {
      resetForm();
    }
  };

  const title =
    activeTab === "products" ? "Store Management" : "Order Management";
  const description =
    activeTab === "products"
      ? "Add, edit, and remove storefront products while keeping product images and stock details current."
      : "Track incoming orders, review customer details, and update delivery status without leaving the admin area.";

  return (
    <section className="min-h-screen bg-[#FAF7F2] pb-16 pt-24 lg:pb-24 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-[#F4A261]">
              Admin Dashboard
            </p>
            <h1 className="text-3xl font-bold text-[#1A2E28] sm:text-4xl">
              {title}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className="max-w-xl text-sm text-[#4a6b5f]">{description}</p>
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center justify-center rounded-full bg-[#F87171]/10 px-5 py-2 text-sm font-semibold text-[#B91C1C] transition hover:bg-[#F87171]/20"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              activeTab === "products"
                ? "bg-[#2F5D50] text-white shadow-sm"
                : "border border-[#D1D5DB] bg-white text-[#475569] hover:bg-[#F8FAFC]"
            }`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
              activeTab === "orders"
                ? "bg-[#2F5D50] text-white shadow-sm"
                : "border border-[#D1D5DB] bg-white text-[#475569] hover:bg-[#F8FAFC]"
            }`}
          >
            Orders
          </button>
        </div>

        {activeTab === "orders" ? (
          <AdminOrders />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-lg">
                <div className="border-b border-[#E5E7EB] px-6 py-5">
                  <h2 className="text-xl font-semibold text-[#1A2E28]">
                    Existing Products
                  </h2>
                  <p className="mt-1 text-sm text-[#4a6b5f]">
                    {products.length} products currently available.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-[#334155]">
                    <thead className="bg-[#F8FAFC] text-xs uppercase tracking-wider text-[#64748B]">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Discount</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-t border-[#E5E7EB]"
                        >
                          <td className="px-4 py-3 font-medium text-[#0F172A]">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 text-[#475569]">
                            {product.category}
                          </td>
                          <td className="px-4 py-3 text-[#475569]">
                            <div className="space-y-1">
                              <p>BDT {product.price.toFixed(2)}</p>
                              {hasDiscount(product) && (
                                <p className="text-xs font-semibold text-[#2F5D50]">
                                  Now BDT {getDiscountedPrice(product).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[#475569]">
                            {product.discountPercent ?? 0}%
                          </td>
                          <td className="px-4 py-3 text-[#475569]">
                            {product.inStock ? "Yes" : "No"}
                          </td>
                          <td className="flex flex-wrap gap-2 px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="rounded-full bg-[#A8C686]/15 px-3 py-2 text-xs font-semibold text-[#2F5D50] transition hover:bg-[#A8C686]/25"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(product)}
                              className="rounded-full bg-[#F87171]/15 px-3 py-2 text-xs font-semibold text-[#B91C1C] transition hover:bg-[#F87171]/25"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#1A2E28]">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="mt-1 text-sm text-[#4a6b5f]">
                  {editingId
                    ? "Update the selected product details and save your changes."
                    : "Create a new product entry for the storefront."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-sm text-[#B91C1C]">{error}</p>}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-[#334155]">
                    Name
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        handleChange("name", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#334155]">
                    Category
                    <select
                      value={form.category}
                      onChange={(event) =>
                        handleChange("category", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-[#334155]">
                    Price
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        handleChange("price", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#334155]">
                    Discount (%)
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={form.discountPercent}
                      onChange={(event) =>
                        handleChange("discountPercent", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#334155]">
                    Unit
                    <input
                      type="text"
                      value={form.unit}
                      onChange={(event) =>
                        handleChange("unit", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-[#334155]">
                  Description
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      handleChange("description", event.target.value)
                    }
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                  />
                </label>

                <label className="block text-sm font-medium text-[#334155]">
                  Product Image 1
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileChange(event, 1)}
                    disabled={uploading}
                    className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] file:mr-4 file:rounded-lg file:border-0 file:bg-[#2F5D50] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#264d43] focus:border-[#2F5D50] focus:outline-none"
                  />
                  {selectedFiles.file1 && (
                    <p className="mt-2 text-sm text-[#2F5D50]">
                      Selected: {selectedFiles.file1.name}
                    </p>
                  )}
                  {!selectedFiles.file1 && form.image && (
                    <p className="mt-2 text-sm text-[#4a6b5f]">
                      Current image: {form.image}
                    </p>
                  )}
                </label>

                <label className="block text-sm font-medium text-[#334155]">
                  Product Image 2 (Optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileChange(event, 2)}
                    disabled={uploading}
                    className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] file:mr-4 file:rounded-lg file:border-0 file:bg-[#2F5D50] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#264d43] focus:border-[#2F5D50] focus:outline-none"
                  />
                  {selectedFiles.file2 && (
                    <p className="mt-2 text-sm text-[#2F5D50]">
                      Selected: {selectedFiles.file2.name}
                    </p>
                  )}
                  {!selectedFiles.file2 && form.image2 && (
                    <p className="mt-2 text-sm text-[#4a6b5f]">
                      Current image: {form.image2}
                    </p>
                  )}
                </label>

                <label className="block text-sm font-medium text-[#334155]">
                  Product Image 3 (Optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileChange(event, 3)}
                    disabled={uploading}
                    className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] file:mr-4 file:rounded-lg file:border-0 file:bg-[#2F5D50] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#264d43] focus:border-[#2F5D50] focus:outline-none"
                  />
                  {uploading && (
                    <p className="mt-2 text-sm text-[#F4A261]">
                      Uploading images...
                    </p>
                  )}
                  {selectedFiles.file3 && (
                    <p className="mt-2 text-sm text-[#2F5D50]">
                      Selected: {selectedFiles.file3.name}
                    </p>
                  )}
                  {!selectedFiles.file3 && form.image3 && (
                    <p className="mt-2 text-sm text-[#4a6b5f]">
                      Current image: {form.image3}
                    </p>
                  )}
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-[#334155]">
                    Badge
                    <input
                      type="text"
                      value={form.badge}
                      onChange={(event) =>
                        handleChange("badge", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                    />
                  </label>

                  <label className="block text-sm font-medium text-[#334155]">
                    Rating
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={form.rating}
                      onChange={(event) =>
                        handleChange("rating", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-[#334155]">
                    Reviews
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={form.reviews}
                      onChange={(event) =>
                        handleChange("reviews", event.target.value)
                      }
                      className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                    />
                  </label>

                  <label className="flex items-center gap-3 text-sm font-medium text-[#334155]">
                    <input
                      type="checkbox"
                      checked={form.inStock}
                      onChange={(event) =>
                        handleChange("inStock", event.target.checked)
                      }
                      className="h-4 w-4 rounded border-[#D1D5DB] text-[#2F5D50] focus:ring-[#2F5D50]"
                    />
                    In Stock
                  </label>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#2F5D50] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#264d43]"
                  >
                    {editingId ? "Update Product" : "Add Product"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex items-center justify-center rounded-full border border-[#D1D5DB] bg-white px-5 py-3 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
