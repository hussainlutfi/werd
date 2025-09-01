export interface UserSession {
  uid: string;
  phone: string;
  name?: string;
  gender?: string;
  strike?: number;
  prevStrike?: number;
  wasting?: number;
  points?: number;
  isPoniting?: boolean;
  isKafarah?: boolean;
  isStarted?: boolean;
  createdAt?: Date;
  khatmah?: UserKhatmah;
  pinHash?: string;
  isShowWhatsApp?: boolean;
  groups?: string[];
}

export interface UserKhatmah {
  khatmahType?: "" | "PAGE" | "HEZB";
  typeQuantity?: number;
  currentQuarter?: number;
  quarters?: {
    [quarterNumber: number]: Quarter;
  };
}

export interface Quarter {
  isDone: boolean;
  date: string;
}

export const dummyUserSession: UserSession = {
    uid: "user123",
    phone: "+1234567890",
    name: "علي حسين",
    gender: "male",
    strike: 2,
    prevStrike: 1,
    wasting: 0,
    points: 150,
    isPoniting: true,
    isKafarah: false,
    isStarted: true,
    createdAt: new Date("2024-06-01T10:00:00Z"),
    khatmah: {
        khatmahType: "PAGE",
        typeQuantity: 5,
        currentQuarter: 3,
        quarters: {
            1: { isDone: true, date: "2024-06-01" },
            2: { isDone: false, date: "2024-06-02" },
            3: { isDone: false, date: "2024-06-03" },
        },
    },
    pinHash: "abc123hash",
    isShowWhatsApp: true,
    groups: ["group1", "group2"],
};