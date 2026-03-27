import React, { useState } from "react";
// ✅ IMPORT: Custom axios instance use kar rahe hain (relative path check kar lena)
import axios from "../axios"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setProduct({ ...product, [name]: fieldValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Please select a valid image (JPEG/PNG)" });
      } else if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
      } else {
        setErrors({ ...errors, image: null });
      }
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.brand.trim()) newErrors.brand = "Brand is required";
    if (!product.price || parseFloat(product.price) <= 0) newErrors.price = "Price must be > 0";
    if (!product.category) newErrors.category = "Please select a category";
    if (!image) newErrors.image = "Product image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    // ✅ AXIOS CALL: No baseURL or template literals needed here
    axios
      .post("/api/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        toast.success("Product added successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.error(error.response?.data?.message || "Error adding product");
        setLoading(false);
      });
  };

  return (
    <div className="container mt-5 pt-4">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">Add New Product</h2>
        <form onSubmit={submitHandler} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Product Name</label>
            <input type="text" name="name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={product.name} onChange={handleInputChange} />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Brand</label>
            <input type="text" name="brand" className={`form-control ${errors.brand ? 'is-invalid' : ''}`} value={product.brand} onChange={handleInputChange} />
            {errors.brand && <div className="invalid-feedback">{errors.brand}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea name="description" className="form-control" rows="3" value={product.description} onChange={handleInputChange}></textarea>
          </div>

          <div className="col-md-4">
            <label className="form-label">Price (₹)</label>
            <input type="number" name="price" className={`form-control ${errors.price ? 'is-invalid' : ''}`} value={product.price} onChange={handleInputChange} />
          </div>

          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select name="category" className={`form-select ${errors.category ? 'is-invalid' : ''}`} value={product.category} onChange={handleInputChange}>
              <option value="">Select Category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Stock Quantity</label>
            <input type="number" name="stockQuantity" className="form-control" value={product.stockQuantity} onChange={handleInputChange} />
          </div>

          <div className="col-md-6">
            <label className="form-label">Release Date</label>
            <input type="date" name="releaseDate" className="form-control" value={product.releaseDate} onChange={handleInputChange} />
          </div>

          <div className="col-md-6 d-flex align-items-center mt-4">
            <div className="form-check">
              <input type="checkbox" name="productAvailable" className="form-check-input" checked={product.productAvailable} onChange={handleInputChange} />
              <label className="form-check-label">Available in Stock</label>
            </div>
          </div>

          <div className="col-12 mt-3">
            <label className="form-label">Product Image</label>
            <input type="file" className={`form-control ${errors.image ? 'is-invalid' : ''}`} onChange={handleImageChange} />
            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 img-thumbnail" style={{ width: "120px" }} />}
          </div>

          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-primary px-5" disabled={loading}>
              {loading ? "Processing..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;