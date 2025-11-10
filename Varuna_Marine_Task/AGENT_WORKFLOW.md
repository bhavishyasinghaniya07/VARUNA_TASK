# AI Agent Workflow Log

## Agents Used

- **Cursor Agent** (Primary): Used for code generation, refactoring, and architectural decisions
- **GitHub Copilot** (Secondary): Used for inline code completions and boilerplate generation

## Prompts & Outputs

### Example 1: Domain Entity Creation

**Prompt:**
```
Create domain entities for Route, ComplianceBalance, BankEntry, and Pool following hexagonal architecture principles.
```

**Output:**
The agent generated clean domain entities with proper TypeScript types:
- `Route.ts` with VesselType and FuelType enums
- `ComplianceBalance.ts` with base and adjusted variants
- `BankEntry.ts` for banking operations
- `Pool.ts` for pooling mechanisms

**Validation:**
- Verified type safety and proper separation of concerns
- Ensured no framework dependencies in domain layer
- Added proper interfaces for extended types

### Example 2: Use Case Implementation

**Prompt:**
```
Implement CalculateComplianceBalance use case with the formula: CB = (Target - Actual) × Energy, where Energy = fuelConsumption × 41,000 MJ/t
```

**Output:**
The agent generated the use case class with proper calculation logic:
```typescript
export class CalculateComplianceBalance {
  execute(routes: Route[], shipId: string, year: number): ComplianceBalance {
    // Calculation logic with weighted average for multiple routes
  }
}
```

**Corrections Made:**
- Fixed energy calculation to use proper constant (41,000 MJ/t)
- Added weighted average calculation for multiple routes
- Converted result from g CO₂eq to tonnes CO₂eq (divided by 1,000,000)

### Example 3: Repository Implementation

**Prompt:**
```
Create PostgreSQL repository implementations for RouteRepository, ComplianceBalanceRepository, BankEntryRepository, and PoolRepository.
```

**Output:**
The agent generated repository implementations with:
- Proper SQL queries
- Row-to-domain mapping
- Error handling

**Corrections Made:**
- Fixed database pool import (changed from `Pool` to `PgPool` to avoid naming conflict)
- Added proper type conversions for decimal values
- Implemented proper transaction handling for pool creation

### Example 4: React Component Generation

**Prompt:**
```
Create React components for Routes, Compare, Banking, and Pooling tabs with TailwindCSS styling.
```

**Output:**
The agent generated comprehensive React components with:
- Proper state management
- API integration
- Error handling
- Responsive design

**Corrections Made:**
- Fixed API client imports
- Added proper loading states
- Implemented proper error handling with user-friendly messages
- Added validation for user inputs

### Example 5: Pooling Logic Implementation

**Prompt:**
```
Implement pooling logic that validates: sum of CB >= 0, deficit ships cannot exit worse, surplus ships cannot exit negative.
```

**Output:**
The agent generated pooling logic with:
- Greedy allocation algorithm
- Validation rules
- Proper error handling

**Corrections Made:**
- Fixed allocation algorithm to properly transfer surplus to deficits
- Added proper validation for pool creation
- Ensured deficit ships don't exit worse and surplus ships don't exit negative

## Validation / Corrections

### Database Setup
- **Issue**: Initial seed file had incorrect import syntax
- **Fix**: Changed from `require` to `import` statements
- **Validation**: Verified database connection and seed data insertion

### Type Safety
- **Issue**: Some TypeScript types were too loose (`any`)
- **Fix**: Added proper type definitions and interfaces
- **Validation**: Enabled strict mode in tsconfig.json

### API Integration
- **Issue**: Frontend API clients had incorrect endpoint paths
- **Fix**: Standardized API paths and added proper error handling
- **Validation**: Tested all API endpoints with sample data

### Compliance Balance Calculation
- **Issue**: Initial calculation didn't account for multiple routes
- **Fix**: Implemented weighted average calculation based on energy consumption
- **Validation**: Verified calculations against FuelEU regulation formulas

## Observations

### Where Agent Saved Time

1. **Boilerplate Generation**: Agent quickly generated repository implementations, API clients, and React components, saving ~40% of development time
2. **Architecture Setup**: Agent helped establish hexagonal architecture structure consistently across both frontend and backend
3. **Type Definitions**: Agent generated comprehensive TypeScript types and interfaces, ensuring type safety
4. **Error Handling**: Agent suggested proper error handling patterns and validation logic

### Where It Failed or Hallucinated

1. **Database Pool Import**: Agent initially used incorrect import syntax for PostgreSQL Pool class
2. **Energy Calculation**: Initial implementation didn't convert units properly (g CO₂eq vs t CO₂eq)
3. **Pool Allocation**: First version of pooling logic had incorrect allocation algorithm that didn't properly distribute surplus
4. **API Endpoints**: Some endpoint paths were inconsistent between frontend and backend

### How Tools Were Combined Effectively

1. **Cursor Agent for Architecture**: Used Cursor Agent for high-level architectural decisions and structure
2. **Copilot for Boilerplate**: Used GitHub Copilot for inline completions and repetitive code patterns
3. **Manual Review for Logic**: Manually reviewed and corrected business logic, especially for compliance calculations
4. **Iterative Refinement**: Used agent suggestions as starting points and refined them through multiple iterations

## Best Practices Followed

1. **Hexagonal Architecture**: Strictly maintained separation between core domain, application, and adapters
2. **Type Safety**: Used TypeScript strict mode and proper type definitions throughout
3. **Error Handling**: Implemented proper error handling at all layers (domain, application, adapters)
4. **Testing**: Created unit tests for core use cases (CalculateComplianceBalance, CompareRoutes)
5. **Documentation**: Maintained clear documentation of AI agent usage and architectural decisions
6. **Incremental Development**: Built features incrementally, testing at each step
7. **Code Review**: Reviewed all agent-generated code for correctness and adherence to requirements

## Lessons Learned

1. **Verify Agent Output**: Always verify agent-generated code, especially for business logic and calculations
2. **Test Early**: Write tests alongside development to catch issues early
3. **Document Decisions**: Document architectural decisions and AI agent usage for future reference
4. **Iterate**: Use agents as starting points and refine through multiple iterations
5. **Combine Tools**: Use multiple AI tools (Cursor Agent, Copilot) for different tasks to maximize efficiency

