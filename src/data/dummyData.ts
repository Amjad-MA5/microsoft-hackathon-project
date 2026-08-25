export interface Person {
  id: string;
  name: string;
  skills: string[];
  availability: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
  };
}

export interface Task {
  id: string;
  title: string;
  requiredSkill: string;
  duration: number;
  dependencies?: string[];
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
      availability: { monday: 8, tuesday: 8, wednesday: 8, thursday: 8, friday: 4 }
    },
    {
      id: "p2",
      name: "Bob",
      skills: ["Backend", "Database"],
      availability: { monday: 8, tuesday: 8, wednesday: 4, thursday: 8, friday: 8 }
    },
    {
      id: "p3",
      name: "Charlie",
      skills: ["DevOps", "Backend", "Frontend"],
      availability: { monday: 4, tuesday: 4, wednesday: 8, thursday: 8, friday: 8 }
    }
  ],
  tasks: [
    {
      id: "t1",
      title: "Design Homepage UI",
      requiredSkill: "Design",
      duration: 6
    },
    {
      id: "t2",
      title: "Develop Frontend Homepage",
      requiredSkill: "Frontend",
      duration: 10,
      dependencies: ["t1"]
    },
    {
      id: "t3",
      title: "Setup Database Schema",
      requiredSkill: "Database",
      duration: 8
    },
    {
      id: "t4",
      title: "Develop Backend API",
      requiredSkill: "Backend",
      duration: 12,
      dependencies: ["t3"]
    },
    {
      id: "t5",
      title: "Integrate Frontend with API",
      requiredSkill: "Frontend",
      duration: 8,
      dependencies: ["t2", "t4"]
    },
    {
      id: "t6",
      title: "Setup CI/CD Pipeline",
      requiredSkill: "DevOps",
      duration: 6
    },
    {
      id: "t7",
      title: "Write End-to-End Tests",
      requiredSkill: "Frontend",
      duration: 8,
      dependencies: ["t5"]
    },
    {
      id: "t8",
      title: "Optimize Database Queries",
      requiredSkill: "Database",
      duration: 4,
      dependencies: ["t3"]
    },
    {
      id: "t9",
      title: "Deploy to Production",
      requiredSkill: "DevOps",
      duration: 4,
      dependencies: ["t5", "t6", "t8"]
    },
    {
      id: "t10",
      title: "Monitor Application Logs",
      requiredSkill: "DevOps",
      duration: 2,
      dependencies: ["t9"]
    }
  ]
};
