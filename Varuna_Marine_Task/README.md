# Fuel EU Maritime Compliance Platform

A full-stack application for managing Fuel EU Maritime compliance, including route management, compliance balance calculations, banking, and pooling mechanisms.

## Architecture

This project follows **Hexagonal Architecture (Ports & Adapters)** principles:

### Backend Structure

```
backend/src/
  core/
    domain/          # Domain entities (Route, ComplianceBalance, etc.)
    application/     # Use cases (CalculateComplianceBalance, BankSurplus, etc.)
    ports/           # Interfaces (RouteRepository, ComplianceBalanceRepository, etc.)
  adapters/
    inbound/http/    # HTTP controllers and routes
    outbound/postgres/ # Database repository implementations
  infrastructure/
    db/              # Database setup, migrations, seeds
    server/          # Express server setup
```

### Frontend Structure

```
frontend/src/
  core/
    domain/          # Domain entities
    application/     # Use cases
    ports/           # Interfaces
  adapters/
    ui/              # React components
    infrastructure/  # API clients
```

## Setup & Run

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your database connection:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fuel_eu_db
PORT=3001
```

4. Create database:
```bash
createdb fuel_eu_db
```

5. Run migrations:
```bash
psql -d fuel_eu_db -f src/infrastructure/db/migrations/001_initial_schema.sql
```

6. Seed database:
```bash
npm run db:seed
```

7. Start development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## API Endpoints

### Routes
- `GET /api/routes` - Get all routes
- `POST /api/routes/:routeId/baseline` - Set baseline route
- `GET /api/routes/comparison` - Get route comparisons

### Compliance
- `GET /api/compliance/cb?shipId=SHIP001&year=2024` - Get compliance balance
- `GET /api/compliance/adjusted-cb?shipId=SHIP001&year=2024` - Get adjusted compliance balance

### Banking
- `GET /api/banking/records?shipId=SHIP001&year=2024` - Get bank records
- `POST /api/banking/bank` - Bank surplus
- `POST /api/banking/apply` - Apply banked surplus

### Pooling
- `POST /api/pools` - Create pool

## Key Formulas

- **Target Intensity (2025)**: 89.3368 gCO₂e/MJ
- **Energy in scope (MJ)**: fuelConsumption × 41,000 MJ/t
- **Compliance Balance**: (Target − Actual) × Energy in scope

## Documentation

- `AGENT_WORKFLOW.md` - Documentation of AI agent usage
- `REFLECTION.md` - Reflection on AI agent collaboration

## License

ISC

