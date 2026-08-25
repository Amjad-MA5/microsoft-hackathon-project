# Planify

## Project Overview

Planify is a web-based proof of concept developed for a three-hour hackathon. It uses a large language model (LLM) to transform team availability, employee skills, task requirements, and operational constraints into an optimized project schedule.

The system combines the contextual reasoning capabilities of an LLM with deterministic scheduling rules. This approach allows the application to account for human context while maintaining predictable and enforceable scheduling behavior.

## Objective

The objective is to build a single-page application that accepts structured team and task data, incorporates unexpected circumstances provided in natural language, and produces an explainable schedule in structured JSON format.

## Technology Stack

| Area                       | Technology                                                                   |
| -------------------------- | ---------------------------------------------------------------------------- |
| Application framework      | Next.js with the App Router                                                  |
| Styling                    | Tailwind CSS                                                                 |
| Deployment                 | Vercel, deployed through GitHub integration                                  |
| Backend and AI integration | Next.js API route at `/api/optimize` and an LLM API from OpenAI or Anthropic |
| Response format            | Structured JSON output                                                       |

## Scope

### Included Features

- AI-generated sample data containing three to five employees, their skills and availability, and 10 to 15 tasks.
- A single-page dashboard that accepts input JSON and a natural-language context field.
- An optimization action that sends the input to the backend and returns a schedule.
- A Tailwind CSS timeline for displaying the optimized schedule.
- A system prompt that enforces scheduling constraints and requires an explanation of the resulting assignments.

### Excluded Features

The following features are outside the scope of this proof of concept:

- Desktop applications, including Electron-based applications.
- Heavy visualization libraries, including D3.js.
- Collection or cleaning of real-world datasets from sources such as Kaggle or GitHub.
- Calendar integrations with Google Calendar, Microsoft Outlook, or similar services.
- Complex user authentication systems or persistent databases.

## Scheduling Constraints

The LLM prompt must enforce the following rules:

1. **Grouped work:** Group each employee's tasks to minimize unnecessary commuting or shift changes and, where possible, limit them to one commute or shift per day.
2. **Daily workload:** Limit each employee to a maximum of eight working hours per day.
3. **Task dependencies:** Preserve task order. For example, Task B must not begin until Task A is complete.
4. **Skill matching:** Assign a task only to an employee who possesses the required skills.

## Implementation Timeline

| Time                              | Deliverable                                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Hour 1: Setup and backend         | Initialize Next.js, deploy to Vercel, generate sample JSON, and implement the API route that connects to the LLM. |
| Hour 2: AI and scheduling logic   | Write and refine the system prompt, then require valid JSON output containing scheduling rationale.               |
| Hour 3: Frontend and presentation | Render the LLM response in the timeline interface and prepare the project presentation.                           |

## Distinguishing Features

### Daily Context Input

The application provides a natural-language field for recording unexpected exceptions. For example:

> Anna is unavailable for on-site work today and can complete remote tasks only.

The LLM uses this context to adapt the schedule without requiring a large collection of specialized controls or checkboxes.

### Explainable Scheduling

The JSON response includes a rationale for each employee's assignments. The interface therefore communicates not only what has been scheduled, but also why the schedule was selected. For example:

> Mark's tasks were grouped on Tuesday to reduce the number of required commutes.

## Detailed Schedule Output

The optimizer must return an actionable project plan rather than only a high-level summary. The output should contain the following information.

### Project-Level Information

- Project name, objective, and description.
- Planned start date and projected end date.
- Overall duration and current schedule status.
- Project milestones, milestone dates, and completion criteria.
- Key assumptions and constraints used during scheduling.
- Overall risks, blockers, and recommended actions.

### Task-Level Information

Each task should be represented as an individual schedule item containing:

- Unique task ID and task title.
- Task description and deliverable.
- Assigned person or people.
- Required skills and the skills used by the assignee.
- Start date and end date.
- Start time and end time for each scheduled work period.
- Total estimated effort and scheduled hours.
- Task status, priority, and milestone association.
- Dependencies and predecessor task IDs.
- Whether the task is on the critical path.
- Scheduling rationale and any unresolved issue.

### Resource and Management Information

The response should also provide project-management information that supports monitoring and decision-making:

- Workload totals and utilization percentages for each person.
- Daily and weekly capacity compared with scheduled work.
- Unassigned, partially scheduled, or over-capacity tasks.
- Dependency conflicts and tasks that may delay the project.
- Critical-path tasks and available schedule buffer.
- Milestone readiness and upcoming deadlines.
- Risks with severity, probability, impact, owner, and mitigation plan.
- Assumptions requiring confirmation from the project manager.
- Recommended decisions, approvals, or follow-up actions.
- A change summary explaining what was adjusted because of the daily context input.

### Example Detailed Output

The following example illustrates the expected structure. The actual response may contain additional fields as the application evolves.

```json
{
  "project": {
    "name": "Internal Inventory Management Application",
    "objective": "Deliver an MVP for internal inventory management",
    "startDate": "2026-09-01",
    "endDate": "2026-10-09",
    "durationWeeks": 6,
    "status": "at-risk",
    "assumptions": [
      "Assigned employees are available during the submitted availability windows.",
      "Task estimates are expressed in working hours."
    ]
  },
  "milestones": [
    {
      "id": "m1",
      "name": "Architecture approved",
      "date": "2026-09-04",
      "completionCriteria": ["Architecture decision record approved"]
    },
    {
      "id": "m2",
      "name": "MVP demonstration",
      "date": "2026-10-09",
      "completionCriteria": ["Core inventory workflows pass acceptance testing"]
    }
  ],
  "tasks": [
    {
      "id": "t1",
      "title": "Gather requirements",
      "description": "Document the inventory workflows and acceptance criteria.",
      "assignees": ["Sarah"],
      "requiredSkills": ["Product analysis"],
      "startDate": "2026-09-01",
      "endDate": "2026-09-02",
      "workPeriods": [
        { "date": "2026-09-01", "startTime": "09:00", "endTime": "13:00" },
        { "date": "2026-09-02", "startTime": "09:00", "endTime": "11:00" }
      ],
      "estimatedHours": 6,
      "scheduledHours": 6,
      "status": "scheduled",
      "priority": "high",
      "dependencies": [],
      "criticalPath": true,
      "rationale": "Assigned to Sarah because she has the required product analysis skill and availability in both work periods."
    }
  ],
  "resources": [
    {
      "person": "Sarah",
      "scheduledHours": 24,
      "availableHours": 32,
      "utilizationPercent": 75,
      "overCapacity": false
    }
  ],
  "risks": [
    {
      "description": "The API implementation has limited schedule buffer.",
      "severity": "medium",
      "probability": "possible",
      "impact": "May delay integration testing.",
      "owner": "Ahmed",
      "mitigation": "Review the API contract before implementation begins."
    }
  ],
  "unresolvedItems": [],
  "recommendations": [
    "Confirm milestone acceptance criteria with the project sponsor."
  ],
  "contextChanges": [
    "No on-site work was assigned to Anna on 2026-09-03 because of the submitted availability exception."
  ]
}
```

## Example Use Case

Consider an organization with 20 employees. The system maintains information about each employee's role, skills, seniority, current projects, working hours, planned leave, and calendar availability.

A manager provides a high-level project request:

> Build an internal inventory management web application. We want an MVP in six weeks.

The system should then produce a detailed plan that includes the project dates, individual task assignments, scheduled work periods, dependencies, milestones, resource utilization, critical-path analysis, risks, assumptions, unresolved items, and recommended actions. A project manager should be able to use the output to understand what must be done, who is responsible, when the work will occur, and what could affect delivery.

## Architectural Principle

The LLM should not make every scheduling decision independently. LLM agents should be used for reasoning, interpretation, and task decomposition, while deterministic algorithms should enforce constraints and perform schedule optimization. This separation improves reliability, explainability, and consistency.
