'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Add item to cart
  const addToCart = (product) => {
    const updatedProduct = {
      ...product,
      price: parseFloat(product.price),  
      quantity: parseInt(product.quantity) || 1,  
    };

    setCartItems((prevItems) => {
      // Check if product is already in the cart
      const isProductInCart = prevItems.some((item) => item.id === updatedProduct.id);
      if (!isProductInCart) {
        return [...prevItems, updatedProduct];
      }
      return prevItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]); 
  };

  // Update item quantity
  const updateItemQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      });
    });
  };

  // Save to localStorage when cartItems change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateItemQuantity, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
