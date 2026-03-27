import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// ✅ IMPORT: Custom axios instance use kar rahe hain
import axios from "../axios"; 

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  // 🗑️ Removed: const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      // ✅ CLEANED: Uses global axios config
      const response = await axios.get("/api/products");
      console.log("Navbar check:", response.status);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleNavbarToggle = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  const handleLinkClick = () => {
    setIsNavCollapsed(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    
    setShowNoProductsMessage(false);
    setIsLoading(true);
    setIsNavCollapsed(true);
    
    try {
      // ✅ CLEANED: axios instance handle karega baseURL
      const response = await axios.get(`/api/products/search?keyword=${input}`);
      
      if (response.data.length === 0) {
        setShowNoProductsMessage(true);
        setTimeout(() => setShowNoProductsMessage(false), 3000);
      } else {
        navigate(`/search-results`, { state: { searchData: response.data } });
      }
    } catch (error) {
      console.error("Search error:", error);
      setShowNoProductsMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm" ref={navbarRef}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          TOMATO
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavbarToggle}
          aria-expanded={!isNavCollapsed}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleLinkClick}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add_product" onClick={handleLinkClick}>Add Product</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders" onClick={handleLinkClick}>Orders</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center flex-column flex-lg-row gap-2">
            <Link to="/cart" className="nav-link text-dark px-3" onClick={handleLinkClick}>
              <i className="bi bi-cart3 fs-5 me-1"></i>
              Cart
            </Link>

            <form className="d-flex" onSubmit={handleSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="btn btn-outline-success" type="submit" disabled={isLoading}>
                {isLoading ? <span className="spinner-border spinner-border-sm"></span> : "Search"}
              </button>
            </form>

            <button className="btn btn-sm btn-outline-secondary ms-lg-2" onClick={toggleTheme}>
              {theme === "light-theme" ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i>}
            </button>
            
            {showNoProductsMessage && (
              <div className="alert alert-warning position-absolute p-2 small" style={{ top: "100%", right: "10px", zIndex: 1000 }}>
                No matches found.
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;