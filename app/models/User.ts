import { Model } from "@nozbe/watermelondb";
import { date, field, json, writer } from "@nozbe/watermelondb/decorators";

const jsonOrNull = (v: any) => v ?? null;
const arrayOrEmpty = (v: any) => (Array.isArray(v) ? v : []);

export default class User extends Model {
  static table = "users";

  // NOTE: Watermelon already has Model.id (primary key).
  // Your schema also has a string column named "id".
  // Expose it under a different JS name to avoid confusion:
  @field("id") externalId!: string | null;
  @field("phone") phone!: string | null;
  @field("name") name!: string | null;
  @field("gender") gender!: string | null;
  @field("strike") strike!: number | null;
  @field("prevStrike") prevStrike!: number | null;
  @field("wasting") wasting!: number | null;
  @field("points") points!: number | null;
  @field("isPoniting") isPoniting!: boolean | null;
  @field("isKafarah") isKafarah!: boolean | null;
  @field("isStarted") isStarted!: boolean | null;
  @date("createdAt") createdAt!: Date | null;
  @field("pinHash") pinHash!: string | null;
  @field("isShowWhatsApp") isShowWhatsApp!: boolean | null;
  @json("groups", arrayOrEmpty) groups!: string[]; // stored as JSON string

  // Example writers
  @writer async addPoints(n: number) {
    await this.update((u: any) => {
      u.points = (u.points ?? 0) + n;
    });
  }

  @writer async setStarted(started: boolean) {
    await this.update((u: any) => {
      u.isStarted = started;
    });
  }
}
