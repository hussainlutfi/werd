// db/schema.ts
import { appSchema, tableSchema } from "@nozbe/watermelondb/Schema";

export const users = tableSchema({
  name: "users",
  columns: [
    { name: "id", type: "string", isIndexed: true },
    { name: "phone", type: "string", isOptional: true },
    { name: "name", type: "string", isOptional: true },
    { name: "gender", type: "string", isOptional: true },
    { name: "strike", type: "number", isOptional: true },
    { name: "prevStrike", type: "number", isOptional: true },
    { name: "wasting", type: "number", isOptional: true },
    { name: "points", type: "number", isOptional: true },
    { name: "isPoniting", type: "boolean", isOptional: true },
    { name: "isKafarah", type: "boolean", isOptional: true },
    { name: "isStarted", type: "boolean", isOptional: true },
    { name: "createdAt", type: "number", isOptional: true },
    { name: "pinHash", type: "string", isOptional: true },
    { name: "isShowWhatsApp", type: "boolean", isOptional: true },
    { name: "groups", type: "string", isOptional: true }, // JSON string array
  ],
});

export const user_khatmahs = tableSchema({
  name: "user_khatmahs",
  columns: [
    { name: "khatmahType", type: "string", isOptional: true },
    { name: "typeQuantity", type: "number", isOptional: true },
    { name: "currentQuarter", type: "number", isOptional: true },
    { name: "createdAt", type: "number", isOptional: true },
  ],
});

export const quarters = tableSchema({
  name: "quarters",
  columns: [
    { name: "isDone", type: "boolean" },
    { name: "date", type: "number" },
  ],
});


export default appSchema({
  version: 1,
  tables: [users, user_khatmahs, quarters],
});
