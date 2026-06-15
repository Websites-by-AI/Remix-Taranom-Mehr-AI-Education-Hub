import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trapsTable = pgTable("test_traps", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  questionTitle: text("question_title").notNull(),
  subject: text("subject").notNull(),
  category: text("category"),
  trapType: text("trap_type"),
  correctAnswer: text("correct_answer"),
  userMistake: text("user_mistake"),
  educationalNote: text("educational_note"),
  importance: text("importance").notNull().default("medium"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTrapSchema = createInsertSchema(trapsTable).omit({ id: true, createdAt: true });
export type InsertTrap = z.infer<typeof insertTrapSchema>;
export type Trap = typeof trapsTable.$inferSelect;
