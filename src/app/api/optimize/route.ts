// TEMPORARY MOCK — for local frontend testing only.
// Delete this file once the real /api/optimize backend (LLM-backed) is in place.
// Returns static, hard-coded data matching the ProjectPlan contract in
// src/types/schedule.ts so the UI (form -> summary -> tasks -> calendar) can
// be exercised end-to-end without a live backend or LLM key.

import type { OptimizeRequest, ProjectPlan } from "@/types/schedule";

function buildMockPlan(input: OptimizeRequest): ProjectPlan {
  return {
    project: {
      name: input.taskDescription.slice(0, 60),
      objective: input.taskDescription,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: input.dueDate,
      durationWeeks: 2,
      status: "on-track",
      assumptions: [
        "This response is mock data for local frontend testing only.",
      ],
    },
    milestones: [
      {
        id: "m1",
        name: "Requirements finalized",
        date: input.dueDate,
        completionCriteria: ["Stakeholders sign off on scope"],
      },
    ],
    tasks: [
      {
        id: "t1",
        title: "Gather requirements",
        description: "Clarify scope, constraints, and acceptance criteria.",
        assignees: ["Sarah"],
        requiredSkills: ["System Design"],
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        workPeriods: [
          {
            date: new Date().toISOString().slice(0, 10),
            startTime: "10:00",
            endTime: "13:00",
          },
        ],
        estimatedHours: 3,
        scheduledHours: 3,
        status: "scheduled",
        priority: "high",
        dependencies: [],
        criticalPath: true,
        rationale: "Sarah has the system design skill and matching availability.",
      },
      {
        id: "t2",
        title: "Implement core feature",
        description: "Build the primary functionality described in the request.",
        assignees: ["Ahmed"],
        requiredSkills: ["React", "Next.js"],
        startDate: new Date().toISOString().slice(0, 10),
        endDate: input.dueDate,
        workPeriods: [
          {
            date: new Date().toISOString().slice(0, 10),
            startTime: "09:00",
            endTime: "17:00",
          },
        ],
        estimatedHours: 8,
        scheduledHours: 8,
        status: "scheduled",
        priority: "high",
        dependencies: ["t1"],
        criticalPath: true,
        rationale: "Ahmed is fully available and has the required frontend skills.",
      },
      {
        id: "t3",
        title: "QA and review",
        description: "Test the implementation and confirm it meets requirements.",
        assignees: ["Sophie"],
        requiredSkills: ["Manual Testing"],
        startDate: input.dueDate,
        endDate: input.dueDate,
        workPeriods: [
          { date: input.dueDate, startTime: "09:00", endTime: "11:00" },
        ],
        estimatedHours: 2,
        scheduledHours: 2,
        status: "scheduled",
        priority: "medium",
        dependencies: ["t2"],
        criticalPath: false,
        rationale: "Sophie is available and owns QA responsibilities.",
      },
    ],
    resources: [
      {
        person: "Sarah",
        scheduledHours: 3,
        availableHours: 15,
        utilizationPercent: 20,
        overCapacity: false,
      },
      {
        person: "Ahmed",
        scheduledHours: 8,
        availableHours: 40,
        utilizationPercent: 20,
        overCapacity: false,
      },
    ],
    risks: [
      {
        description: "Mock data does not reflect real scheduling constraints.",
        severity: "low",
        probability: "unlikely",
        impact: "None — for UI testing only.",
        owner: "N/A",
        mitigation: "Replace this route with the real optimizer backend.",
      },
    ],
    unresolvedItems: [],
    recommendations: ["Wire up the real LLM-backed optimizer before demoing."],
    contextChanges: [],
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const input = body as Partial<OptimizeRequest>;
  if (!input?.taskDescription || !input?.dueDate) {
    return Response.json(
      { error: "taskDescription and dueDate are required." },
      { status: 400 }
    );
  }

  return Response.json(buildMockPlan(input as OptimizeRequest));
}
