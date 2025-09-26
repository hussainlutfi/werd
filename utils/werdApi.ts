import { NewAyah } from "../types/werd";

// Helper methods
export const getWerdName = ({
  startPoint,
  type,
}: {
  startPoint: number;
  type: string;
}): string => {
  if (type === "PAGE") {
    return `صفحة رقم ${getArabicNumber(startPoint)}`;
  }
  const parts = startPoint / 4 + 0.75;
  const intPart = Math.floor(parts);
  const num = getArabicNumber(intPart);
  const decimal = parts - intPart;

  let decimalText = "";
  if (decimal === 0.25) decimalText = "ربع ";
  else if (decimal === 0.5) decimalText = "نصف ";
  else if (decimal === 0.75) decimalText = "ثلاثة أرباع ";

  return `من ${decimalText}الحزب ${num}`;
};


export const getWerdQuantity = ({
  quantity,
  type,
}: {
  quantity: number;
  type: string;
}): string => {
  if (type === "PAGE") {
    return "صفحة";
  }

  const hezbQuantity =
    quantity === 1
      ? "ربع حزب"
      : quantity === 2
      ? "نصف حزب"
      : quantity === 3
      ? "ثلاثة أرباع حزب"
      : "حزب";

  return hezbQuantity;
};

export const getWerdStartPoint = ({
  startPoint,
  quantity,
  type,
}: {
  startPoint: number;
  quantity: number;
  type: string;
}): number => {
  if (type !== "HEZB") return startPoint;

  if (startPoint === 1) return startPoint;

  return (startPoint - 1) * quantity + 1;
};

export const getInitialWerdStartPoint = ({
  startPoint,
  quantity,
  type,
}: {
  startPoint: number;
  quantity: number;
  type: string;
}): number => {
  if (type !== "HEZB") return startPoint;

  if (startPoint === 1) return startPoint;

  return Math.floor((startPoint - 1) / quantity) + 1;
};

export const getWerdEnds = async ({
  startPoint,
  quantity,
  type,
}: {
  startPoint: number;
  quantity: number;
  type: string;
}): Promise<{ start: NewAyah; end: NewAyah }> => {
  const response = await fetch(
    `/api/quran/${
      type === "HEZB" ? "quarter-hezb" : "page"
    }?start=${startPoint}&quantity=${quantity}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch hizb data");
  }

  const data = await response.json();
  const ayahs = data as NewAyah[];

  if (!ayahs || ayahs.length === 0) {
    throw new Error("No ayahs found for this hizb");
  }

  const start = ayahs[0];
  const end = ayahs[ayahs.length - 1];

  return { start, end };
};

export const getArabicNumber = (num: number): string => {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((char) => {
      if (char === "." || char === ",") return char;
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : arabicDigits[digit];
    })
    .join("");
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("ar-SA", options);
};

export const getWerdTotalDays = ({
  quantity,
  type,
}: {
  quantity: number;
  type: string;
}): number => {
  if (type === "PAGE" && quantity === 1) return 604;
  else return Math.ceil(240 / quantity);
};

export const getWerdPoints = ({
  quantity,
  type,
}: {
  quantity: number;
  type: string;
}): number => {
  if (type === "PAGE") {
    return quantity === 1 ? 1 : quantity;
  } else {
    return quantity * 3;
  }
};
