'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { toast, Toaster } from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

const sortOptions = ['Default', 'Price: Low to High', 'Price: High to Low'];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const { user, isLoaded } = useUser();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`),
        ]);

        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json(),
        ]);

        setProducts(Array.isArray(productsData.data) ? productsData.data : []);
        const categoryNames = categoriesData.map((cat) => cat.name);
        setCategories(['All', ...categoryNames]);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [isClient]);

  useEffect(() => {
    if (!isClient || categories.length === 0) return;

    const categoryFromQuery = searchParams.get('category');
    if (categoryFromQuery && categories.includes(categoryFromQuery)) {
      setSelectedCategory(categoryFromQuery);
    }
  }, [isClient, searchParams, categories]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    const param = value === 'All' ? '' : `?category=${value}`;
    router.push(`/products?${param}`);
  };

  let filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((product) => product.category.name === selectedCategory);

  filteredProducts = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortBy === 'Price: Low to High') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Price: High to Low') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const handleAddToCart = (product) => {
    if (!isLoaded || !user) {
      router.push('/signin');
    } else {
      const alreadyInCart = cartItems.find((item) => item.id === product.id);
      if (alreadyInCart) {
        toast.info('Item already in cart');
      } else {
        addToCart(product, user.id);
        toast.success(`${product.name} added to cart`);
      }
    }
  };

  const handleCheckout = () => {
    router.push('/cart');
  };

  if (!isClient) return null;

  return (
    <main className="p-4 min-h-screen bg-blue-100">
      <div className="flex justify-between flex-col sm:flex-row">
        <h1 className="text-3xl font-bold text-left mb-4">Our Products</h1>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 rounded border shadow focus:outline-none"
          />

          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 rounded border shadow focus:outline-none"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded border shadow focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-blue-600 mt-10">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {filteredProducts.map((product) => {
            const alreadyInCart = cartItems.find((item) => item.id === product.id);

            return (
              <div
                key={product.id}
                className="border rounded shadow bg-white hover:shadow-lg transition flex flex-col items-center p-3"
                style={{ width: '100%', maxWidth: '200px', height: '300px', margin: '0 auto' }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-40 w-50 object-cover mb-3 rounded"
                />
                <h5 className="font-medium text-center text-sm">{product.sku}</h5>
                <h3 className="font-medium text-center text-md">{product.name}</h3>
                <p className="text-sm text-gray-600">Rs.{product.price}</p>

                <button
                  className="mt-auto px-4 py-1 text-sm bg-yellow-600 text-white rounded-xl hover:bg-yellow-400 transition"
                  onClick={() => {
                    if (alreadyInCart) {
                      handleCheckout();
                    } else {
                      handleAddToCart(product);
                    }
                  }}
                >
                  {alreadyInCart ? 'Checkout' : 'Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Toaster />
    </main>
  );
}
