import { pgTable, serial, date } from "drizzle-orm/pg-core";

export const cycleDataTable = pgTable("cycle_data", {
  id: serial("id").primaryKey(),
  cycleDate: date("cycle_date").notNull(),
});