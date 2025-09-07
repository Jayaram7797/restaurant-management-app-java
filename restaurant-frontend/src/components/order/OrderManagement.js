import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Card } from "react-bootstrap";
import { getAllOrders, updateOrderStatus, getOrderById } from "../../services/api";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
        // Refresh orders every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            const response = await getOrderById(orderId);
            setSelectedOrder(response.data);
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();

            // If we're viewing this order's details, refresh them
            if (selectedOrder && selectedOrder.id === orderId) {
                const response = await getOrderById(orderId);
                setSelectedOrder(response.data);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const getStatusBadge = (status) => {
        let variant;
        switch (status) {
            case "PENDING":
                variant = "warning";
                break;
            case "PREPARING":
                variant = "info";
                break;
            case "READY":
                variant = "primary";
                break;
            case "DELIVERED":
                variant = "success";
                break;
            case "PAID":
                variant = "dark";
                break;
            default:
                variant = "secondary";
        }
        return <Badge bg={variant}>{status}</Badge>;
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case "PENDING":
                return "PREPARING";
            case "PREPARING":
                return "READY";
            case "READY":
                return "DELIVERED";
            case "DELIVERED":
                return "PAID";
            default:
                return null;
        }
    };

    return (
        <div className="row">
            <div className={selectedOrder ? "col-md-7" : "col-md-12"}>
                <h2>Order Management</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Table</th>
                            <th>Time</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const nextStatus = getNextStatus(order.status);
                            return (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.table.tableNumber}</td>
                                    <td>{new Date(order.orderTime).toLocaleString()}</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleViewDetails(order.id)}
                                        >
                                            Details
                                        </Button>
                                        {nextStatus && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleStatusUpdate(order.id, nextStatus)}
                                            >
                                                {nextStatus === "PAID" ? "Mark Paid" : `Mark ${nextStatus}`}
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>

            {selectedOrder && (
                <div className="col-md-5">
                    <Card>
                        <Card.Header>
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Order #{selectedOrder.id} Details</h5>
                                <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(null)}>
                                    Close
                                </Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                <strong>Table:</strong> {selectedOrder.table.tableNumber}
                                <br />
                                <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}
                                <br />
                                <strong>Order Time:</strong> {new Date(selectedOrder.orderTime).toLocaleString()}
                                <br />
                                <strong>Total Amount:</strong> ${selectedOrder.totalAmount.toFixed(2)}
                            </p>

                            <h6>Items:</h6>
                            <Table size="sm">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.orderItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.menuItem.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.menuItem.price.toFixed(2)}</td>
                                            <td>${(item.quantity * item.menuItem.price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {selectedOrder.status !== "PAID" && getNextStatus(selectedOrder.status) && (
                                <Button
                                    variant="primary"
                                    className="mt-3"
                                    onClick={() =>
                                        handleStatusUpdate(selectedOrder.id, getNextStatus(selectedOrder.status))
                                    }
                                >
                                    {getNextStatus(selectedOrder.status) === "PAID"
                                        ? "Mark as Paid"
                                        : `Mark as ${getNextStatus(selectedOrder.status)}`}
                                </Button>
                            )}
                        </Card.Body>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
