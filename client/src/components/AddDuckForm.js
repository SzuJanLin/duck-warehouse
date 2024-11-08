import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const AddDuckForm = ({ onAddDuck, onEditDuck, initialDuck }) => {
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (initialDuck) {
      setColor(initialDuck.color);
      setSize(initialDuck.size);
      setPrice(initialDuck.price);
      setQuantity(initialDuck.quantity);
    } else {
      setColor('');
      setSize('');
      setPrice('');
      setQuantity('');
    }
  }, [initialDuck]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const duckData = {
      id: initialDuck ? initialDuck.id : null,
      color,
      size,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    };
    if (initialDuck) {
      onEditDuck(duckData);
    } else {
      onAddDuck(duckData);
    }

    setColor('');
    setSize('');
    setPrice('');
    setQuantity('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group as={Row} className="mb-3" controlId="formColor">
        <Form.Label column sm="3">Color</Form.Label>
        <Col sm="9">
          <Form.Control
            as="select"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
            disabled={!!initialDuck}
            style={{
              backgroundColor: initialDuck ? '#f0f0f0' : 'white',
              color: initialDuck ? 'grey' : 'black',
              cursor: initialDuck ? 'not-allowed' : 'auto'
            }}
          >
            <option value="">Select Color</option>
            <option value="Red">Red</option>
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
            <option value="Black">Black</option>
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formSize">
        <Form.Label column sm="3">Size</Form.Label>
        <Col sm="9">
          <Form.Control
            as="select"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            disabled={!!initialDuck}
            style={{
              backgroundColor: initialDuck ? '#f0f0f0' : 'white',
              color: initialDuck ? 'grey' : 'black',
              cursor: initialDuck ? 'not-allowed' : 'auto'
            }}
          >
            <option value="">Select Size</option>
            <option value="XLarge">XLarge</option>
            <option value="Large">Large</option>
            <option value="Medium">Medium</option>
            <option value="Small">Small</option>
            <option value="XSmall">XSmall</option>
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formPrice">
        <Form.Label column sm="3">Price</Form.Label>
        <Col sm="9">
          <Form.Control
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formQuantity">
        <Form.Label column sm="3">Quantity</Form.Label>
        <Col sm="9">
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </Col>
      </Form.Group>

      <Button type="submit" variant="primary" className="mt-3">
        {initialDuck ? 'Update Duck' : 'Add Duck'}
      </Button>
    </Form>
  );
};

export default AddDuckForm;
