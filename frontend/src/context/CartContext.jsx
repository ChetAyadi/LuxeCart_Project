/**
 * LuxeCart Shopping Cart Context Provider
 * ---------------------------------------
 * Manages global cart state, item quantities, coupon discounts,
 * shipping & tax calculations, and LocalStorage persistence.
 */

import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load saved cart items from LocalStorage on initial mount
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  );

  // Load active coupon from LocalStorage if present
  const [coupon, setCoupon] = useState(
    localStorage.getItem('cartCoupon')
      ? JSON.parse(localStorage.getItem('cartCoupon'))
      : null
  );

  // UI state for slide-over drawer and toast notification
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync cart items with LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync coupon with LocalStorage
  useEffect(() => {
    if (coupon) {
      localStorage.setItem('cartCoupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('cartCoupon');
    }
  }, [coupon]);

  // Helper function to display floating toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  /**
   * Adds a product to cart or increases quantity if already present
   */
  const addToCart = (product, qty = 1) => {
    const itemPrice = product.discount_price ? Number(product.discount_price) : Number(product.price);
    const existingIndex = cartItems.findIndex((x) => x.product_id === product.id);

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].qty + qty;
      
      // Stock limit check
      if (newQty > product.stock) {
        showToast(`Only ${product.stock} items available in stock!`);
        return;
      }
      
      updated[existingIndex].qty = newQty;
      setCartItems(updated);
    } else {
      if (qty > product.stock) {
        showToast(`Only ${product.stock} items available in stock!`);
        return;
      }
      setCartItems([
        ...cartItems,
        {
          product_id: product.id,
          name: product.name,
          price: itemPrice,
          original_price: Number(product.price),
          image: product.image,
          stock: product.stock,
          category_name: product.category_name,
          qty,
        },
      ]);
    }

    showToast(`Added "${product.name}" to cart!`);
    setIsDrawerOpen(true);
  };

  /**
   * Removes an item from cart by product ID
   */
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((x) => x.product_id !== productId));
  };

  /**
   * Updates quantity of a specific item in cart
   */
  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cartItems.map((item) => {
      if (item.product_id === productId) {
        if (qty > item.stock) {
          showToast(`Only ${item.stock} items available in stock`);
          return item;
        }
        return { ...item, qty };
      }
      return item;
    });
    setCartItems(updated);
  };

  /**
   * Applies coupon code ('LUXE10' or 'SUMMER20')
   */
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'LUXE10') {
      setCoupon({ code: 'LUXE10', discountPercent: 10 });
      showToast('Coupon LUXE10 applied (10% OFF)!');
      return { success: true, message: '10% discount applied!' };
    } else if (clean === 'SUMMER20') {
      setCoupon({ code: 'SUMMER20', discountPercent: 20 });
      showToast('Coupon SUMMER20 applied (20% OFF)!');
      return { success: true, message: '20% discount applied!' };
    } else {
      return { success: false, message: 'Invalid promo coupon code' };
    }
  };

  /**
   * Removes active coupon
   */
  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed');
  };

  /**
   * Resets and clears all cart contents
   */
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  // ==========================================
  // PRICE & TAX CALCULATIONS
  // ==========================================
  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = coupon ? (rawSubtotal * coupon.discountPercent) / 100 : 0;
  const itemsPrice = Math.max(0, rawSubtotal - discountAmount);
  const shippingPrice = rawSubtotal > 150 || rawSubtotal === 0 ? 0 : 15.0; // Free shipping above $150
  const taxPrice = Number((itemsPrice * 0.08).toFixed(2)); // 8% estimated tax
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        coupon,
        isDrawerOpen,
        toastMessage,
        itemsPrice,
        rawSubtotal,
        discountAmount,
        shippingPrice,
        taxPrice,
        totalPrice,
        totalItemsCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        setIsDrawerOpen,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
