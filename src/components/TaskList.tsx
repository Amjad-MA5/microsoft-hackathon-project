import type { ScheduledTask, TaskPriority, TaskStatus } from "@/types/schedule";

const STATUS_STYLES: Record<TaskStatus, string> = {
  unassigned: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "in-progress": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  blocked: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: "text-zinc-500 dark:text-zinc-400",
  medium: "text-amber-600 dark:text-amber-400",
  high: "text-red-600 dark:text-red-400",
};

interface TaskListProps {
  tasks: ScheduledTask[];
}

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-6 text-sm text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        No subtasks were generated for this request.
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        Subtasks ({tasks.length})
      </h3>
      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {task.title}
                  {task.criticalPath && (
                    <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                      Critical path
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {task.description}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium capitalize ${STATUS_STYLES[task.status]}`}
              >
                {task.status.replace("-", " ")}
              </span>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Assignees</dt>
                <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                  {task.assignees.length > 0 ? task.assignees.join(", ") : "Unassigned"}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Est. hours</dt>
                <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                  {task.scheduledHours} / {task.estimatedHours}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Dates</dt>
                <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                  {task.startDate} → {task.endDate}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500 dark:text-zinc-400">Priority</dt>
                <dd className={`font-medium capitalize ${PRIORITY_STYLES[task.priority]}`}>
                  {task.priority}
                </dd>
              </div>
            </dl>

            {task.requiredSkills.length > 0 && (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Skills: {task.requiredSkills.join(", ")}
              </p>
            )}

            {task.dependencies.length > 0 && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Depends on: {task.dependencies.join(", ")}
              </p>
            )}

            {task.rationale && (
              <p className="mt-2 text-xs italic text-zinc-500 dark:text-zinc-400">
                {task.rationale}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
