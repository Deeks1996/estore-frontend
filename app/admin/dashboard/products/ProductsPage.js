'use client';

import { useEffect, useState } from 'react';
import ProductModal from '@/components/ProductModal';
import ProductForm from '@/components/ProductForm';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

export default function ProductPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
    const data = await res.json();
    if (data.success) {
      setProducts(data.data);
    } else {
      console.error('Failed to fetch products:', data.error);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`, { method: 'DELETE' });
    fetchProducts(); 
  };

  const handleSave = async (productData) => {
    if (editingProduct?.id) {
      // Editing an existing product
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
    } else {
      // Creating a new product
      console.log("Sending:",productData);
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
    }
    setModalOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-300 to-purple-200 backdrop-blur-sm rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">Products</h1>
        <button
          onClick={openNewProductModal}
          className="bg-red-800 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition w-full sm:w-auto"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
              className="bg-white/30 backdrop-blur-lg shadow-lg rounded-xl overflow-hidden transform hover:shadow-2xl hover:brightness-105 cursor-pointer border border-slate-500"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h5 className="text-xl font-semibold text-gray-900">{product.sku}</h5>
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-700 mt-1">Rs.{product.price}</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-purple-200 text-purple-800 rounded-full">
                  {product.category?.name || 'Uncategorized'}
                </span>

                <div className="mt-4 flex justify-between text-sm">
                  <button
                    onClick={() => openEditProductModal(product)}
                    className="bg-blue-600 text-white px-4 py-1 rounded-xl hover:bg-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded-xl hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No products available.</p>
        )}
      </div>

      {modalOpen && (
        <ProductModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={editingProduct}
          onSave={handleSave}
        >
          {/* Render ProductForm inside ProductModal */}
          <ProductForm 
            product={editingProduct} 
            onSave={handleSave} 
            onClose={() => setModalOpen(false)} 
            categories={[]} 
          />
        </ProductModal>
      )}
    </div>
  );
}
