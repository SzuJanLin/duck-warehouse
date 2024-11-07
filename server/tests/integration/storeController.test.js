process.env.NODE_ENV = 'test';
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../..';
import Duck from '../../models/Duck';
import connectDB from '../../config/db';

// Mock data for testing
const validDuck = {
  color: 'Yellow',
  size: 'Large',
  price: 10,
  quantity: 2000,
};

const validDuck2 = {
    color: 'Red',
    size: 'Large',
    price: 10,
    quantity: 500,
  };

const validOrder = {
  color: 'Yellow',
  size: 'Large',
  quantity: 100,
  destinationCountry: 'USA',
  shippingMode: 'Air',
};

const insufficientOrder = {
    color: 'Red',
    size: 'Large',
    quantity: 100,
    destinationCountry: 'USA',
    shippingMode: 'Air',
}

// // Connect to a test database before tests and clear after
beforeAll(async () => {
    connectDB();

});

beforeEach(async () => {
    await Duck.create(validDuck);
    await Duck.create(validDuck2);
})

afterEach(async () => {
    await mongoose.connection.dropDatabase();
})

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /api/store/order', () => {

/**
Basic Functional Test Cases
*  */ 

//happy path
  it('should successfully create an order with valid data', async () => {
    const response = await request(app)
      .post('/api/store/order')
      .send(validOrder);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Order Successfully Placed');
    expect(response.body.details.total_pay).toBeDefined();
  });


/**
 * Boundary Conditions
 */
  // Missing required fields
  it('should return 400 error for missing fields', async () => {
    const response = await request(app)
      .post('/api/store/order')
      .send({ color: 'Yellow' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('All fields are required');
  });

  // Invalid shipping mode
  it('should return 400 error for an invalid shipping mode', async () => {
    const invalidShippingModeOrder = { ...validOrder, shippingMode: 'Space' };
    const response = await request(app)
      .post('/api/store/order')
      .send(invalidShippingModeOrder);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid shipping mode');
  });

  // Insufficient duck quantity
  it('should return 400 error for insufficient quantity in stock', async () => {
    const largeOrder = { ...insufficientOrder, quantity: 1000 };
    const response = await request(app)
      .post('/api/store/order')
      .send(largeOrder);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Insufficient quantity available');
  });

  // Duck not found
  it('should return 404 error if the specified duck color and size are not found', async () => {
    const missingDuckOrder = { ...validOrder, color: 'Blue' };
    const response = await request(app)
      .post('/api/store/order')
      .send(missingDuckOrder);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Duck with specified color and size not found');
  });

  // Different destination country surcharge
  it('should calculate correct surcharge for Bolivia as destination country', async () => {
    const orderForBolivia = { ...validOrder, destinationCountry: 'Bolivia' };
    const response = await request(app)
      .post('/api/store/order')
      .send(orderForBolivia);

    expect(response.status).toBe(200);
    expect(response.body.details.total_pay).toBeDefined();
    expect(response.body.details.increments).toBeDefined(); // Check surcharge details
  });

  // Air shipping with large quantity
  it('should apply discount for large quantity air shipping (over 1000 units)', async () => {
    const largeAirOrder = { ...validOrder, quantity: 1500 };
    const response = await request(app)
      .post('/api/store/order')
      .send(largeAirOrder);
    // console.log(response);
    expect(response.status).toBe(200);
    expect(response.body.details.total_pay).toBe(53118);
  })




});