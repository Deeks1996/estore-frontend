'use client';

import React, { useState, useEffect } from 'react';

// Dynamic import for Cloudinary script
const loadCloudinaryScript = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'; 
    script.async = true;
    script.onload = () => resolve(); 
    script.onerror = (error) => reject(new Error(`Cloudinary script failed to load: ${error.message}`)); 
    document.head.appendChild(script);
  });
};

export default function ProductForm({ product, onSubmit }) {
  const [name, setName] = useState(product?.name || '');
  const [sku, setSku] = useState(product?.sku || ''); 
  const [price, setPrice] = useState(product?.price || '');
  const [categoryName, setCategoryName] = useState(product?.category?.name || '');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [cloudinaryLoaded, setCloudinaryLoaded] = useState(false);

  useEffect(() => {
    // Fetch categories from backend
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`);
        const data = await response.json();
        setCategoryOptions(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    if (product) {
      setName(product.name);
      setSku(product.sku); 
      setPrice(product.price);
      setCategoryName(product.category?.name || '');
      setImageUrl(product.imageUrl);
    }
  }, [product]);

  useEffect(() => {
    loadCloudinaryScript()
      .then(() => {
        setCloudinaryLoaded(true); 
      })
      .catch((error) => {
        console.error('Cloudinary script failed to load:', error);
      });
  }, []);

  const handleImageUpload = () => {
    if (!cloudinaryLoaded) {
      console.error('Cloudinary is not loaded properly');
      return;
    }

    // Initialize Cloudinary widget only when it's loaded
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dnbyawd2g', 
        uploadPreset: 'ECommerce-Store',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        folder: 'products', 
        crop: 'limit',
        maxFileSize: 5000000, 
        clientAllowedFormats: ['jpeg', 'png', 'jpg', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setImageUrl(result.info.secure_url); 
          console.log('Image uploaded successfully:', result.info.secure_url);
        }
      }
    );

    widget.open();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); 
    const productData = {
      name,
      sku,
      price: parseFloat(price), 
      categoryName, 
      image: imageUrl, 
    };
    onSubmit(productData);
  };

  return (
    <div className="modal-container">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={name || ''} 
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            id="sku"
            value={sku || ''} 
            onChange={(e) => setSku(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            value={price || 0} 
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
            required
          >
            <option value="">Select Category</option>
            {categoryOptions.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <button
            type="button"
            onClick={handleImageUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Upload Image
          </button>
          {imageUrl && <img src={imageUrl} alt="Product" className="mt-4 w-full h-48 object-cover" />}
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md w-full"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>

    </div>
  );
}
