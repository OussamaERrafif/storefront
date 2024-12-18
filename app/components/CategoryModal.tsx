'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../services/api'
import { X } from 'lucide-react'

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await api.getCategories()
      setCategories(data)
      setError('')
    } catch (err) {
      setError('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.addCategory({ name: newCategoryName })
      setNewCategoryName('')
      await fetchCategories()
    } catch (err) {
      setError('Failed to add category')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    setLoading(true)
    setError('')

    try {
      await api.deleteCategory(id)
      await fetchCategories()
    } catch (err) {
      setError('Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
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
            <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Current Categories</h3>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id} className="bg-gray-100 p-2 rounded flex justify-between items-center">
                      <span>{category.name}</span>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={`Delete ${category.name} category`}
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label htmlFor="newCategory" className="block mb-1 font-medium">
                  Add New Category
                </label>
                <input
                  type="text"
                  id="newCategory"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
              <div className="flex justify-between">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Category
                </motion.button>
              </div>
            </form>
            {error && <div className="mt-4 text-red-500">{error}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

