'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductList from './components/ProductList'
import CategoryModal from './components/CategoryModal'

export default function Home() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Product Management System
        </motion.h1>
        <div className="mb-8 flex justify-center space-x-4">
          <motion.button
            className="px-6 py-3 rounded-full text-lg font-semibold bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            onClick={() => setIsCategoryModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Manage Categories
          </motion.button>
        </div>
        <ProductList />
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      </div>
    </div>
  )
}

