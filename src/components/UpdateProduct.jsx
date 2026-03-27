import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// ✅ IMPORT: Hamara custom axios instance
import axios from "../axios"; 
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({});
  const [image, setImage] = useState(null);
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: "",
  });

  const [imageChanged, setImageChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 🗑️ Removed: const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Step 1: Fetch Product Details
        const response = await axios.get(`/api/product/${id}`);
        setProduct(response.data);
        setUpdateProduct(response.data);

        // Step 2: Fetch Image and convert to File object
        const responseImage = await axios.get(`/api/product/${id}/image`, { 
          responseType: "blob" 
        });
        
        const imageFile = new File([responseImage.data], response.data.imageName || "product_image", { 
          type: responseImage.data.type 
        });
        setImage(imageFile);
        
        setFetching(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product details load nahi ho payi.");
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    
    // ✅ IMAGE LOGIC: Agar image change hui hai tabhi bhejo, varna null
    if (imageChanged && image) {
      formData.append("imageFile", image);
    } else {
      formData.append("imageFile", null);
    }

    // ✅ JSON BLOB: Backend expects 'product' part as application/json
    formData.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    try {
      await axios.put(`/api/product/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      toast.success("Product updated successfully! 🎉");
      navigate('/');
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Update fail ho gaya. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageChanged(true);
    }
  };

  if (fetching) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4 text-center">Update Product</h3>
              
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={updateProduct.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={updateProduct.brand}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={updateProduct.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={updateProduct.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={updateProduct.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Headphone">Headphone</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Electronics">Electronics</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stockQuantity"
                    value={updateProduct.stockQuantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Release Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="releaseDate"
                    value={updateProduct.releaseDate ? updateProduct.releaseDate.slice(0, 10) : ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Update Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  <div className="form-text">Current: {product.imageName || "None"}</div>
                </div>

                <div className="col-12">
                  <div className="form-check form-switch mt-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="productAvailable"
                      checked={updateProduct.productAvailable}
                      onChange={handleChange}
                      id="availSwitch"
                    />
                    <label className="form-check-label" htmlFor="availSwitch">
                      Available for Sale
                    </label>
                  </div>
                </div>

                <div className="col-12 mt-4 d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Save Changes"}
                  </button>
                  <button type="button" className="btn btn-light px-4" onClick={() => navigate('/')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;