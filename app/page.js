
'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';

const LandingPage = () => {
  const [showButton, setShowButton] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <link rel="preload" as="image" href="/banner.jpg" />
        <link rel="preload" as="image" href="/slide1.jpg" />
        <link rel="preload" as="image" href="/slide2.jpg" />
        <link rel="preload" as="image" href="/slide3.jpg" />
      </Head>
    
    <div>
      {/* Hero Section */}
      <section 
        className="w-full py-16 text-white text-center h-[450px] bg-cover bg-center flex justify-start items-center transition-all duration-500 ease-in-out"
        style={{ backgroundImage: 'url(/banner.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-40 h-[450px] mt-20"></div>
        <div className="relative z-10 p-6 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to E-Store
          </h1>
          <p className="text-xl mb-6">
          Shop the best products at amazing prices!
          </p>
          <Link href="/signin">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg transition-all">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      <section className="w-full h-[500px]">
        <Swiper
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination]}
          className="w-full h-full transition-all duration-500 ease-in-out"
        >
          {[1, 2, 3].map((i) => (
            <SwiperSlide key={i}>
              <div
                className="w-full h-[500px] bg-cover bg-center transition-all duration-500 ease-in-out"
                style={{ backgroundImage: `url(/slide${i}.jpg)` }}
              >
                <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Exclusive Offer {i}</h2>
                    <p className="mb-6">Discover our latest collection</p>
                    <a
                      href="/products"
                      className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300 ease-in-out"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Categories Slider */}
      <section className="py-16 px-4 bg-blue-300">
        <h2 className="text-2xl font-semibold mb-8 text-center">Shop by Category</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          modules={[Autoplay, Navigation]}
          className="category-swiper transition-all duration-500 ease-in-out"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.name}>
              <div
                className="flex flex-col items-center bg-white p-4 rounded shadow transition-transform duration-500 transform hover:scale-105 hover:shadow-xl cursor-pointer"
                onClick={() => router.push(`/products?category=${category.name}`)}
              >
                <img
                  src={`/${category.name.toLowerCase()}.jpg`}
                  alt={category.name}
                  className="h-40 mb-4 object-contain transition-all duration-500 ease-in-out"
                />
                <h3 className="text-lg font-medium">{category.name}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Featured Products (Placeholder) */}
      <section className="py-16 px-4 bg-red-200">
        <h2 className="text-2xl font-semibold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border p-4 rounded shadow bg-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out"
            >
              <div className="overflow-hidden rounded mb-4">
                <img
                  src={`/product${i}.jpg`}
                  alt={`Product ${i}`}
                  className="h-50 w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-400 text-center">
        <h2 className="text-4xl font-semibold mb-10">Features of E-Store</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold mb-4">Wide Range of Products</h3>
            <p className="text-gray-700">
              Explore our extensive collection of products across multiple categories.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold mb-4">Secure Payments</h3>
            <p className="text-gray-700">
              Pay securely using a variety of payment methods with end-to-end encryption.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
            <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
            <p className="text-gray-700">
              Enjoy fast and reliable delivery, right to your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-blue-900 text-white py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
        <p className="text-xl mb-6">
          Start exploring the latest trends and get the best deals now!
        </p>
        <Link href="/signin">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-full text-lg transition-all">
            Join Now
          </button>
        </Link>
      </section>

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-opacity duration-300 ease-in-out z-50"
          aria-label="Back to Top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
    </>
  );
};

export default LandingPage;
