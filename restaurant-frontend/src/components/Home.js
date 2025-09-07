import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1 className="text-center mb-4">Restaurant Management System</h1>

            <Row className="mt-4">
                <Col md={4} className="mb-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Menu Management</Card.Title>
                            <Card.Text>
                                Add, edit, or delete menu items. Organize items by categories and set prices.
                            </Card.Text>
                            <Button as={Link} to="/menu" variant="primary">
                                Manage Menu
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Table Management</Card.Title>
                            <Card.Text>Manage restaurant tables, their capacity, and availability status.</Card.Text>
                            <Button as={Link} to="/tables" variant="primary">
                                Manage Tables
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Order Management</Card.Title>
                            <Card.Text>Create and manage orders, track their status, and process payments.</Card.Text>
                            <Button as={Link} to="/orders" variant="primary">
                                Manage Orders
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Home;
