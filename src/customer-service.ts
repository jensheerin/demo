import express from 'express';
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
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// This is where you'll start the Copilot demo
// Add comment: "// Generate a REST API endpoint that validates customer data, normalizes names with Unicode support, and implements rate limiting"

export default app;
