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

export interface SchedulingData {
  persons: Person[];
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
  ]
};
