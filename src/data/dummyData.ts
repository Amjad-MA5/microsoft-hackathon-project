export interface TimeSlot {
  start: string; // ISO 8601 Timestamp, e.g. "2026-08-24T09:00:00Z"
  end: string;
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
    // 1. The Bottleneck: Very Senior, very busy.
    {
      id: "e1",
      name: "Sarah",
      role: "Lead Architect",
      seniority: "Lead",
      skills: ["System Design", "AWS", "Node.js", "Database Architecture"],
      currentProjects: [
        { name: "Legacy Migration", commitmentHoursPerWeek: 25 }
      ],
      plannedLeave: [],
      availability: [
        { start: "2026-08-24T10:00:00Z", end: "2026-08-24T15:00:00Z" },
        { start: "2026-08-26T10:00:00Z", end: "2026-08-26T15:00:00Z" },
        { start: "2026-08-28T10:00:00Z", end: "2026-08-28T15:00:00Z" }
      ]
    },
    // 2. The Vacationer: Critical Backend dev, but missing the first half of the week (Edge Case).
    {
      id: "e2",
      name: "Mark",
      role: "Backend Developer",
      seniority: "Senior",
      skills: ["Python", "PostgreSQL", "API Design", "Node.js"],
      currentProjects: [],
      plannedLeave: [
        { start: "2026-08-24T00:00:00Z", end: "2026-08-26T23:59:59Z" } // Vacation Mon-Wed
      ],
      availability: [
        { start: "2026-08-27T09:00:00Z", end: "2026-08-27T17:00:00Z" },
        { start: "2026-08-28T09:00:00Z", end: "2026-08-28T17:00:00Z" }
      ]
    },
    // 3. The Part-Timer: Only works mornings.
    {
      id: "e3",
      name: "Julia",
      role: "UX/UI Designer",
      seniority: "Senior",
      skills: ["Figma", "User Testing", "Prototyping"],
      currentProjects: [
        { name: "Design System V2", commitmentHoursPerWeek: 5 }
      ],
      plannedLeave: [],
      availability: [
        { start: "2026-08-24T08:00:00Z", end: "2026-08-24T12:00:00Z" },
        { start: "2026-08-25T08:00:00Z", end: "2026-08-25T12:00:00Z" },
        { start: "2026-08-26T08:00:00Z", end: "2026-08-26T12:00:00Z" },
        { start: "2026-08-27T08:00:00Z", end: "2026-08-27T12:00:00Z" },
        { start: "2026-08-28T08:00:00Z", end: "2026-08-28T12:00:00Z" }
      ]
    },
    // 4. The Workhorse: Solid Mid-level Dev, fully available.
    {
      id: "e4",
      name: "Ahmed",
      role: "Frontend Developer",
      seniority: "Mid",
      skills: ["React", "Next.js", "Tailwind CSS"],
      currentProjects: [],
      plannedLeave: [],
      availability: [
        { start: "2026-08-24T09:00:00Z", end: "2026-08-24T17:00:00Z" },
        { start: "2026-08-25T09:00:00Z", end: "2026-08-25T17:00:00Z" },
        { start: "2026-08-26T09:00:00Z", end: "2026-08-26T17:00:00Z" },
        { start: "2026-08-27T09:00:00Z", end: "2026-08-27T17:00:00Z" },
        { start: "2026-08-28T09:00:00Z", end: "2026-08-28T17:00:00Z" }
      ]
    },
    // 5. The Flexible Junior: Available but limited skills.
    {
      id: "e5",
      name: "Elena",
      role: "Fullstack Developer",
      seniority: "Junior",
      skills: ["React", "Node.js"],
      currentProjects: [],
      plannedLeave: [],
      availability: [
        { start: "2026-08-24T09:00:00Z", end: "2026-08-24T17:00:00Z" },
        { start: "2026-08-25T09:00:00Z", end: "2026-08-25T17:00:00Z" },
        { start: "2026-08-26T09:00:00Z", end: "2026-08-26T17:00:00Z" },
        { start: "2026-08-27T09:00:00Z", end: "2026-08-27T17:00:00Z" },
        { start: "2026-08-28T09:00:00Z", end: "2026-08-28T17:00:00Z" }
      ]
    },
    // 6. The Specialist: Only DevOps person, but limited availability (Edge Case).
    {
      id: "e6",
      name: "David",
      role: "DevOps Engineer",
      seniority: "Mid",
      skills: ["Docker", "CI/CD", "AWS", "Terraform"],
      currentProjects: [
        { name: "Infrastructure Audit", commitmentHoursPerWeek: 15 }
      ],
      plannedLeave: [],
      availability: [
        { start: "2026-08-25T13:00:00Z", end: "2026-08-25T17:00:00Z" }, // Only Tuesday afternoon
        { start: "2026-08-27T09:00:00Z", end: "2026-08-27T17:00:00Z" }  // And all Thursday
      ]
    },
    // 7. Quality Assurance
    {
      id: "e7",
      name: "Sophie",
      role: "QA Tester",
      seniority: "Mid",
      skills: ["Cypress", "Jest", "Manual Testing"],
      currentProjects: [],
      plannedLeave: [
        { start: "2026-08-28T12:00:00Z", end: "2026-08-28T17:00:00Z" } // Leaves early on Friday
      ],
      availability: [
        { start: "2026-08-24T09:00:00Z", end: "2026-08-24T17:00:00Z" },
        { start: "2026-08-25T09:00:00Z", end: "2026-08-25T17:00:00Z" },
        { start: "2026-08-26T09:00:00Z", end: "2026-08-26T17:00:00Z" },
        { start: "2026-08-27T09:00:00Z", end: "2026-08-27T17:00:00Z" },
        { start: "2026-08-28T09:00:00Z", end: "2026-08-28T12:00:00Z" } 
      ]
    },
    // 8. The Manager: Only available for specific meetings.
    {
      id: "e8",
      name: "James",
      role: "Product Owner",
      seniority: "Lead",
      skills: ["Scrum", "Agile", "Product Strategy", "Requirements Engineering"],
      currentProjects: [
        { name: "Product Roadmap Q4", commitmentHoursPerWeek: 30 }
      ],
      plannedLeave: [],
      availability: [
        { start: "2026-08-24T14:00:00Z", end: "2026-08-24T16:00:00Z" }, // Monday afternoon sync
        { start: "2026-08-26T10:00:00Z", end: "2026-08-26T12:00:00Z" }  // Wednesday morning sync
      ]
    },
    // 9. Another Backend Dev (to balance Mark being away)
    {
      id: "e9",
      name: "Chen",
      role: "Backend Developer",
      seniority: "Mid",
      skills: ["Java", "Spring Boot", "PostgreSQL"],
      currentProjects: [],
      plannedLeave: [],
      availability: [
        { start: "2026-08-24T09:00:00Z", end: "2026-08-24T17:00:00Z" },
        { start: "2026-08-25T09:00:00Z", end: "2026-08-25T17:00:00Z" },
        { start: "2026-08-26T09:00:00Z", end: "2026-08-26T17:00:00Z" },
        { start: "2026-08-27T09:00:00Z", end: "2026-08-27T17:00:00Z" },
        { start: "2026-08-28T09:00:00Z", end: "2026-08-28T17:00:00Z" }
      ]
    },
    // 10. Data Specialist
    {
      id: "e10",
      name: "Lisa",
      role: "Data Scientist",
      seniority: "Senior",
      skills: ["Python", "Machine Learning", "SQL", "Data Analytics"],
      currentProjects: [
        { name: "Customer Churn Prediction", commitmentHoursPerWeek: 10 }
      ],
      plannedLeave: [],
      availability: [
        { start: "2026-08-24T09:00:00Z", end: "2026-08-24T17:00:00Z" },
        { start: "2026-08-25T09:00:00Z", end: "2026-08-25T17:00:00Z" },
        { start: "2026-08-26T09:00:00Z", end: "2026-08-26T17:00:00Z" } // Only works Mon-Wed
      ]
    }
  ]
};
