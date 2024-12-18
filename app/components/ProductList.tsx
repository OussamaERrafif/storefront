'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../services/api'
import ProductCard from './ProductCard'
import AddProductModal from './AddProductModal'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await api.getProducts()
      setProducts(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories()
      setCategories(data)
    } catch (err) {
      setError('Failed to fetch categories')
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleUpdateProduct = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleProductSaved = () => {
    fetchProducts()
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = () => {
    fetchProducts()
  }

  const filteredProducts = products
    .filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
    .filter(product => selectedCategory ? product.category_id === parseInt(selectedCategory) : true)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'price') return a.price - b.price
      return 0
    })

  if (loading) return <div className="text-center text-2xl">Loading...</div>
  if (error) return <div className="text-center text-2xl text-red-500">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Product List</h2>
        <motion.button
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          onClick={handleAddProduct}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Product
        </motion.button>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdate={() => handleUpdateProduct(product)}
              onDelete={handleDeleteProduct}
            />
          ))}
        </AnimatePresence>
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductSaved={handleProductSaved}
        categories={categories}
        editingProduct={editingProduct}
      />
    </div>
  )
}

