import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DatabasePool } from "../db/pool";
import { RouteRepositoryImpl } from "../../adapters/outbound/postgres/RouteRepositoryImpl";
import { ComplianceBalanceRepositoryImpl } from "../../adapters/outbound/postgres/ComplianceBalanceRepositoryImpl";
import { BankEntryRepositoryImpl } from "../../adapters/outbound/postgres/BankEntryRepositoryImpl";
import { PoolRepositoryImpl } from "../../adapters/outbound/postgres/PoolRepositoryImpl";
import { RoutesController } from "../../adapters/inbound/http/routes/routesController";
import { ComplianceController } from "../../adapters/inbound/http/routes/complianceController";
import { BankingController } from "../../adapters/inbound/http/routes/bankingController";
import { PoolingController } from "../../adapters/inbound/http/routes/poolingController";
import { CompareRoutes } from "../../core/application/CompareRoutes";
import { CalculateComplianceBalance } from "../../core/application/CalculateComplianceBalance";
import { BankSurplus } from "../../core/application/BankSurplus";
import { ApplyBanked } from "../../core/application/ApplyBanked";
import { CreatePool } from "../../core/application/CreatePool";
import { createRoutes } from "../../adapters/inbound/http/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = new DatabasePool(
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/fuel_eu_db"
);

const routeRepository = new RouteRepositoryImpl(db);
const bankEntryRepository = new BankEntryRepositoryImpl(db);
const complianceBalanceRepository = new ComplianceBalanceRepositoryImpl(db, bankEntryRepository);
const poolRepository = new PoolRepositoryImpl(db);

const compareRoutes = new CompareRoutes();
const calculateComplianceBalance = new CalculateComplianceBalance();
const bankSurplus = new BankSurplus();
const applyBanked = new ApplyBanked();
const createPool = new CreatePool();

const routesController = new RoutesController(routeRepository, compareRoutes);
const complianceController = new ComplianceController(
  complianceBalanceRepository,
  routeRepository,
  calculateComplianceBalance
);
const bankingController = new BankingController(
  bankEntryRepository,
  complianceBalanceRepository,
  bankSurplus,
  applyBanked
);
const poolingController = new PoolingController(
  poolRepository,
  complianceBalanceRepository,
  createPool
);

app.use("/api", createRoutes(routesController, complianceController, bankingController, poolingController));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", async () => {
  await db.end();
  process.exit(0);
});

