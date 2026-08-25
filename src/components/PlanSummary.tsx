import type { ProjectPlan, ProjectStatus } from "@/types/schedule";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  "on-track": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  "at-risk": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  delayed: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  completed: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
};

interface PlanSummaryProps {
  plan: ProjectPlan;
}

export default function PlanSummary({ plan }: PlanSummaryProps) {
  const { project, milestones, risks, recommendations } = plan;

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {project.name}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            {project.objective}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[project.status]}`}
        >
          {project.status.replace("-", " ")}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Start</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-100">{project.startDate}</dd>
        </div>
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Due</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-100">{project.endDate}</dd>
        </div>
        {project.durationWeeks !== undefined && (
          <div>
            <dt className="text-zinc-500 dark:text-zinc-400">Duration</dt>
            <dd className="font-medium text-zinc-900 dark:text-zinc-100">
              {project.durationWeeks} week{project.durationWeeks === 1 ? "" : "s"}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-zinc-500 dark:text-zinc-400">Milestones</dt>
          <dd className="font-medium text-zinc-900 dark:text-zinc-100">{milestones.length}</dd>
        </div>
      </dl>

      {milestones.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Milestones</h3>
          <ul className="mt-2 flex flex-col gap-1">
            {milestones.map((milestone) => (
              <li
                key={milestone.id}
                className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400"
              >
                <span>{milestone.name}</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  {milestone.date}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {risks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Risks</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {risks.map((risk, index) => (
              <li
                key={`${risk.description}-${index}`}
                className="rounded-md bg-zinc-50 p-2 text-sm text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400"
              >
                <span className="font-medium capitalize text-zinc-800 dark:text-zinc-200">
                  {risk.severity}
                </span>{" "}
                — {risk.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Recommendations
          </h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
