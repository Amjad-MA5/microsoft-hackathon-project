// Types describing the structured JSON contract returned by POST /api/optimize.
// Mirrors the "Detailed Schedule Output" schema documented in README.md.

export type ProjectStatus = "on-track" | "at-risk" | "delayed" | "completed";

export interface ProjectInfo {
  name: string;
  objective: string;
  description?: string;
  startDate: string; // ISO date, e.g. "2026-09-01"
  endDate: string;
  durationWeeks?: number;
  status: ProjectStatus;
  assumptions: string[];
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  completionCriteria: string[];
}

export type TaskStatus =
  | "unassigned"
  | "scheduled"
  | "in-progress"
  | "blocked"
  | "completed";

export type TaskPriority = "low" | "medium" | "high";

export interface WorkPeriod {
  date: string; // "2026-09-01"
  startTime: string; // "09:00"
  endTime: string; // "13:00"
}

export interface ScheduledTask {
  id: string;
  title: string;
  description: string;
  assignees: string[];
  requiredSkills: string[];
  startDate: string;
  endDate: string;
  workPeriods: WorkPeriod[];
  estimatedHours: number;
  scheduledHours: number;
  status: TaskStatus;
  priority: TaskPriority;
  dependencies: string[];
  criticalPath: boolean;
  rationale: string;
}

export interface ResourceUtilization {
  person: string;
  scheduledHours: number;
  availableHours: number;
  utilizationPercent: number;
  overCapacity: boolean;
}

export type RiskSeverity = "low" | "medium" | "high";
export type RiskProbability = "unlikely" | "possible" | "likely";

export interface Risk {
  description: string;
  severity: RiskSeverity;
  probability: RiskProbability;
  impact: string;
  owner: string;
  mitigation: string;
}

export interface ProjectPlan {
  project: ProjectInfo;
  milestones: Milestone[];
  tasks: ScheduledTask[];
  resources: ResourceUtilization[];
  risks: Risk[];
  unresolvedItems: string[];
  recommendations: string[];
  contextChanges: string[];
}

// Request body sent to POST /api/optimize.
export interface OptimizeRequest {
  taskDescription: string;
  dueDate: string; // ISO date, e.g. "2026-10-09"
}
