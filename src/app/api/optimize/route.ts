import { dummyData } from "@/data/dummyData";
import { generateProjectPlan } from "@/lib/multiAgentScheduler";
import type { OptimizeRequest } from "@/types/schedule";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const input = body as Partial<OptimizeRequest>;
  if (!input.taskDescription?.trim() || !input.dueDate) {
    return Response.json({ error: "taskDescription and dueDate are required." }, { status: 400 });
  }

  try {
    const plan = await generateProjectPlan({ taskDescription: input.taskDescription.trim(), dueDate: input.dueDate }, dummyData);
    return Response.json(plan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate the project plan.";
    return Response.json({ error: message }, { status: 500 });
  }
}
