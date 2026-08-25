export interface TimeSlot {
  start: string; // ISO 8601 Timestamp, e.g. "2026-08-25T09:00:00Z"
  end: string;   // ISO 8601 Timestamp, e.g. "2026-08-25T12:00:00Z"
}

export interface Project {
  name: string;
  commitmentHoursPerWeek: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  seniority: "Junior" | "Mid" | "Senior" | "Lead";
  skills: string[];
  currentProjects: Project[];
  plannedLeave: TimeSlot[];
  availability: TimeSlot[]; // Standard Calendar availability
}

export interface OrganizationData {
  employees: Employee[];
}

export const dummyData: OrganizationData = {
  employees: [
    {
      id: "e1",
      name: "Alice",
      role: "Frontend Developer",
      seniority: "Senior",
      skills: ["React", "Next.js", "Tailwind CSS", "Design"],
      currentProjects: [
        { name: "Website Redesign", commitmentHoursPerWeek: 10 }
      ],
      plannedLeave: [],
      availability: [
        { start: "2026-08-25T09:00:00Z", end: "2026-08-25T17:00:00Z" },
        { start: "2026-08-26T09:00:00Z", end: "2026-08-26T17:00:00Z" }
      ]
    },
    {
      id: "e2",
      name: "Bob",
      role: "Backend Developer",
      seniority: "Mid",
      skills: ["Node.js", "Python", "Database Design", "API"],
      currentProjects: [],
      plannedLeave: [
        { start: "2026-08-26T00:00:00Z", end: "2026-08-26T23:59:59Z" } // Bob hat am 26. Urlaub
      ],
      availability: [
        { start: "2026-08-25T08:30:00Z", end: "2026-08-25T16:30:00Z" }
      ]
    },
    {
      id: "e3",
      name: "Charlie",
      role: "Project Manager",
      seniority: "Lead",
      skills: ["Scrum", "Agile", "Resource Planning", "Stakeholder Management"],
      currentProjects: [
        { name: "Q3 Roadmap Planning", commitmentHoursPerWeek: 20 }
      ],
      plannedLeave: [],
      availability: [
        { start: "2026-08-25T10:00:00Z", end: "2026-08-25T18:00:00Z" },
        { start: "2026-08-26T10:00:00Z", end: "2026-08-26T18:00:00Z" }
      ]
    },
    {
      id: "e4",
      name: "Diana",
      role: "Fullstack Developer",
      seniority: "Junior",
      skills: ["React", "Node.js", "Testing"],
      currentProjects: [],
      plannedLeave: [],
      availability: [
        { start: "2026-08-25T09:00:00Z", end: "2026-08-25T17:00:00Z" },
        { start: "2026-08-26T09:00:00Z", end: "2026-08-26T17:00:00Z" }
      ]
    }
  ]
};
