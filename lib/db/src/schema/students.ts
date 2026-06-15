import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  field: text("field").notNull().default("tajrobi"),
  grade: text("grade").notNull().default(""),
  city: text("city"),
  age: integer("age"),
  mainGoal: text("main_goal"),
  subscriptionType: text("subscription_type").default("free"),
  paymentStatus: text("payment_status").default("pending"),
  currentTraz: integer("current_traz"),
  targetTraz: integer("target_traz"),
  studyHoursPerDay: real("study_hours_per_day"),
  role: text("role").notNull().default("student"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
