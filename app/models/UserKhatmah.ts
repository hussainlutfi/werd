import { Model } from "@nozbe/watermelondb";
import { date, field, json, writer } from "@nozbe/watermelondb/decorators";

const jsonOrNull = (v: any) => v ?? null;

export default class UserKhatmah extends Model {
  static table = "user_khatmahs";

  @field("khatmahType") khatmahType!: string | null;
  @field("typeQuantity") typeQuantity!: number | null;
  @field("currentQuarter") currentQuarter!: number | null;
  @date("createdAt") createdAt!: Date | null;

  @writer async setCurrentQuarter(n: number) {
    await this.update((k: any) => {
      k.currentQuarter = n;
    });
  }
}
