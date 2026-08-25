import type { OrganizationData } from "@/data/dummyData";
import type { OptimizeRequest, ProjectPlan, TaskPriority, TaskStatus } from "@/types/schedule";

type AgentResult = Record<string, unknown>;
type AgentMessage = { role: "system" | "user" | "assistant"; content: string };

function config() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured. Add it to .env.local and restart the development server.");
  return { apiKey, model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", endpoint: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1" };
}

async function runAgent(name: string, instruction: string, input: unknown): Promise<AgentResult> {
  const settings = config();
  const maxCompletionTokens = name === "Requirements Agent" ? 1200 : name === "Task Planning Agent" ? 2600 : name === "Validation Agent" ? 2200 : 4200;
  const requestBody = JSON.stringify({
    model: settings.model,
    temperature: 0.1,
    max_completion_tokens: maxCompletionTokens,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: `You are the ${name} in a sequential multi-agent project scheduling system. Return valid JSON only. Do not use markdown or commentary. Preserve all IDs, names, dates, times, skills, dependencies, and constraints from the input. Never invent employee availability.` },
      { role: "user", content: `${instruction}\n\nINPUT JSON:\n${JSON.stringify(input)}` },
    ] satisfies AgentMessage[],
  });
  let response: Response | undefined;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    response = await fetch(`${settings.endpoint.replace(/\/$/, "")}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${settings.apiKey}` }, body: requestBody });
    if (response.status !== 429 || attempt === 2) break;
    const retryAfter = Number(response.headers.get("retry-after"));
    const delayMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : (attempt + 1) * 5000;
    await new Promise((resolve) => setTimeout(resolve, Math.min(delayMs, 15000)));
  }
  if (!response) throw new Error(`OpenAI ${name} did not return a response.`);
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(`OpenAI ${name} failed (${response.status}): ${body?.error?.message ?? "Check the API key, model, and account access."}`);
  }
  const body = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new Error(`OpenAI ${name} returned an empty response.`);
  try {
    return parseAgentJson(content);
  } catch {
    const retryPayload = JSON.parse(requestBody) as { messages: AgentMessage[] };
    retryPayload.messages = [
      ...retryPayload.messages,
      { role: "assistant", content },
      { role: "user", content: "Your previous response was not valid JSON. Return the same result again as one complete JSON object only. Do not include markdown, explanations, or trailing text." },
    ];
    const retryResponse = await fetch(`${settings.endpoint.replace(/\/$/, "")}/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${settings.apiKey}` }, body: JSON.stringify({ ...retryPayload, max_completion_tokens: Math.min(maxCompletionTokens * 2, 8000) }) });
    if (!retryResponse.ok) throw new Error(`OpenAI ${name} returned invalid JSON and the repair request failed (${retryResponse.status}).`);
    const retryBody = (await retryResponse.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const retryContent = retryBody.choices?.[0]?.message?.content;
    if (!retryContent) throw new Error(`OpenAI ${name} returned an empty JSON repair response.`);
    try { return parseAgentJson(retryContent); } catch { throw new Error(`OpenAI ${name} returned invalid JSON after one repair attempt.`); }
  }
}

function parseAgentJson(content: string): AgentResult {
  const cleaned = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    const parsed = JSON.parse(cleaned) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as AgentResult;
  } catch {
    const start = cleaned.indexOf("{");
    if (start >= 0) {
      let depth = 0;
      let inString = false;
      let escaped = false;
      for (let index = start; index < cleaned.length; index += 1) {
        const character = cleaned[index];
        if (inString) {
          if (escaped) escaped = false;
          else if (character === "\\") escaped = true;
          else if (character === '"') inString = false;
        } else if (character === '"') {
          inString = true;
        } else if (character === "{") {
          depth += 1;
        } else if (character === "}") {
          depth -= 1;
          if (depth === 0) {
            const parsed = JSON.parse(cleaned.slice(start, index + 1)) as unknown;
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as AgentResult;
            break;
          }
        }
      }
    }
  }
  throw new Error("Invalid agent JSON");
}

function toProjectPlan(result: AgentResult): ProjectPlan {
  const wrapperNames = ["schedule", "projectPlan", "project_plan", "plan", "result", "output"];
  let raw = result;
  for (const wrapperName of wrapperNames) {
    const wrapped = raw[wrapperName];
    if (wrapped && typeof wrapped === "object" && !Array.isArray(wrapped)) {
      raw = wrapped as AgentResult;
      break;
    }
  }
  if (!Array.isArray(raw.tasks)) {
    const nested = findTasksObject(raw, 0);
    if (nested) raw = nested;
  }
  if (!Array.isArray(raw.tasks)) throw new Error("The Project Manager Agent did not return a tasks array.");
  const projectRaw = raw.project && typeof raw.project === "object" ? raw.project as AgentResult : {};
  const tasks = raw.tasks.map((value, index) => {
    const rawTask = value && typeof value === "object" ? value as AgentResult : {};
    const priority = String(rawTask.priority ?? "medium").toLowerCase();
    const status = String(rawTask.status ?? "unassigned").toLowerCase();
    const assignees = Array.isArray(rawTask.assignees) ? rawTask.assignees.map(String) : rawTask.assignee ? [String(rawTask.assignee)] : [];
    const normalizedPriority: TaskPriority = priority === "high" || priority === "low" ? priority : "medium";
    const normalizedStatus: TaskStatus = ["unassigned", "scheduled", "in-progress", "blocked", "completed"].includes(status) ? status as TaskStatus : assignees.length ? "scheduled" : "unassigned";
    return {
      id: String(rawTask.id ?? `task-${index + 1}`),
      title: String(rawTask.title ?? rawTask.name ?? `Task ${index + 1}`),
      description: String(rawTask.description ?? rawTask.deliverable ?? ""),
      assignees,
      requiredSkills: Array.isArray(rawTask.requiredSkills) ? rawTask.requiredSkills.map(String) : Array.isArray(rawTask.skillsRequired) ? rawTask.skillsRequired.map(String) : [],
      startDate: String(rawTask.startDate ?? ""),
      endDate: String(rawTask.endDate ?? ""),
      workPeriods: Array.isArray(rawTask.workPeriods) ? rawTask.workPeriods : [],
      estimatedHours: Number(rawTask.estimatedHours ?? rawTask.effort ?? 0),
      scheduledHours: Number(rawTask.scheduledHours ?? rawTask.effort ?? 0),
      status: normalizedStatus,
      priority: normalizedPriority,
      dependencies: Array.isArray(rawTask.dependencies) ? rawTask.dependencies.map(String) : [],
      criticalPath: Boolean(rawTask.criticalPath),
      rationale: String(rawTask.rationale ?? "Assignment selected by the scheduling agents."),
    };
  });
  const status = String(projectRaw.status ?? "at-risk").toLowerCase();
  return {
    project: {
      name: String(projectRaw.name ?? "Inventory Management MVP"),
      objective: String(projectRaw.objective ?? projectRaw.description ?? "Deliver the project objective"),
      description: projectRaw.description ? String(projectRaw.description) : undefined,
      startDate: String(projectRaw.startDate ?? tasks[0]?.startDate ?? ""),
      endDate: String(projectRaw.endDate ?? tasks.at(-1)?.endDate ?? ""),
      durationWeeks: projectRaw.durationWeeks == null ? undefined : Number(projectRaw.durationWeeks),
      status: ["on-track", "at-risk", "delayed", "completed"].includes(status) ? status as "on-track" | "at-risk" | "delayed" | "completed" : "at-risk",
      assumptions: Array.isArray(projectRaw.assumptions) ? projectRaw.assumptions.map(String) : [],
    },
    milestones: Array.isArray(raw.milestones) ? raw.milestones as ProjectPlan["milestones"] : [],
    tasks,
    resources: Array.isArray(raw.resources) ? raw.resources as ProjectPlan["resources"] : [],
    risks: Array.isArray(raw.risks) ? raw.risks as ProjectPlan["risks"] : [],
    unresolvedItems: Array.isArray(raw.unresolvedItems) ? raw.unresolvedItems.map(String) : [],
    recommendations: Array.isArray(raw.recommendations) ? raw.recommendations.map(String) : [],
    contextChanges: Array.isArray(raw.contextChanges) ? raw.contextChanges.map(String) : [],
  };
}

function findTasksObject(value: unknown, depth: number): AgentResult | null {
  if (depth > 3 || !value || typeof value !== "object" || Array.isArray(value)) return null;
  const object = value as AgentResult;
  if (Array.isArray(object.tasks)) return object;
  for (const child of Object.values(object)) {
    const nested = findTasksObject(child, depth + 1);
    if (nested) return nested;
  }
  return null;
}

export async function generateProjectPlan(input: OptimizeRequest, organization: OrganizationData): Promise<ProjectPlan> {
  const requirements = await runAgent("Requirements Agent", "Extract the project objective, requested due date, start date, success criteria, constraints, assumptions, and context changes. Do not create tasks or assignments.", input);
  const taskPlan = await runAgent("Task Planning Agent", "Break the request into a complete, realistic set of tasks and milestones. Include stable IDs, descriptions, required skills, effort estimates in hours, priority, dependencies, acceptance criteria, and critical-path candidates. Do not assign employees or dates.", { input, requirements });
  const resources = await runAgent("Resource Matching Agent", "For every task, recommend one or more qualified employees. Compare all skills, roles, seniority, existing project commitments, planned leave, and every availability slot. If one person cannot cover the effort, recommend multiple contributors and explain the split. Use only employee names and data provided.", { taskPlan, organization });
  const schedule = await runAgent("Scheduling Agent", "Create a detailed schedule from the task plan and resource recommendations. Preserve every task ID and dependency. Assign one or more employees per task when needed. Put the responsible employee on each workPeriods entry, use exact dates and times from availability, exclude planned leave, respect daily workload limits, and ensure scheduledHours equals the sum of work periods. Include project, milestones, tasks, resources, risks, recommendations, and contextChanges.", { input, requirements, taskPlan, resources, organization });
  const validation = await runAgent("Validation Agent", "Audit the proposed schedule for skill matches, exact availability, planned leave, overlapping work, daily limits, dependencies, effort totals, assignments, dates, and deadline. Return valid, errors, warnings, and exact repairs. Do not silently accept missing assignees or zero-hour scheduled tasks.", { schedule, taskPlan, organization });
  const report = await runAgent("Project Manager Agent", "Produce the final ProjectPlan JSON for the UI. Repair issues identified by validation. Preserve exactly the task IDs, titles, dependencies, estimates, and task count from taskPlan. Every task must include assignees, requiredSkills, startDate, endDate, workPeriods, estimatedHours, scheduledHours, status, priority, dependencies, criticalPath, and rationale. Use multiple assignees and per-period ownership when work is split. Include project assumptions, milestones, resources, risks with probability/impact/owner/mitigation, unresolvedItems, recommendations, and contextChanges.", { input, requirements, taskPlan, resources, schedule, validation, organization });
  return toProjectPlan(report);
}
