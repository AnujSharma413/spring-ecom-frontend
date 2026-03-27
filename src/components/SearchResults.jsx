import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppContext from "../Context/Context"; // ✅ AppContext connect kiya
import unplugged from "../assets/unplugged.png";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext); // ✅ addToCart function context se liya
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.searchData) {
      setSearchData(location.state.searchData);
      setLoading(false);
    } else {
      // Agar direct access karne ki koshish kare bina data ke toh home bhej do
      navigate("/");
    }
  }, [location, navigate]);

  // Image display logic
  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return unplugged;
    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5 d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Search Results</h2>
        <span className="badge bg-primary px-3 py-2">{searchData.length} Products Found</span>
      </div>
      
      {searchData.length === 0 ? (
        <div className="text-center my-5 py-5 card shadow-sm border-0">
          <img src={unplugged} alt="No results" className="mx-auto mb-3" width="80" />
          <h4 className="text-muted">Oops! Hume kuch nahi mila.</h4>
          <p>Try searching for different keywords.</p>
          <button className="btn btn-primary btn-sm mx-auto" onClick={() => navigate("/")}>Go Back Home</button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {searchData.map((product) => (
            <div key={product.id} className="col">
              <div className="card h-100 shadow-sm border-0">
                <div className="position-relative">
                  <img 
                    src={convertBase64ToDataURL(product.imageData || product.productImage)} 
                    className="card-img-top p-3" 
                    alt={product.name}
                    style={{ height: "180px", objectFit: "contain", cursor: "pointer" }}
                    onClick={() => handleViewProduct(product.id)}
                    onError={(e) => { e.target.src = unplugged; }}
                  />
                  {(!product.productAvailable || product.stockQuantity <= 0) && (
                    <span className="position-absolute top-0 start-0 m-2 badge bg-danger">Sold Out</span>
                  )}
                </div>
                
                <div className="card-body d-flex flex-column">
                  <small className="text-muted text-uppercase fw-bold">{product.brand}</small>
                  <h6 className="card-title text-truncate">{product.name}</h6>
                  
                  <div className="mb-2">
                    <span className="badge bg-light text-dark border">{product.category}</span>
                  </div>
                  
                  <p className="card-text small text-muted text-truncate mb-3" style={{ fontSize: "0.85rem" }}>
                    {product.description}
                  </p>
                  
                  <div className="mt-auto">
                    <h5 className="text-primary fw-bold mb-3">₹{product.price.toLocaleString('en-IN')}</h5>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm flex-grow-1"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        Details
                      </button>
                      <button 
                        className="btn btn-primary btn-sm flex-grow-1"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.productAvailable || product.stockQuantity <= 0}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;