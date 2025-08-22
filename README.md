# Demo Customer API Service

This is a demo customer API service for GitHub Enterprise Platform showcase.

## Features

- Customer data validation with TypeScript interfaces
- Unicode normalization for customer names
- Rate limiting and security best practices
- Comprehensive test coverage
- ESLint and TypeScript configuration
- GitHub Actions CI/CD pipeline

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run tests:

   ```bash
   npm test
   ```

3. Run with coverage:

   ```bash
   npm run test:coverage
   ```

4. Lint code:

   ```bash
   npm run lint
   ```

5. Build for production:

   ```bash
   npm run build
   ```

6. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

### POST /api/customers

Creates a new customer with validation and Unicode normalization.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

**Response:**

```json
{
  "message": "Customer created successfully",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com", 
    "age": 30
  }
}
```

## Security Features

- Helmet for security headers
- Rate limiting (100 requests per 15 minutes)
- Input validation
- Unicode normalization
- Error handling

## Development

This project uses:

- TypeScript for type safety
- ESLint for code quality
- Jest for testing
- Express.js for the web framework
- GitHub Actions for CI/CD
