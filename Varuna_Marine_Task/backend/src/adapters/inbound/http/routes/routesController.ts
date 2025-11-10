import { Request, Response } from "express";
import { RouteRepository } from "../../../../core/ports/RouteRepository";
import { CompareRoutes } from "../../../../core/application/CompareRoutes";

export class RoutesController {
  constructor(
    private routeRepository: RouteRepository,
    private compareRoutes: CompareRoutes
  ) {}

  async getAllRoutes(req: Request, res: Response) {
    try {
      const routes = await this.routeRepository.findAll();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  }

  async setBaseline(req: Request, res: Response) {
    try {
      const { routeId } = req.params;
      const route = await this.routeRepository.findByRouteId(routeId);
      
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }

      const allRoutes = await this.routeRepository.findAll();
      for (const r of allRoutes) {
        if (r.id === route.id) {
          r.isBaseline = true;
        } else {
          r.isBaseline = false;
        }
        await this.routeRepository.update(r);
      }

      res.json(route);
    } catch (error) {
      res.status(500).json({ error: "Failed to set baseline" });
    }
  }

  async getComparison(req: Request, res: Response) {
    try {
      const routes = await this.routeRepository.findAll();
      const comparisons = this.compareRoutes.execute(routes);
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: "Failed to get comparison" });
    }
  }
}

