import type { Employee } from "@/data/dummyData";
import type { ScheduledTask } from "@/types/schedule";

// Visible time-of-day window for the timeline bars. Segments outside this
// range are clamped so every bar renders within a consistent, readable width.
const WINDOW_START_MIN = 6 * 60; // 06:00
const WINDOW_END_MIN = 20 * 60; // 20:00
const WINDOW_SPAN_MIN = WINDOW_END_MIN - WINDOW_START_MIN;

interface DaySegment {
  startPct: number;
  widthPct: number;
}

function minutesFromIsoTime(iso: string): number {
  const time = iso.slice(11, 16); // "HH:MM"
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

function minutesFromTimeString(time: string): number {
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
}

function dateFromIso(iso: string): string {
  return iso.slice(0, 10);
}

function toSegment(startMin: number, endMin: number): DaySegment | null {
  const clampedStart = Math.max(startMin, WINDOW_START_MIN);
  const clampedEnd = Math.min(endMin, WINDOW_END_MIN);
  if (clampedEnd <= clampedStart) return null;
  return {
    startPct: ((clampedStart - WINDOW_START_MIN) / WINDOW_SPAN_MIN) * 100,
    widthPct: ((clampedEnd - clampedStart) / WINDOW_SPAN_MIN) * 100,
  };
}

/** Splits a (possibly multi-day) ISO range into per-day minute ranges. */
function splitRangeByDate(
  startIso: string,
  endIso: string
): Array<{ date: string; startMin: number; endMin: number }> {
  const startDate = dateFromIso(startIso);
  const endDate = dateFromIso(endIso);

  if (startDate === endDate) {
    return [
      {
        date: startDate,
        startMin: minutesFromIsoTime(startIso),
        endMin: minutesFromIsoTime(endIso),
      },
    ];
  }

  // Multi-day range: the first day runs to midnight, the last day starts at
  // midnight, and any days in between are fully blocked. Capped for safety.
  const segments: Array<{ date: string; startMin: number; endMin: number }> = [];
  const cursor = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  let iterations = 0;

  while (cursor.getTime() <= end.getTime() && iterations < 14) {
    const iso = cursor.toISOString().slice(0, 10);
    if (iso === startDate) {
      segments.push({ date: iso, startMin: minutesFromIsoTime(startIso), endMin: 24 * 60 });
    } else if (iso === endDate) {
      segments.push({ date: iso, startMin: 0, endMin: minutesFromIsoTime(endIso) });
    } else {
      segments.push({ date: iso, startMin: 0, endMin: 24 * 60 });
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    iterations += 1;
  }

  return segments;
}

function formatDateLabel(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

interface ScheduledBlock {
  segment: DaySegment;
  task: ScheduledTask;
}

interface EmployeeTimelineProps {
  employees: Employee[];
  tasks: ScheduledTask[];
}

export default function EmployeeTimeline({ employees, tasks }: EmployeeTimelineProps) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Team calendar
        </h3>
        <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-emerald-300" /> Available
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-zinc-400" /> Leave
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-blue-500" /> Scheduled work
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {employees.map((employee) => {
          const assignedTasks = tasks.filter((task) =>
            task.assignees.includes(employee.name)
          );

          const availabilityByDate = new Map<string, DaySegment[]>();
          for (const slot of employee.availability) {
            for (const { date, startMin, endMin } of splitRangeByDate(slot.start, slot.end)) {
              const segment = toSegment(startMin, endMin);
              if (!segment) continue;
              availabilityByDate.set(date, [...(availabilityByDate.get(date) ?? []), segment]);
            }
          }

          const leaveByDate = new Map<string, DaySegment[]>();
          for (const slot of employee.plannedLeave) {
            for (const { date, startMin, endMin } of splitRangeByDate(slot.start, slot.end)) {
              const segment = toSegment(startMin, endMin);
              if (!segment) continue;
              leaveByDate.set(date, [...(leaveByDate.get(date) ?? []), segment]);
            }
          }

          const scheduledByDate = new Map<string, ScheduledBlock[]>();
          for (const task of assignedTasks) {
            for (const period of task.workPeriods) {
              const segment = toSegment(
                minutesFromTimeString(period.startTime),
                minutesFromTimeString(period.endTime)
              );
              if (!segment) continue;
              scheduledByDate.set(period.date, [
                ...(scheduledByDate.get(period.date) ?? []),
                { segment, task },
              ]);
            }
          }

          const allDates = Array.from(
            new Set([
              ...availabilityByDate.keys(),
              ...leaveByDate.keys(),
              ...scheduledByDate.keys(),
            ])
          ).sort();

          return (
            <div key={employee.id} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {employee.name}{" "}
                  <span className="font-normal text-zinc-500 dark:text-zinc-400">
                    · {employee.role}
                  </span>
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {employee.skills.join(", ")}
                </p>
              </div>

              {allDates.length === 0 ? (
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  No availability data for this employee.
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {allDates.map((date) => (
                    <div key={date} className="flex items-center gap-3">
                      <span className="w-24 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                        {formatDateLabel(date)}
                      </span>
                      <div className="relative h-6 flex-1 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
                        {(availabilityByDate.get(date) ?? []).map((segment, i) => (
                          <div
                            key={`avail-${i}`}
                            className="absolute inset-y-0 rounded bg-emerald-300/70 dark:bg-emerald-700/50"
                            style={{
                              left: `${segment.startPct}%`,
                              width: `${segment.widthPct}%`,
                            }}
                          />
                        ))}
                        {(leaveByDate.get(date) ?? []).map((segment, i) => (
                          <div
                            key={`leave-${i}`}
                            className="absolute inset-y-0 rounded bg-zinc-400/80 dark:bg-zinc-600"
                            style={{
                              left: `${segment.startPct}%`,
                              width: `${segment.widthPct}%`,
                            }}
                          />
                        ))}
                        {(scheduledByDate.get(date) ?? []).map(({ segment, task }, i) => (
                          <div
                            key={`task-${task.id}-${i}`}
                            title={`${task.title} (${task.startDate} → ${task.endDate})`}
                            className="absolute inset-y-0 rounded bg-blue-500"
                            style={{
                              left: `${segment.startPct}%`,
                              width: `${segment.widthPct}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
