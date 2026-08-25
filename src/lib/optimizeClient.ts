import type { OptimizeRequest, ProjectPlan, ScheduledTask } from "@/types/schedule";

/**
 * Thrown when POST /api/optimize responds with a non-2xx status or a body
 * that does not satisfy the ProjectPlan contract.
 */
export class OptimizeRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "OptimizeRequestError";
    this.status = status;
  }
}

function isScheduledTask(value: unknown): value is ScheduledTask {
  if (typeof value !== "object" || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    Array.isArray(task.assignees) &&
    Array.isArray(task.workPeriods) &&
    typeof task.estimatedHours === "number"
  );
}

/**
 * Minimal runtime validation that the parsed JSON matches the ProjectPlan
 * shape closely enough to render safely. Not exhaustive by design — the
 * backend is the source of truth for deep validation.
 */
function isProjectPlan(value: unknown): value is ProjectPlan {
  if (typeof value !== "object" || value === null) return false;
  const plan = value as Record<string, unknown>;
  return (
    typeof plan.project === "object" &&
    plan.project !== null &&
    Array.isArray(plan.tasks) &&
    plan.tasks.every(isScheduledTask) &&
    Array.isArray(plan.milestones) &&
    Array.isArray(plan.resources) &&
    Array.isArray(plan.risks)
  );
}

/**
 * Calls the backend optimizer endpoint and returns a validated ProjectPlan.
 * Throws OptimizeRequestError on HTTP failure or a malformed response body.
 */
export async function requestOptimizedPlan(
  input: OptimizeRequest,
  signal?: AbortSignal
): Promise<ProjectPlan> {
  const response = await fetch("/api/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    let message = `Optimizer request failed (${response.status})`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // Response body wasn't JSON; keep the default message.
    }
    throw new OptimizeRequestError(message, response.status);
  }

  const data: unknown = await response.json();
  if (!isProjectPlan(data)) {
    throw new OptimizeRequestError(
      "Optimizer response did not match the expected schedule format.",
      response.status
    );
  }

  return data;
}
