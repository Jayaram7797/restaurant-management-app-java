import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllTables, createTable, updateTable, deleteTable } from "../../services/api";

const TableManagement = () => {
    const [tables, setTables] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentTable, setCurrentTable] = useState({ tableNumber: "", capacity: "", occupied: false });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await getAllTables();
            setTables(response.data);
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentTable({ tableNumber: "", capacity: "", occupied: false });
        setIsEditing(false);
    };

    const handleShowModal = (table = null) => {
        if (table) {
            setCurrentTable(table);
            setIsEditing(true);
        } else {
            setCurrentTable({ tableNumber: "", capacity: "", occupied: false });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentTable({ ...currentTable, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCurrentTable({ ...currentTable, [name]: checked });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tableData = {
                ...currentTable,
                tableNumber: parseInt(currentTable.tableNumber),
                capacity: parseInt(currentTable.capacity),
            };

            if (isEditing) {
                await updateTable(currentTable.id, tableData);
            } else {
                await createTable(tableData);
            }
            handleCloseModal();
            fetchTables();
        } catch (error) {
            console.error("Error saving table:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this table?")) {
            try {
                await deleteTable(id);
                fetchTables();
            } catch (error) {
                console.error("Error deleting table:", error);
            }
        }
    };

    return (
        <div>
            <Row className="mb-3">
                <Col>
                    <h2>Table Management</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="success" onClick={() => handleShowModal()}>
                        Add New Table
                    </Button>
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Table Number</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tables.map((table) => (
                        <tr key={table.id}>
                            <td>{table.tableNumber}</td>
                            <td>{table.capacity}</td>
                            <td>
                                <Badge bg={table.occupied ? "danger" : "success"}>
                                    {table.occupied ? "Occupied" : "Available"}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleShowModal(table)}
                                >
                                    Edit
                                </Button>
                                {!table.occupied && (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        className="me-2"
                                        as={Link}
                                        to={`/create-order/${table.id}`}
                                    >
                                        Create Order
                                    </Button>
                                )}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(table.id)}>
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
                    <Modal.Title>{isEditing ? "Edit Table" : "Add Table"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Table Number</Form.Label>
                            <Form.Control
                                type="number"
                                name="tableNumber"
                                value={currentTable.tableNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacity"
                                value={currentTable.capacity}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        {isEditing && (
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    name="occupied"
                                    label="Occupied"
                                    checked={currentTable.occupied}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>
                        )}

                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default TableManagement;
