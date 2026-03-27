import { useState, useEffect, createContext } from "react";
// ✅ IMPORT: Hamara custom axios instance
import axios from "../axios"; 

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  clearCart: () => {},
  updateStockQuantity: (productId, newQuantity) => {}  
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  
  // Safely initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 🗑️ Removed: const baseUrl = import.meta.env.VITE_BASE_URL;

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      let updatedCart;

      if (existingProductIndex !== -1) {
        updatedCart = prevCart.map((item, index) =>
          index === existingProductIndex
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const refreshData = async () => {
    try {
      // ✅ CLEAN: Ab baseURL axios config se handle hota hai
      const response = await axios.get("/api/products");
      setData(response.data);
      setIsError(""); 
    } catch (error) {
      console.error("Data fetch error:", error);
      setIsError(error.message || "Failed to fetch products");
    }
  };

  // Sync Cart with LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Initial Data Fetch
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider 
      value={{ 
        data, 
        isError, 
        cart, 
        addToCart, 
        removeFromCart, 
        refreshData, 
        clearCart 
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;