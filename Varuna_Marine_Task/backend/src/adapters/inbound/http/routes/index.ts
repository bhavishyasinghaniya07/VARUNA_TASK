import { Router } from "express";
import { RoutesController } from "./routesController";
import { ComplianceController } from "./complianceController";
import { BankingController } from "./bankingController";
import { PoolingController } from "./poolingController";

export function createRoutes(
  routesController: RoutesController,
  complianceController: ComplianceController,
  bankingController: BankingController,
  poolingController: PoolingController
): Router {
  const router = Router();

  router.get("/routes", (req, res) => routesController.getAllRoutes(req, res));
  router.post("/routes/:routeId/baseline", (req, res) => routesController.setBaseline(req, res));
  router.get("/routes/comparison", (req, res) => routesController.getComparison(req, res));

  router.get("/compliance/cb", (req, res) => complianceController.getComplianceBalance(req, res));
  router.get("/compliance/adjusted-cb", (req, res) => complianceController.getAdjustedComplianceBalance(req, res));

  router.get("/banking/records", (req, res) => bankingController.getBankRecords(req, res));
  router.post("/banking/bank", (req, res) => bankingController.bankSurplus(req, res));
  router.post("/banking/apply", (req, res) => bankingController.applyBanked(req, res));

  router.post("/pools", (req, res) => poolingController.createPool(req, res));

  return router;
}

