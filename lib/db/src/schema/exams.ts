import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const examsTable = pgTable("exams", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  traz: integer("traz").notNull(),
  rank: integer("rank").notNull().default(0),
  overallPercentage: real("overall_percentage").notNull().default(0),
  lessonsJson: text("lessons_json"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertExamSchema = createInsertSchema(examsTable).omit({ id: true, createdAt: true });
export type InsertExam = z.infer<typeof insertExamSchema>;
export type Exam = typeof examsTable.$inferSelect;
