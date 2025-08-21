import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { validateCustomerData } from './utils/validation';

const app = express();

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP' }
});
app.use('/api/', limiter);

// This is where you'll start the Copilot demo

// Generate a REST API endpoint that validates customer data, normalizes names with Unicode support, and implements rate limiting and security best practices.

app.post('/api/customers', (req, res) => {
  const customerData = req.body;

  // Validate customer data
  const validationErrors = validateCustomerData(customerData);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  // Normalize names with Unicode support
  if (customerData.name) {
    customerData.name = customerData.name.normalize('NFC');
  }

  // Simulate saving to database
  // db.saveCustomer(customerData);

  res.status(201).json({ message: 'Customer created successfully', customer: customerData });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
