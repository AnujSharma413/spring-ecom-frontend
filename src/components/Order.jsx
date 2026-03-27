import React, { useEffect, useState } from 'react';
// ✅ IMPORT: Hamara custom axios instance
import axios from '../axios'; 
import { Spinner, Alert, Badge, Table, Button, Card } from 'react-bootstrap';

const Order = () => {
  // 🗑️ Removed: const baseUrl = import.meta.env.VITE_BASE_URL;
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ✅ CLEANED: Ab baseURL axios config se handle hoga
        const response = await axios.get('/api/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch Orders Error:", error);
        setError("Orders load nahi ho payi. Please check if backend is live.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'PLACED': { bg: 'info', text: 'Placed' },
      'SHIPPED': { bg: 'primary', text: 'Shipped' },
      'DELIVERED': { bg: 'success', text: 'Delivered' },
      'CANCELLED': { bg: 'danger', text: 'Cancelled' }
    };
    const current = statusMap[status] || { bg: 'secondary', text: status };
    return <Badge bg={current.bg}>{current.text}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const calculateOrderTotal = (items) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Orders</h2>
        <Badge pill bg="dark" className="px-3 py-2">Total Orders: {orders.length}</Badge>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-3">ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Abhi tak koi order nahi mila. 🛍️
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.orderId}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => toggleOrderDetails(order.orderId)}>
                      <td className="ps-3 fw-bold text-primary">#{order.orderId}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString('en-GB')}</td>
                      <td>
                        <div className="fw-semibold">{order.customerName}</div>
                        <small className="text-muted">{order.email}</small>
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td className="fw-bold">{formatCurrency(calculateOrderTotal(order.items))}</td>
                      <td className="text-center">
                        <Button 
                          variant={expandedOrder === order.orderId ? "secondary" : "outline-primary"} 
                          size="sm"
                        >
                          {expandedOrder === order.orderId ? 'Hide' : 'Details'}
                        </Button>
                      </td>
                    </tr>
                    
                    {/* Collapsible Details Row */}
                    {expandedOrder === order.orderId && (
                      <tr className="bg-light">
                        <td colSpan="6" className="p-4">
                          <div className="bg-white p-3 rounded shadow-sm border">
                            <h6 className="fw-bold border-bottom pb-2 mb-3">Order Items</h6>
                            <Table size="sm" borderless className="mb-0">
                              <thead>
                                <tr className="text-muted small">
                                  <th>Product Name</th>
                                  <th className="text-center">Qty</th>
                                  <th className="text-end">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td className="text-center">x{item.quantity}</td>
                                    <td className="text-end fw-semibold">{formatCurrency(item.totalPrice)}</td>
                                  </tr>
                                ))}
                                <tr className="border-top">
                                  <td colSpan="2" className="text-end pt-2 fw-bold">Grand Total:</td>
                                  <td className="text-end pt-2 fw-bold text-success">
                                    {formatCurrency(calculateOrderTotal(order.items))}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Order;