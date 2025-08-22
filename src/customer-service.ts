import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { validateCustomerData, CustomerData } from './utils/validation';

const app = express();

// Environment validation
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = parseInt(process.env.PORT || '3000', 10);

if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  throw new Error('Invalid PORT environment variable');
}

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'test' ? 100 : 100, // Same limit for tests to ensure rate limiting works
  message: { message: 'Too many requests from this IP' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// This is where you'll start the Copilot demo

// Generate a REST API endpoint that validates customer data, normalizes names with Unicode support, and implements rate limiting and security best practices.

app.post('/api/customers', (req: Request, res: Response): Response => {
  const customerData: CustomerData = req.body;

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

  return res.status(201).json({ 
    message: 'Customer created successfully', 
    customer: customerData 
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response): Response => {
  return res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction): void => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req: Request, res: Response): void => {
  res.status(404).json({ error: 'Not found' });
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
