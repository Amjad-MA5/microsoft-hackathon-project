export interface TimeRange {
  start: string;
  end: string;
}

export interface Person {
  id: string;
  name: string;
  skills: string[];
  availability: {
    monday: TimeRange[];
    tuesday: TimeRange[];
    wednesday: TimeRange[];
    thursday: TimeRange[];
    friday: TimeRange[];
  };
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
      availability: {
        monday: [{ start: "09:00", end: "12:00" }, { start: "13:00", end: "17:00" }],
        tuesday: [{ start: "09:00", end: "11:30" }, { start: "13:00", end: "17:00" }],
        wednesday: [{ start: "09:00", end: "12:00" }, { start: "13:00", end: "15:00" }, { start: "16:00", end: "17:00" }],
        thursday: [{ start: "09:00", end: "12:00" }, { start: "13:00", end: "17:00" }],
        friday: [{ start: "09:00", end: "11:00" }, { start: "11:30", end: "13:00" }]
      }
    },
    {
      id: "p2",
      name: "Bob",
      skills: ["Backend", "Database"],
      availability: {
        monday: [{ start: "08:30", end: "12:30" }, { start: "13:30", end: "16:30" }],
        tuesday: [{ start: "08:30", end: "10:30" }, { start: "11:00", end: "12:30" }, { start: "13:30", end: "16:30" }],
        wednesday: [{ start: "08:30", end: "10:30" }, { start: "11:00", end: "12:30" }],
        thursday: [{ start: "08:30", end: "12:30" }, { start: "13:30", end: "16:30" }],
        friday: [{ start: "08:30", end: "11:30" }, { start: "12:30", end: "16:30" }]
      }
    },
    {
      id: "p3",
      name: "Charlie",
      skills: ["DevOps", "Backend", "Frontend"],
      availability: {
        monday: [{ start: "13:00", end: "15:00" }, { start: "15:30", end: "17:00" }],
        tuesday: [{ start: "13:00", end: "17:00" }],
        wednesday: [{ start: "09:00", end: "12:00" }, { start: "13:00", end: "15:30" }, { start: "16:00", end: "17:00" }],
        thursday: [{ start: "09:00", end: "11:00" }, { start: "11:30", end: "12:30" }, { start: "14:00", end: "17:00" }],
        friday: [{ start: "09:00", end: "12:00" }, { start: "13:00", end: "15:00" }, { start: "15:30", end: "17:00" }]
      }
    }
  ]
};