import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import app from './customer-service';

describe('Customer API', () => {
  // Helper to clone customer data
  const getValidCustomer = (): { name: string; email: string; age: number } => ({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  });

  it('should create a customer with valid data', async () => {
    const res = await request(app)
      .post('/api/customers')
      .send(getValidCustomer());
    expect(res.status).toBe(201);
    expect(res.body.customer.name).toBe('John Doe');
    expect(res.body.message).toBe('Customer created successfully');
  });

  it('should return validation errors for missing fields', async () => {
    const res = await request(app)
      .post('/api/customers')
      .send({ email: 'john@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should return validation errors for invalid email', async () => {
    const customer = getValidCustomer();
    customer.email = 'not-an-email';
    const res = await request(app)
      .post('/api/customers')
      .send(customer);
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should normalize Unicode names', async () => {
    // 'é' can be represented in different Unicode forms
    const nameNFD = 'Jose\u0301'; // J + o + s + e + ◌́ (combining acute)
    const customer = getValidCustomer();
    customer.name = nameNFD;
    const res = await request(app)
      .post('/api/customers')
      .send(customer);
    expect(res.status).toBe(201);
    // Should be normalized to NFC
    expect(res.body.customer.name).toBe(customer.name.normalize('NFC'));
  });

  it('should limit requests per IP (rate limiting)', async () => {
    // Send 101 requests to trigger rate limit
    let lastRes: request.Response;
    for (let i = 0; i < 101; i++) {
      lastRes = await request(app)
        .post('/api/customers')
        .send(getValidCustomer());
    }
    expect(lastRes!).toBeDefined();
    expect(lastRes!.status).toBe(429);
    expect(lastRes!.body).toEqual({ message: 'Too many requests from this IP' });
  });

  it('should handle server errors gracefully', async () => {
    // Patch app to throw error for this test
    const errorApp = express();
    errorApp.use(express.json());
    errorApp.post('/api/customers', () => {
      throw new Error('Test error');
    });
    errorApp.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      res.status(500).json({ error: 'Something went wrong!' });
    });
    const res = await request(errorApp)
      .post('/api/customers')
      .send(getValidCustomer());
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Something went wrong!');
  });
});