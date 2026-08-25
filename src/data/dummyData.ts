export interface TimeSlot {
  start: string; // ISO 8601 Timestamp, e.g. "2026-08-25T09:00:00Z"
  end: string;   // ISO 8601 Timestamp, e.g. "2026-08-25T12:00:00Z"
}

export interface Person {
  id: string;
  name: string;
  skills: string[];
  availability: TimeSlot[];
}

export interface Task {
  id: string;
  title: string;
  requiredSkills: string[];
  durationHours: number; // Wie lange dauert die Aufgabe?
  deadline?: string;     // (Optional) Bis wann muss sie erledigt sein? (ISO Timestamp)
  priority: "high" | "medium" | "low"; // Wichtig für den Optimizer, falls nicht genug Zeit für alles ist
}

export interface SchedulingData {
  persons: Person[];
  tasks: Task[];
}

export const dummyData: SchedulingData = {
  persons: [
    {
      id: "p1",
      name: "Alice",
      skills: ["Frontend", "Design"],
      availability: [
        { start: "2026-08-25T09:00:00Z", end: "2026-08-25T12:00:00Z" },
        { start: "2026-08-25T13:00:00Z", end: "2026-08-25T17:00:00Z" },
        { start: "2026-08-26T09:00:00Z", end: "2026-08-26T12:00:00Z" },
        { start: "2026-08-26T13:00:00Z", end: "2026-08-26T17:00:00Z" }
      ]
    },
    {
      id: "p2",
      name: "Bob",
      skills: ["Backend", "Database"],
      availability: [
        { start: "2026-08-25T08:30:00Z", end: "2026-08-25T12:30:00Z" },
        { start: "2026-08-25T13:30:00Z", end: "2026-08-25T16:30:00Z" },
        { start: "2026-08-26T08:30:00Z", end: "2026-08-26T12:30:00Z" },
        { start: "2026-08-26T13:30:00Z", end: "2026-08-26T16:30:00Z" }
      ]
    },
    {
      id: "p3",
      name: "Charlie",
      skills: ["Project Management", "Scrum"],
      availability: [
        { start: "2026-08-25T10:00:00Z", end: "2026-08-25T15:00:00Z" },
        { start: "2026-08-26T10:00:00Z", end: "2026-08-26T15:00:00Z" }
      ]
    }
  ],
  tasks: [
    {
      id: "t1",
      title: "Design Homepage Mockups",
      requiredSkills: ["Design"],
      durationHours: 3,
      deadline: "2026-08-25T17:00:00Z",
      priority: "high"
    },
    {
      id: "t2",
      title: "Setup Database Schema",
      requiredSkills: ["Database"],
      durationHours: 4,
      priority: "high"
    },
    {
      id: "t3",
      title: "Implement Login Frontend",
      requiredSkills: ["Frontend"],
      durationHours: 2,
      deadline: "2026-08-26T12:00:00Z",
      priority: "medium"
    },
    {
      id: "t4",
      title: "Sprint Planning Meeting",
      requiredSkills: ["Scrum"],
      durationHours: 1,
      priority: "low"
    }
  ]
};
