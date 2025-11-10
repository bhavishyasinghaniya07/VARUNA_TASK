# Fuel EU Backend

Backend API for Fuel EU Maritime compliance platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fuel_eu_db
PORT=3001
```

3. Create database:
```bash
createdb fuel_eu_db
```

4. Run migrations:
```bash
psql -d fuel_eu_db -f src/infrastructure/db/migrations/001_initial_schema.sql
```

5. Seed database:
```bash
npm run db:seed
```

6. Start server:
```bash
npm run dev
```

## Testing

```bash
npm test
```

## API Endpoints

See main README.md for API documentation.

## Architecture

This backend follows hexagonal architecture:
- `core/domain` - Domain entities
- `core/application` - Use cases
- `core/ports` - Interfaces
- `adapters/inbound/http` - HTTP controllers
- `adapters/outbound/postgres` - Database repositories
- `infrastructure` - Database and server setup

