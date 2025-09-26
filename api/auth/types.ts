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
export type UserData = {
  name: string;
  phone: string;
  gender: string;
  isMobileLogin: boolean;
};
