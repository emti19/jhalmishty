import { useState, type FormEvent } from "react";
import { categories } from "../data/products";
import { Product } from "../types";
import { supabase } from "../lib/supabase";

interface AdminProductsProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
  onSignOut: () => Promise<void> | void;
}

const initialFormState = {
  name: "",
  description: "",
  details: "",
  price: "0",
  unit: "each",
  category: "fruits",
  image: "",
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
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const categoryOptions = categories.filter((cat) => cat.id !== "all");

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setError("");
    setSelectedFile(null);
    setUploading(false);
  };

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Clear the image URL when a file is selected
      setForm((current) => ({
        ...current,
        image: "",
      }));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading image:", error);
        return null;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
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

    let imageUrl = form.image;

    // Upload file if selected
    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (!uploadedUrl) {
        setError("Failed to upload image. Please try again.");
        return;
      }
      imageUrl = uploadedUrl;
    }

    const product: Product = {
      id: editingId ?? Math.floor(Math.random() * 1000000).toString(), // Generate numeric ID as string
      name: form.name.trim(),
      description: form.description.trim(),
      details: form.details.trim() || form.description.trim(),
      price: Number(form.price),
      unit: form.unit.trim() || "each",
      category: form.category as Product["category"],
      image:
        imageUrl ||
        "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600",
      badge: form.badge.trim() || undefined,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      inStock: form.inStock,
    };

    if (editingId) {
      onUpdate(product);
    } else {
      onAdd(product);
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      details: product.details || "",
      price: String(product.price),
      unit: product.unit,
      category: product.category,
      image: product.image,
      badge: product.badge || "",
      rating: String(product.rating),
      reviews: String(product.reviews),
      inStock: product.inStock,
    });
    setError("");
    setSelectedFile(null);
    setUploading(false);
  };

  return (
    <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <p className="text-[#F4A261] font-medium text-sm mb-2 tracking-wide uppercase">
              Admin Dashboard
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1A2E28]">
              Product Management
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-[#4a6b5f] text-sm max-w-xl">
              Add, edit, or remove products from the shared product list.
              Changes update the live product collection used by the homepage.
            </p>
            <button
              onClick={onSignOut}
              className="inline-flex items-center justify-center rounded-full bg-[#F87171]/10 px-5 py-2 text-sm font-semibold text-[#B91C1C] hover:bg-[#F87171]/20 transition"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#E5E7EB]">
                <h2 className="text-xl font-semibold text-[#1A2E28]">
                  Existing Products
                </h2>
                <p className="text-sm text-[#4a6b5f] mt-1">
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
                          ৳{product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-[#475569]">
                          {product.inStock ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-2 rounded-full bg-[#A8C686]/15 text-[#2F5D50] text-xs font-semibold hover:bg-[#A8C686]/25 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(product.id)}
                            className="px-3 py-2 rounded-full bg-[#F87171]/15 text-[#B91C1C] text-xs font-semibold hover:bg-[#F87171]/25 transition"
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

          <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#1A2E28]">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-sm text-[#4a6b5f] mt-1">
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
                  className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none"
                  rows={4}
                />
              </label>

              <label className="block text-sm font-medium text-[#334155]">
                Product Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 w-full rounded-2xl border border-[#D1D5DB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] focus:border-[#2F5D50] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2F5D50] file:text-white hover:file:bg-[#264d43]"
                  disabled={uploading}
                />
                {uploading && (
                  <p className="mt-2 text-sm text-[#F4A261]">
                    Uploading image...
                  </p>
                )}
                {selectedFile && (
                  <p className="mt-2 text-sm text-[#2F5D50]">
                    Selected: {selectedFile.name}
                  </p>
                )}
                {!selectedFile && form.image && (
                  <p className="mt-2 text-sm text-[#4a6b5f]">
                    Current image: {form.image}
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
      </div>
    </section>
  );
}
