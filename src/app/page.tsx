"use client";

import { useState } from "react";
import TaskForm from "@/components/TaskForm";
import PlanSummary from "@/components/PlanSummary";
import TaskList from "@/components/TaskList";
import EmployeeTimeline from "@/components/EmployeeTimeline";
import ThemeToggle from "@/components/ThemeToggle";
import { dummyData } from "@/data/dummyData";
import type { ProjectPlan } from "@/types/schedule";

export default function Home() {
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handlePlanReady(nextPlan: ProjectPlan) {
    setError(null);
    setPlan(nextPlan);
  }

  function handleError(message: string) {
    setError(message);
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-12">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Planify
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Describe a task and its due date. The optimizer will break it into
              subtasks, estimate effort, and block time on the team&apos;s calendars.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <TaskForm onPlanReady={handlePlanReady} onError={handleError} />

        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </div>
        )}

        {plan && (
          <div className="flex flex-col gap-6">
            <PlanSummary plan={plan} />
            <TaskList tasks={plan.tasks} />
            <EmployeeTimeline employees={dummyData.employees} tasks={plan.tasks} />
          </div>
        )}
      </main>
    </div>
  );
}
