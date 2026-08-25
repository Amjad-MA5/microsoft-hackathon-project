# LLM Schedule Optimizer

## Project Overview

The LLM Schedule Optimizer is a web-based proof of concept developed for a three-hour hackathon. It uses a large language model (LLM) to transform team availability, employee skills, task requirements, and operational constraints into an optimized project schedule.

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

## Example Use Case

Consider an organization with 20 employees. The system maintains information about each employee's role, skills, seniority, current projects, working hours, planned leave, and calendar availability.

A manager provides a high-level project request:

> Build an internal inventory management web application. We want an MVP in six weeks.

The system can then produce a planning summary that includes:

- Project team: Sarah, Ahmed, Julia, Mark, and Elena.
- Project duration: six weeks.
- Twenty-four tasks.
- Four milestones.
- A weekly project meeting every Tuesday at 10:00.
- An architecture meeting during Week 1.
- Demonstrations at Milestones 2 and 4.
- Individual task assignments.
- Task dependencies.
- Expected workload for each employee.
- Risk warnings.

## Architectural Principle

The LLM should not make every scheduling decision independently. LLM agents should be used for reasoning, interpretation, and task decomposition, while deterministic algorithms should enforce constraints and perform schedule optimization. This separation improves reliability, explainability, and consistency.
