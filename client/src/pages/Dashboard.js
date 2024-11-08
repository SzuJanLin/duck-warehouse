import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import AddDuckForm from '../components/AddDuckForm';
import { fetchDucks, addOrUpdateDuck, editDuck, deleteDuckListing } from '../services/warehouseService';

const Dashboard = () => {
  const [ducks, setDucks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingDuck, setEditingDuck] = useState(null); // State to hold the duck being edited
  const [selectedDeleteDuckId, setSelectedDeleteDuckId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const handleAddDuck = async (duckData) => {
    const updatedDuck = await addOrUpdateDuck(duckData);
    if (updatedDuck) {
      getDucks();
      setShowForm(false);
      setEditingDuck(null); // Clear editing state after save
    }
  };

  const handleEditDuck = async (duckData) => {
    const editedDuck = await editDuck(duckData);
    if (editedDuck) {
      setDucks((prevDucks) => {
        const existingDuckIndex = prevDucks.findIndex((duck) => duck.id === editedDuck.duck.id);
        if (existingDuckIndex >= 0) {
          const newDucks = [...prevDucks];
          newDucks[existingDuckIndex] = { ...newDucks[existingDuckIndex], ...duckData };
          return newDucks;
        } else {
          return [...prevDucks, editedDuck.duck];
        }
      });
      setShowForm(false);
      setEditingDuck(null); // Clear editing state after save
    }
  }

  const handleEdit = (duck) => {
    setEditingDuck(duck); // Set the duck to be edited
    setShowForm(true);     // Show the form for editing
  };



  const closeModal = () => {
    setShowForm(false);
    setEditingDuck(null);
  };


  const handleDeleteClick = (id) => {
    setSelectedDeleteDuckId(id);
    setShowDeleteModal(true); // Show delete confirmation modal
  };

  const confirmDelete = async () => {
    if (selectedDeleteDuckId) {
      
      const deletedDuck = await deleteDuckListing(selectedDeleteDuckId);
      if (deletedDuck) {
        setDucks((prevDucks) => prevDucks.filter((duck) => duck.id !== selectedDeleteDuckId));
      }
      setShowDeleteModal(false);
      setSelectedDeleteDuckId(null);
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDeleteDuckId(null);
  };

  const getDucks = async () => {
    try {
      const duckData = await fetchDucks();
      setDucks(duckData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch ducks');
      setLoading(false);
    }
  };

  useEffect(() => {

    getDucks();
  }, []);

  return (
    <Container>
      <Row className="mb-4">
        <Col xs="auto">
          <Button variant="primary" onClick={() => { setShowForm(true); setEditingDuck(null); }}>
            Add Duck
          </Button>
        </Col>
      </Row>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Color</th>
                <th>Size</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ducks.map((duck) => (
                <tr key={duck.id}>
                  <td>{duck.id}</td>
                  <td>{duck.color}</td>
                  <td>{duck.size}</td>
                  <td>${duck.price}</td>
                  <td>{duck.quantity}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleEdit(duck)} style={{ marginRight: '8px' }}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDeleteClick(duck.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showForm} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingDuck ? 'Edit Duck' : 'Add Duck'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddDuckForm onAddDuck={handleAddDuck} onEditDuck={handleEditDuck} initialDuck={editingDuck} />
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
