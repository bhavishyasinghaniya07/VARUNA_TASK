CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  route_id VARCHAR(50) UNIQUE NOT NULL,
  vessel_type VARCHAR(50) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  ghg_intensity DECIMAL(10, 4) NOT NULL,
  fuel_consumption DECIMAL(10, 2) NOT NULL,
  distance DECIMAL(10, 2) NOT NULL,
  total_emissions DECIMAL(10, 2) NOT NULL,
  is_baseline BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ship_compliance (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  cb_gco2eq DECIMAL(15, 4) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ship_id, year)
);

CREATE TABLE IF NOT EXISTS bank_entries (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq DECIMAL(15, 4) NOT NULL,
  applied_amount_gco2eq DECIMAL(15, 4) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bank_applications (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq DECIMAL(15, 4) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pools (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pool_members (
  id SERIAL PRIMARY KEY,
  pool_id INTEGER NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  ship_id VARCHAR(50) NOT NULL,
  cb_before DECIMAL(15, 4) NOT NULL,
  cb_after DECIMAL(15, 4) NOT NULL
);

CREATE INDEX idx_routes_year ON routes(year);
CREATE INDEX idx_routes_vessel_type ON routes(vessel_type);
CREATE INDEX idx_routes_fuel_type ON routes(fuel_type);
CREATE INDEX idx_ship_compliance_ship_year ON ship_compliance(ship_id, year);
CREATE INDEX idx_bank_entries_ship_year ON bank_entries(ship_id, year);
CREATE INDEX idx_bank_applications_ship_year ON bank_applications(ship_id, year);

