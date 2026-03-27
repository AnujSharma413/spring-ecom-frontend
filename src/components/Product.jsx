import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
// ✅ IMPORT: Custom axios instance
import axios from "../axios"; 
import { toast } from "react-toastify";
import { Spinner, Badge, Button } from "react-bootstrap";
import unplugged from "../assets/unplugged.png";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  // 🗑️ Removed: const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ✅ CLEANED: axios instance handled baseURL
        const response = await axios.get(`/api/product/${id}`);
        setProduct(response.data);
        
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product details load nahi ho payi.");
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get(`/api/product/${id}/image`, { 
          responseType: "blob" 
        });
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
        
        // Memory cleanup cleanup
        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageUrl(unplugged);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/api/product/${id}`);
      removeFromCart(id);
      toast.success("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Delete karne mein error aaya.");
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (!product) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="row g-5">
        {/* Product Image Section */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm p-3 bg-white rounded">
            <img
              src={imageUrl || unplugged}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: "450px", width: "100%", objectFit: "contain" }}
              onError={(e) => { e.target.src = unplugged; }}
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="col-md-6">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Badge bg="secondary" className="text-uppercase">{product.category}</Badge>
            <span className="text-muted small">|</span>
            <small className="text-muted">
              Released: {new Date(product.releaseDate).toLocaleDateString('en-IN')}
            </small>
          </div>

          <h1 className="display-6 fw-bold text-capitalize">{product.name}</h1>
          <p className="lead text-muted fst-italic mb-4">by {product.brand}</p>

          <div className="card bg-light border-0 p-3 mb-4">
            <h6 className="fw-bold">Description</h6>
            <p className="mb-0 text-secondary">{product.description}</p>
          </div>

          <div className="mb-4">
            <h2 className="text-primary fw-bold">₹{product.price.toLocaleString('en-IN')}</h2>
            <p className={product.stockQuantity > 0 ? "text-success mb-0" : "text-danger mb-0"}>
              <i className={`bi bi-circle-fill me-2 small`}></i>
              {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} units)` : "Currently Out of Stock"}
            </p>
          </div>

          <div className="d-grid gap-3 mb-5">
            <Button
              variant="primary"
              size="lg"
              onClick={handlAddToCart}
              disabled={!product.productAvailable || product.stockQuantity <= 0}
            >
              <i className="bi bi-cart-plus me-2"></i>
              {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>

          {/* Admin Controls */}
          <div className="border-top pt-4 mt-4">
            <p className="small text-muted mb-2 text-uppercase fw-bold">Seller Actions</p>
            <div className="d-flex gap-2">
              <Button variant="outline-dark" onClick={handleEditClick}>
                <i className="bi bi-pencil-square me-2"></i>Edit
              </Button>
              <Button variant="outline-danger" onClick={deleteProduct}>
                <i className="bi bi-trash3 me-2"></i>Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;