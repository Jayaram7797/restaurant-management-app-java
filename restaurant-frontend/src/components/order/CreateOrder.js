import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Button, Row, Col, ListGroup, Badge } from "react-bootstrap";
import { getAllMenuItems, createOrder } from "../../services/api";

const CreateOrder = () => {
    const { tableId } = useParams();
    const navigate = useNavigate();

    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await getAllMenuItems();
            setMenuItems(response.data);

            // Extract unique categories
            const uniqueCategories = [...new Set(response.data.map((item) => item.category))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        }
    };

    const handleAddToOrder = (menuItem) => {
        const existingItem = orderItems.find((item) => item.menuItem.id === menuItem.id);

        if (existingItem) {
            const updatedItems = orderItems.map((item) =>
                item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
            );
            setOrderItems(updatedItems);
        } else {
            setOrderItems([
                ...orderItems,
                {
                    menuItem: menuItem,
                    quantity: 1,
                    specialInstructions: "",
                },
            ]);
        }
    };

    const handleRemoveFromOrder = (menuItemId) => {
        const updatedItems = orderItems.filter((item) => item.menuItem.id !== menuItemId);
        setOrderItems(updatedItems);
    };

    const handleQuantityChange = (menuItemId, quantity) => {
        if (quantity < 1) return;

        const updatedItems = orderItems.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, quantity: parseInt(quantity) } : item
        );
        setOrderItems(updatedItems);
    };

    const handleSpecialInstructionsChange = (menuItemId, instructions) => {
        const updatedItems = orderItems.map((item) =>
            item.menuItem.id === menuItemId ? { ...item, specialInstructions: instructions } : item
        );
        setOrderItems(updatedItems);
    };

    const handleSubmitOrder = async () => {
        if (orderItems.length === 0) {
            alert("Please add items to the order");
            return;
        }

        setLoading(true);
        try {
            await createOrder(tableId, orderItems);
            alert("Order created successfully!");
            navigate("/orders");
        } catch (error) {
            console.error("Error creating order:", error);
            alert("Failed to create order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return orderItems.reduce((total, item) => {
            return total + item.menuItem.price * item.quantity;
        }, 0);
    };

    const filteredMenuItems =
        selectedCategory === "All" ? menuItems : menuItems.filter((item) => item.category === selectedCategory);

    return (
        <div>
            <h2>Create Order for Table #{tableId}</h2>

            <Row>
                <Col md={7}>
                    <Card className="mb-4">
                        <Card.Header>
                            <Row>
                                <Col>
                                    <h5 className="mb-0">Menu</h5>
                                </Col>
                                <Col xs="auto">
                                    <Form.Select
                                        size="sm"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="All">All Categories</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
                            <ListGroup>
                                {filteredMenuItems.map((item) => (
                                    <ListGroup.Item
                                        key={item.id}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <h6>{item.name}</h6>
                                            <small className="text-muted">{item.description}</small>
                                            <div>${item.price.toFixed(2)}</div>
                                            <Badge bg="info">{item.category}</Badge>
                                        </div>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => handleAddToOrder(item)}
                                        >
                                            Add to Order
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Current Order</h5>
                        </Card.Header>
                        <Card.Body>
                            {orderItems.length === 0 ? (
                                <p className="text-center text-muted">No items added to order yet</p>
                            ) : (
                                <ListGroup className="mb-3">
                                    {orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <div className="d-flex justify-content-between">
                                                <h6>{item.menuItem.name}</h6>
                                                <div>${(item.menuItem.price * item.quantity).toFixed(2)}</div>
                                            </div>

                                            <Row className="mt-2 align-items-center">
                                                <Col xs={6}>
                                                    <div className="d-flex align-items-center">
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.menuItem.id,
                                                                    item.quantity - 1
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </Button>
                                                        <Form.Control
                                                            size="sm"
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                handleQuantityChange(item.menuItem.id, e.target.value)
                                                            }
                                                            className="mx-2 text-center"
                                                            style={{ width: "50px" }}
                                                        />
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.menuItem.id,
                                                                    item.quantity + 1
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col xs={6} className="text-end">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleRemoveFromOrder(item.menuItem.id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Col>
                                            </Row>

                                            <Form.Group className="mt-2">
                                                <Form.Control
                                                    size="sm"
                                                    as="textarea"
                                                    rows={1}
                                                    placeholder="Special instructions"
                                                    value={item.specialInstructions}
                                                    onChange={(e) =>
                                                        handleSpecialInstructionsChange(
                                                            item.menuItem.id,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </Form.Group>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}

                            <div className="d-flex justify-content-between mb-3">
                                <h5>Total:</h5>
                                <h5>${calculateTotal().toFixed(2)}</h5>
                            </div>

                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    onClick={handleSubmitOrder}
                                    disabled={orderItems.length === 0 || loading}
                                >
                                    {loading ? "Creating Order..." : "Place Order"}
                                </Button>
                                <Button variant="outline-secondary" onClick={() => navigate("/tables")}>
                                    Cancel
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CreateOrder;
