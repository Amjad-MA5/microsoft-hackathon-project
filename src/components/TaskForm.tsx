"use client";

import { useId, useState, useTransition } from "react";
import { requestOptimizedPlan, OptimizeRequestError } from "@/lib/optimizeClient";
import type { ProjectPlan } from "@/types/schedule";

interface TaskFormProps {
  onPlanReady: (plan: ProjectPlan) => void;
  onError: (message: string) => void;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TaskForm({ onPlanReady, onError }: TaskFormProps) {
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isPending, startTransition] = useTransition();
  const descriptionId = useId();
  const dueDateId = useId();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = description.trim();
    if (!trimmed || !dueDate) return;

    startTransition(async () => {
      try {
        const plan = await requestOptimizedPlan({
          taskDescription: trimmed,
          dueDate,
        });
        onPlanReady(plan);
      } catch (err) {
        const message =
          err instanceof OptimizeRequestError
            ? err.message
            : "Something went wrong while generating the schedule. Please try again.";
        onError(message);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor={descriptionId}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Task description
        </label>
        <textarea
          id={descriptionId}
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Build an internal inventory management web application MVP."
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={dueDateId}
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Due date
        </label>
        <input
          id={dueDateId}
          type="date"
          required
          min={todayIsoDate()}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full max-w-xs rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex w-fit items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isPending ? "Generating schedule…" : "Generate schedule"}
      </button>
    </form>
  );
}
