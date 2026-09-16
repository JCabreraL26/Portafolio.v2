// ─────────────────────────────────────────────────────────────
// FAIR v3.1 Core Data Types
// Portado desde CyberQRM (shared/types/fair.ts), commit b074b3d.
// Subconjunto usado por convex/lib/fairEngine.ts — sin tipos de Portfolio/Control,
// que no son consumidos por el motor de simulación.
// ─────────────────────────────────────────────────────────────

export type DistributionType = "triangular" | "lognormal" | "point";

export type ScenarioStatus = "draft" | "active" | "archived";

export type ImpactComponentType = "confidentiality" | "integrity" | "availability" | "other";

// ─── Distribution Parameter Shapes ───────────────────────────

export interface TriangularParams {
  min: number;
  mode: number;
  max: number;
}

export interface LognormalParams {
  median: number;
  percentile90: number;
}

export interface PointParams {
  value: number;
}

// ─── MITRE ATT&CK (opcional, no usado en el diagnóstico GRC) ─

export interface AttackTechniqueRef {
  techniqueId: string;
  name: string;
  tactics: string[];
  rationale?: string;
  implementedMitigations?: string[];
}

// ─── Multi-Basis Asset Valuation ─────────────────────────────

export type ValuationBasis =
  | "replacement_cost"
  | "revenue_impact"
  | "regulatory_exposure"
  | "business_interruption"
  | "reputational"
  | "custom";

export interface ValuationEntry {
  id: string;
  basis: ValuationBasis;
  customBasisLabel?: string;
  description?: string;
  distributionType: DistributionType;
  parameters: TriangularParams | LognormalParams | PointParams;
  notes?: string;
}

// ─── Primary / Secondary Loss ─────────────────────────────────

export type PrimaryLossForm = "productivity" | "response" | "replacement" | "other";
export type SecondaryLossForm = "competitive_advantage" | "fines_judgements" | "reputation" | "other";

export interface LossComponent {
  id: string;
  form: PrimaryLossForm | SecondaryLossForm;
  customLabel?: string;
  description?: string;
  distributionType: DistributionType;
  parameters: TriangularParams | LognormalParams | PointParams;
  notes?: string;
}

export interface SlefDistribution {
  distributionType: DistributionType;
  parameters: TriangularParams | LognormalParams | PointParams;
}

// ─── FAIR Components ─────────────────────────────────────────

export interface ThreatEventFrequency {
  id: string;
  scenarioId: string;
  name: string;
  description: string;
  distributionType: DistributionType;
  parameters: TriangularParams | LognormalParams | PointParams;
  unitLabel: string;
  notes: string;
  attackTechniques?: AttackTechniqueRef[];
}

export interface Vulnerability {
  id: string;
  scenarioId: string;
  name: string;
  description: string;
  distributionType: DistributionType;
  parameters: TriangularParams | LognormalParams | PointParams;
  unitLabel: string;
  relatedControls: Array<{
    controlId: string;
    controlName: string;
    estimatedEffectiveness: number;
  }>;
  notes: string;
  attackTechniques?: AttackTechniqueRef[];
}

export interface AssetValue {
  id: string;
  scenarioId: string;
  name: string;
  description: string;
  distributionType: DistributionType;
  parameters: TriangularParams | PointParams;
  unitLabel: string;
  valuationBasis: string;
  notes: string;
  // Modo avanzado multi-basis
  useMultipleBases?: boolean;
  valuationBases?: ValuationEntry[];
}

export interface LossEventImpact {
  id: string;
  scenarioId: string;
  name: string;
  description: string;
  distributionType: DistributionType;
  parameters: TriangularParams | PointParams;
  unitLabel: string;
  impactComponents: Array<{
    type: ImpactComponentType;
    description: string;
    estimatedImpact: number;
  }>;
  notes: string;
  // Modo avanzado primary/secondary loss
  useAdvancedLoss?: boolean;
  primaryLossComponents?: LossComponent[];
  slef?: SlefDistribution;
  secondaryLossEnabled?: boolean;
  secondaryLossComponents?: LossComponent[];
}

// ─── Simulation ───────────────────────────────────────────────

export interface SimulationConfig {
  iterations: number;
  randomSeed?: number;
  confidenceIntervals: number[];
}

export interface PercentileMap {
  "10": number;
  "25": number;
  "50": number;
  "75": number;
  "90": number;
  "95": number;
  "99": number;
}

export interface ConfidenceIntervalMap {
  "90": { lower: number; upper: number };
  "95": { lower: number; upper: number };
}

export interface SimulationStatistics {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  percentiles: PercentileMap;
  confidenceIntervals: ConfidenceIntervalMap;
}

export interface ConvergenceMetrics {
  meanStabilized: boolean;
  iterationsNeeded: number;
}

export interface SimulationResults {
  id: string;
  scenarioId: string;
  runAt: string;
  status: "pending" | "running" | "complete" | "error";
  statistics: SimulationStatistics;
  rawSamples: number[];
  convergenceMetrics: ConvergenceMetrics;
  simulationConfig: SimulationConfig;
}

// ─── Risk Scenario ────────────────────────────────────────────

export interface RiskScenario {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  assetDescription: string;
  businessContext: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: ScenarioStatus;
  threatEventFrequency?: ThreatEventFrequency;
  vulnerability?: Vulnerability;
  assetValue?: AssetValue;
  lossEventImpact?: LossEventImpact;
  simulationConfig: SimulationConfig;
  latestSimulation?: SimulationResults;
}

// ─── Sensitivity Analysis ─────────────────────────────────────

export type FAIRComponentKey = "tef" | "vulnerability" | "assetValue" | "lei";

export interface SensitivityResult {
  parameterName: string;
  parameterKey: FAIRComponentKey;
  baseALE: number;
  lowerALE: number;
  upperALE: number;
  lowerImpactPercent: number;
  upperImpactPercent: number;
}
