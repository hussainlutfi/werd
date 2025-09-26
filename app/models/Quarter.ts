import { Model } from "@nozbe/watermelondb";
import { date, field, writer } from "@nozbe/watermelondb/decorators";

export default class Quarter extends Model {
  static table = "quarters";

  @field("isDone") isDone!: boolean;
  @date("date") date!: Date;

  @writer async toggleDone() {
    await this.update((q: any) => {
      q.isDone = !q.isDone;
    });
  }
}
