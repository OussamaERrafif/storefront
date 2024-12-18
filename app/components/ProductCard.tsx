'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { api } from '../services/api'

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    category_id: number;
    image : any;
    image_url: any
  };
  onUpdate: () => void;
  onDelete: () => void;
}

export default function ProductCard({ product, onUpdate, onDelete }: ProductCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await api.deleteProduct(product.id)
      onDelete()
    } catch (error) {
      console.error('Failed to delete product:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Image
      src={product.image_url ? `http://127.0.0.1:8000${product.image_url}` : '/image.png'}
      alt={product.name}
      width={300}
      height={200}
      className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="font-bold mb-4">${product.price}</p>
        <div className="flex justify-between">
          <motion.button
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            onClick={onUpdate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Update
          </motion.button>
          <motion.button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            onClick={handleDelete}
            disabled={isDeleting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

