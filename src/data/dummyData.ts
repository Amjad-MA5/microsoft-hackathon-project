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

type AvailabilityPattern = Partial<Record<number, Array<readonly [string, string]>>>;

const sixWeekAvailability = (pattern: AvailabilityPattern): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const date = new Date("2026-08-24T00:00:00Z");
  const endDate = new Date("2026-10-02T00:00:00Z");
  while (date <= endDate) {
    const dateText = date.toISOString().slice(0, 10);
    for (const [start, end] of pattern[date.getUTCDay()] ?? []) {
      slots.push({ start: `${dateText}T${start}:00Z`, end: `${dateText}T${end}:00Z` });
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return slots;
};

const weekday = (slots: Array<readonly [string, string]>): AvailabilityPattern => ({ 1: slots, 2: slots, 3: slots, 4: slots, 5: slots });

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
      availability: sixWeekAvailability({ 1: [["10:00", "15:00"]], 3: [["10:00", "15:00"]], 5: [["10:00", "15:00"]] })
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
      availability: sixWeekAvailability(weekday([["09:00", "12:30"], ["13:30", "17:00"]]))
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
      availability: sixWeekAvailability(weekday([["08:00", "12:00"]]))
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
      availability: sixWeekAvailability(weekday([["09:00", "12:00"], ["13:00", "17:00"]]))
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
      availability: sixWeekAvailability({ 1: [["09:00", "17:00"]], 2: [["09:00", "17:00"]], 3: [["09:00", "13:00"]], 4: [["09:00", "17:00"]], 5: [["09:00", "17:00"]] })
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
      availability: sixWeekAvailability({ 2: [["13:00", "17:00"]], 4: [["09:00", "12:00"], ["13:00", "17:00"]] })
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
      availability: sixWeekAvailability({ 1: [["09:00", "17:00"]], 2: [["09:00", "17:00"]], 3: [["09:00", "17:00"]], 4: [["09:00", "17:00"]], 5: [["09:00", "12:00"]] })
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
      availability: sixWeekAvailability({ 1: [["14:00", "16:00"]], 3: [["10:00", "12:00"]] })
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
      availability: sixWeekAvailability(weekday([["09:00", "12:30"], ["13:30", "17:00"]]))
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
      availability: sixWeekAvailability({ 1: [["09:00", "12:00"], ["13:00", "17:00"]], 2: [["09:00", "12:00"], ["13:00", "17:00"]], 3: [["09:00", "12:00"], ["13:00", "17:00"]] })
    }
  ]
};
