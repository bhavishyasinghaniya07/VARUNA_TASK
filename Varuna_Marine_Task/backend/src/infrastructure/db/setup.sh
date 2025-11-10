#!/bin/bash

set -e

echo "Setting up Fuel EU Database..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

DATABASE_URL=${DATABASE_URL:-"postgresql://postgres:postgres@localhost:5432/fuel_eu_db"}

# Extract database name from URL
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "Creating database $DB_NAME if it doesn't exist..."
psql -h localhost -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || psql -h localhost -U postgres -c "CREATE DATABASE $DB_NAME"

echo "Running migrations..."
psql $DATABASE_URL -f src/infrastructure/db/migrations/001_initial_schema.sql

echo "Seeding database..."
npm run db:seed

echo "Database setup complete!"

