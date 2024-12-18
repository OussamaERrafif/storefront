"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { api } from "../services/api";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSaved: () => void;
  categories: { id: number; name: string }[];
  editingProduct: any | null;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onProductSaved,
  categories,
  editingProduct,
}: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: "",
    image_url : ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        category_id: editingProduct.category_id.toString(),
        image: editingProduct.image || "",
        image_url : editingProduct.image_url || "",
      });
      setImagePreview(editingProduct.image || "");
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image: "",
        image_url : ""
      });
      setImagePreview("");
    }
  }, [editingProduct]);

  const handleChange = (e : any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e : any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageDelete = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview("");
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category_id", formData.category_id);
      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }
      formDataToSend.append("image_url", formData.image_url)
      try {
        if (editingProduct) {
          await api.updateProduct(formDataToSend, editingProduct.id);
        } else {
          console.log(formDataToSend)
          await api.addProduct(formDataToSend);
        }
        onProductSaved();
      } catch (err) {
        setError(`Failed to ${editingProduct ? "update" : "add"} product`);
      }

      onProductSaved();
    } catch (err) {
      setError(`Failed to ${editingProduct ? "update" : "add"} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? "Edit" : "Add New"} Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1 font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                ></textarea>
              </div>
              <div>
                <label htmlFor="price" className="block mb-1 font-medium">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label htmlFor="category_id" className="block mb-1 font-medium">
                  Category
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="image" className="block mb-1 font-medium">
                  Product Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              {imagePreview && (
                <div className="mt-2 relative">
                  <p className="mb-1 font-medium">Image Preview:</p>
                  <div className="relative inline-block">
                    <Image
                      src={
                        editingProduct
                          ? editingProduct.image_url
                            ? `http://127.0.0.1:8000${editingProduct.image_url}`
                            : "/image.png"
                          : imagePreview
                      }
                      alt="Product preview"
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none"
                      aria-label="Delete image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading
                    ? "Saving..."
                    : (editingProduct ? "Update" : "Add") + " Product"}
                </motion.button>
              </div>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
