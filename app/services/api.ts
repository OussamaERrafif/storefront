import axios from 'axios';
import { log } from 'console';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const api = {

  getProducts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  addProduct: async (product: FormData) => {
    try {
      console.log("product " , product)
      const response = await axios.post(`${API_BASE_URL}/products`, product, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (product: FormData, id: number) => {
    console.log(product)
    console.log(id)
    try {
      const response = await axios.put(`${API_BASE_URL}/products/${id}`, product, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  

  getCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },


  addCategory: async (category : any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/categories`, category);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  updateCategory: async (category : any) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/categories/${category.id}`, category);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteProduct: async (id : any) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  deleteCategory: async (id : any) => {
    try {
      await axios.delete(`${API_BASE_URL}/categories/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};
