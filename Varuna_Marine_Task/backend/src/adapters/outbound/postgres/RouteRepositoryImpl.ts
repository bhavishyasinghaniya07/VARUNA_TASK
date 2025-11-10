import { RouteRepository } from "../../../core/ports/RouteRepository";
import { Route } from "../../../core/domain/Route";
import { DatabasePool } from "../../../infrastructure/db/pool";

export class RouteRepositoryImpl implements RouteRepository {
  constructor(private db: DatabasePool) {}

  async findAll(): Promise<Route[]> {
    const result = await this.db.query("SELECT * FROM routes ORDER BY year, route_id");
    return result.rows.map(this.mapRowToRoute);
  }

  async findById(id: string): Promise<Route | null> {
    const result = await this.db.query("SELECT * FROM routes WHERE id = $1", [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToRoute(result.rows[0]);
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const result = await this.db.query("SELECT * FROM routes WHERE route_id = $1", [routeId]);
    if (result.rows.length === 0) return null;
    return this.mapRowToRoute(result.rows[0]);
  }

  async update(route: Route): Promise<Route> {
    await this.db.query(
      `UPDATE routes 
       SET vessel_type = $1, fuel_type = $2, year = $3, ghg_intensity = $4, 
           fuel_consumption = $5, distance = $6, total_emissions = $7, is_baseline = $8
       WHERE id = $9`,
      [
        route.vesselType,
        route.fuelType,
        route.year,
        route.ghgIntensity,
        route.fuelConsumption,
        route.distance,
        route.totalEmissions,
        route.isBaseline,
        route.id,
      ]
    );
    return route;
  }

  async create(route: Omit<Route, "id">): Promise<Route> {
    const result = await this.db.query(
      `INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        route.routeId,
        route.vesselType,
        route.fuelType,
        route.year,
        route.ghgIntensity,
        route.fuelConsumption,
        route.distance,
        route.totalEmissions,
        route.isBaseline,
      ]
    );
    return this.mapRowToRoute(result.rows[0]);
  }

  private mapRowToRoute(row: any): Route {
    return {
      id: row.id.toString(),
      routeId: row.route_id,
      vesselType: row.vessel_type,
      fuelType: row.fuel_type,
      year: row.year,
      ghgIntensity: parseFloat(row.ghg_intensity),
      fuelConsumption: parseFloat(row.fuel_consumption),
      distance: parseFloat(row.distance),
      totalEmissions: parseFloat(row.total_emissions),
      isBaseline: row.is_baseline,
    };
  }
}

