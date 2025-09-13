import { UserSession } from "@/data/user";

export interface GroupMember {
  id: string;
  name: string;
  phone: string;
  strike: number;
  points: number;
  wasting: number;
  currentQuarter: number;
  isActive: boolean;
  joinedAt: Date;
  lastActivity: Date;
  isPointing?: boolean; // for UI purposes only
}

export interface GroupType {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  totalQuartersCompleted: number;
  averageStreak: number;
  createdAt: Date;
  adminId: string;
  adminName: string;
  isPublic: boolean;
  maxMembers: number;
  members: GroupMember[];
  groupGoal: string;
  completedKhatmahs: number;
}

export interface Group {
  id: string;
  name: string;
  adminId: string;
  members: UserSession[];
}

export const mockGroups: GroupType[] = [
  {
    id: "1",
    name: "رفقاء الفجر",
    description: "مجموعة للقراءة في أوقات الفجر المباركة",
    memberCount: 12,
    totalQuartersCompleted: 145,
    averageStreak: 8,
    createdAt: new Date("2024-01-15"),
    adminId: "admin1",
    adminName: "أحمد محمد",
    isPublic: true,
    maxMembers: 20,
    groupGoal: "إتمام ختمة جماعية كل شهر",
    completedKhatmahs: 2,
    members: [
      {
        id: "1",
        name: "أحمد محمد",
        phone: "+966501234567",
        strike: 15,
        wasting: 2,
        currentQuarter: 45,
        isActive: true,
        points: 100,
        joinedAt: new Date("2024-01-15"),
        lastActivity: new Date("2024-02-20"),
        isPointing: true,
      },
      {
        id: "2",
        name: "فاطمة أحمد",
        phone: "+966507654321",
        strike: 12,
        points: 103,
        wasting: 1,
        currentQuarter: 42,
        isActive: true,
        joinedAt: new Date("2024-01-18"),
        lastActivity: new Date("2024-02-20"),
        isPointing: true,
      },
      {
        id: "3",
        name: "محمد علي",
        phone: "+966509876543",
        strike: 8,
        wasting: 3,
        currentQuarter: 38,
        points: 107,
        isActive: true,
        joinedAt: new Date("2024-01-20"),
        lastActivity: new Date("2024-02-19"),
      },
      {
        id: "6",
        name: "سارة حسين",
        phone: "+966501112233",
        isPointing: true,
        strike: 10,
        wasting: 0,
        currentQuarter: 40,
        isActive: true,
        points: 95,
        joinedAt: new Date("2024-01-22"),
        lastActivity: new Date("2024-02-18"),
      },
      {
        id: "7",
        name: "خالد منصور",
        phone: "+966503334455",
        strike: 5,
        wasting: 2,
        currentQuarter: 30,
        points: 100,

        isActive: false,
        joinedAt: new Date("2024-01-25"),
        lastActivity: new Date("2024-02-15"),
      },
      {
        id: "8",
        name: "ريم عبدالله",
        phone: "+966505556677",
        strike: 13,
        wasting: 1,
        points: 100,

        currentQuarter: 43,
        isActive: true,
        joinedAt: new Date("2024-01-28"),
        lastActivity: new Date("2024-02-20"),
      },
    ],
  },
  {
    id: "2",
    name: "أهل الليل",
    description: "للذين يفضلون القراءة في الليل والتهجد",
    memberCount: 8,
    totalQuartersCompleted: 89,
    averageStreak: 6,
    createdAt: new Date("2024-01-20"),
    adminId: "admin2",
    adminName: "عبدالله سالم",
    isPublic: true,
    maxMembers: 15,
    groupGoal: "قيام الليل مع القرآن",
    completedKhatmahs: 1,
    members: [
      {
        id: "4",
        points: 100,
        name: "عبدالله سالم",
        phone: "+966502345678",
        strike: 10,
        wasting: 1,
        currentQuarter: 40,
        isActive: true,
        joinedAt: new Date("2024-01-20"),
        lastActivity: new Date("2024-02-20"),
      },
      {
        id: "5",
        name: "مريم خالد",
        phone: "+966508765432",
        strike: 7,
        points: 100,
        wasting: 2,
        currentQuarter: 35,
        isActive: true,
        joinedAt: new Date("2024-01-22"),
        lastActivity: new Date("2024-02-19"),
      },
    ],
  },
  {
    id: "3",
    name: "طلاب الجامعة",
    description: "مجموعة خاصة بطلاب الجامعات لتنظيم الوقت مع القرآن",
    memberCount: 25,
    totalQuartersCompleted: 312,
    averageStreak: 11,
    createdAt: new Date("2024-01-10"),
    adminId: "admin3",
    adminName: "يوسف أحمد",
    isPublic: true,
    maxMembers: 30,
    groupGoal: "التوازن بين الدراسة والقرآن",
    completedKhatmahs: 3,
    members: [],
  },
];
