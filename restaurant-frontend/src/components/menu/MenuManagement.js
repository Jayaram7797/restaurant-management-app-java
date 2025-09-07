import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from "../../services/api";

const MenuManagement = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState({ name: "", description: "", price: "", category: "" });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await getAllMenuItems();
            setMenuItems(response.data);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentItem({ name: "", description: "", price: "", category: "" });
        setIsEditing(false);
    };

    const handleShowModal = (item = null) => {
        if (item) {
            setCurrentItem(item);
            setIsEditing(true);
        } else {
            setCurrentItem({ name: "", description: "", price: "", category: "" });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem({ ...currentItem, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateMenuItem(currentItem.id, currentItem);
            } else {
                await createMenuItem(currentItem);
            }
            handleCloseModal();
            fetchMenuItems();
        } catch (error) {
            console.error("Error saving menu item:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteMenuItem(id);
                fetchMenuItems();
            } catch (error) {
                console.error("Error deleting menu item:", error);
            }
        }
    };

    return (
        <div>
            <Row className="mb-3">
                <Col>
                    <h2>Menu Management</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="success" onClick={() => handleShowModal()}>
                        Add New Item
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.category}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleShowModal(item)}
                                >
                                    Edit
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? "Edit Menu Item" : "Add Menu Item"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={currentItem.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={currentItem.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                name="price"
                                value={currentItem.price}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                name="category"
                                value={currentItem.category}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MenuManagement;
