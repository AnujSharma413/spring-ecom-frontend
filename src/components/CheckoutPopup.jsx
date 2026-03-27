import React, { useState } from 'react';
// ✅ IMPORT: Apne custom axios instance ko connect kiya
import axios from '../axios'; 
import { Modal, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {
  // 🗑️ Removed: const baseUrl = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);

    const orderItems = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    const data = {
      customerName: name,
      email: email,
      items: orderItems
    };

    try {
      // ✅ CLEANED: Ab direct endpoint use kar rahe hain
      const response = await axios.post('/api/orders/place', data);
      console.log('Order placed:', response.data);

      setToastVariant('success');
      setToastMessage('Order placed successfully!');
      setShowToast(true);

      // Local storage clean karna zaroori hai order ke baad
      localStorage.removeItem('cart');
      
      // Modal close karke home par redirect
      setTimeout(() => {
        handleClose();
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Order error:', error);
      setToastVariant('danger');
      setToastMessage(error.response?.data?.message || 'Failed to place order. Please try again.');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertBase64ToDataURL = (base64String, mimeType = 'image/jpeg') => {
    if (!base64String) return "https://via.placeholder.com/80"; 

    if (base64String.startsWith('data:')) return base64String;
    if (base64String.startsWith('http')) return base64String;

    return `data:${mimeType};base64,${base64String}`;
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="md">
        <Modal.Header closeButton>
          <Modal.Title>Finalize Purchase</Modal.Title>
        </Modal.Header>
        <Form noValidate validated={validated} onSubmit={handleConfirm}>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="checkout-items mb-4">
              <h6 className="fw-bold mb-3">Order Summary</h6>
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex mb-3 border-bottom pb-2 align-items-center">
                  <img
                    src={convertBase64ToDataURL(item.imageData)}
                    alt={item.name}
                    className="me-3 rounded"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-0 small fw-bold">{item.name}</h6>
                    <p className="mb-0 x-small text-muted">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-end">
                    <span className="small fw-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3 p-2 bg-light rounded">
                <span className="fw-bold">Total Amount:</span>
                <span className="fw-bold text-primary">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <hr />
            <h6 className="fw-bold mb-3">Customer Details</h6>
            
            <Form.Group className="mb-3">
              <Form.Label className="small">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="link" className="text-muted" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting} className="px-4">
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Placing Order...
                </>
              ) : 'Confirm & Pay'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Notification Toast */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className={toastVariant === 'success' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default CheckoutPopup;