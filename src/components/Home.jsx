import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  // refreshData Context se aa raha hai, ensure karein Context mein axios correctly imported hai
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    let toastTimer;
    if (showToast) {
      toastTimer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [showToast]);

  // Image conversion logic with better fallbacks
  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return unplugged; 
    
    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;
    
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Navigation rokne ke liye
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  const filteredProducts = selectedCategory
    ? data.filter((product) => product.category === selectedCategory)
    : data;

  if (isError) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="text-center">
          <img src={unplugged} alt="Error" className="img-fluid" width="100" />
          <h4 className="mt-3 text-danger">Server Connection Failed</h4>
          <p className="text-muted">Please check if your backend is running on Render.</p>
          <button className="btn btn-outline-primary btn-sm" onClick={() => refreshData()}>Retry</button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Bootstrap Toast Notification */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <div className={`toast align-items-center text-white bg-success border-0 ${showToast ? 'show' : 'hide'}`} role="alert">
          <div className="d-flex">
            <div className="toast-body">
              {toastProduct ? `✅ ${toastProduct.name} added to cart!` : 'Added to cart!'}
            </div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setShowToast(false)}></button>
          </div>
        </div>
      </div>

      <div className="container mt-5 pt-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {!filteredProducts || filteredProducts.length === 0 ? (
            <div className="col-12 text-center my-5">
              <div className="spinner-border text-primary" role="status"></div>
              <h4 className="mt-3">Loading Products...</h4>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const { id, brand, name, price, productAvailable, imageData, stockQuantity } = product;
              
              return (
                <div className="col" key={id}>
                  <div className={`card h-100 shadow-sm border-0 ${(!productAvailable || stockQuantity === 0) ? 'opacity-75' : ''}`}>
                    <Link to={`/product/${id}`} className="text-decoration-none text-dark">
                      <div className="position-relative">
                        <img
                          src={convertBase64ToDataURL(imageData)} 
                          alt={name}
                          className="card-img-top p-3"
                          style={{ height: "200px", objectFit: "contain" }}
                          onError={(e) => { e.target.src = unplugged; }}
                        />
                        {(!productAvailable || stockQuantity === 0) && (
                          <span className="position-absolute top-0 start-0 m-2 badge bg-danger">Out of Stock</span>
                        )}
                      </div>
                      <div className="card-body d-flex flex-column">
                        <small className="text-uppercase text-muted fw-bold">{brand}</small>
                        <h6 className="card-title mb-2 text-truncate">{name}</h6>
                        <div className="mt-auto">
                          <h5 className="mb-3 text-primary">₹{price.toLocaleString()}</h5>
                          <button
                            className={`btn ${(!productAvailable || stockQuantity === 0) ? 'btn-secondary' : 'btn-primary'} w-100`}
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={!productAvailable || stockQuantity === 0}
                          >
                            <i className="bi bi-cart-plus me-2"></i>
                            {stockQuantity > 0 ? "Add to Cart" : "Sold Out"}
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Home;