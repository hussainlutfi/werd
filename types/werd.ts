
export interface Rewayah {
  id?: string;
  rawi: string;
  recourse: string;
  rewayah: string;
}

export interface RewayatControl {
  id: string; // e.g., "main"
  currentIndex: number; // index of the current rewayah being displayed
  rewayah: Rewayah; // current rewayah object
}

export interface QuranAyah {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface QuranJuz {
  number: number;
  ayahs: QuranAyah[];
  surahs: {
    [key: string]: QuranJuzSurah;
  };
  edition: QuranJuzEdition;
}

export interface QuranJuzSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface QuranJuzEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string;
}

export interface NewAyah {
  number: number;
  text: string;
  surahName: string;
  numberInSurah: number;
  juz: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface QuarterUnfinished {
  khatmahId: string;
  isDone: boolean;
  date: string;
  quarterNumber: number; // Optional, can be used to track the quarter number
}
export interface Ayah {
  surah: string;
  ayahNumber: string;
  page: string;
  text: string;
}

export const mainWerdList: QuarterUnfinished[] = [
  {
    khatmahId: "e4d1b2a7-11b0-4aef-82b5-88f7991c5a1a",
    date: "2025-04-21",
    isDone: false,
    quarterNumber: 240,
  },
  {
    khatmahId: "d7f8c5e1-7b9a-43d5-9d0e-2a4386d6f96a",
    date: "2025-03-10",
    isDone: false,
    quarterNumber: 189,
  },
  {
    khatmahId: "9a56e3b3-4d24-4d22-ae2b-dc3979f1475f",
    date: "2025-01-15",
    isDone: false,
    quarterNumber: 97,
  },
  {
    khatmahId: "51b02475-2c96-420d-82fa-80f7e53b9c25",
    date: "2025-02-27",
    isDone: false,
    quarterNumber: 15,
  },
  {
    khatmahId: "b35a924f-8391-469a-b2a1-673c1dc56cfc",
    date: "2025-05-05",
    isDone: false,
    quarterNumber: 223,
  },
  {
    khatmahId: "a2c3f4e5-6b7d-4c8f-9e0a-1b2c3d4e5f6a",
    date: "2025-06-12",
    isDone: false,
    quarterNumber: 31,
  },
  {
    khatmahId: "f7e6d5c4-b3a2-1c0d-9e8f-7a6b5c4d3e2f",
    date: "2025-07-23",
    isDone: false,
    quarterNumber: 58,
  },
  {
    khatmahId: "c1b2a3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    date: "2025-08-14",
    isDone: false,
    quarterNumber: 120,
  },
  {
    khatmahId: "e9f8d7c6-b5a4-3c2d-1e0f-9a8b7c6d5e4f",
    date: "2025-09-05",
    isDone: false,
    quarterNumber: 201,
  },
  {
    khatmahId: "b4c3d2e1-f6a5-8b7c-9d0e-1f2a3b4c5d6e",
    date: "2025-10-18",
    isDone: false,
    quarterNumber: 240,
  },
];
