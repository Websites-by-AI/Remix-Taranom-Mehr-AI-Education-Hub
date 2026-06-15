import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";
import {
  CreateStudentBody, GetStudentParams, UpdateStudentParams, UpdateStudentBody,
  ListStudentsResponse, GetStudentResponse, UpdateStudentResponse,
} from "@workspace/api-zod";

const router = Router();

function mapStudent(s: typeof studentsTable.$inferSelect) {
  return {
    id: s.id, name: s.name, code: s.code, field: s.field, grade: s.grade,
    city: s.city, age: s.age, mainGoal: s.mainGoal,
    subscriptionType: s.subscriptionType, paymentStatus: s.paymentStatus,
    currentTraz: s.currentTraz, targetTraz: s.targetTraz,
    studyHoursPerDay: s.studyHoursPerDay, createdAt: s.createdAt.toISOString(),
  };
}

router.get("/students", async (_req, res): Promise<void> => {
  const students = await db.select().from(studentsTable).orderBy(studentsTable.createdAt);
  res.json(ListStudentsResponse.parse(students.map(mapStudent)));
});

router.post("/students", async (req, res): Promise<void> => {
  const parsed = CreateStudentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [s] = await db.insert(studentsTable).values(parsed.data).returning();
  res.status(201).json(GetStudentResponse.parse(mapStudent(s)));
});

router.get("/students/:id", async (req, res): Promise<void> => {
  const params = GetStudentParams.safeParse({ id: Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [s] = await db.select().from(studentsTable).where(eq(studentsTable.id, params.data.id));
  if (!s) { res.status(404).json({ error: "Student not found" }); return; }
  res.json(GetStudentResponse.parse(mapStudent(s)));
});

router.patch("/students/:id", async (req, res): Promise<void> => {
  const params = UpdateStudentParams.safeParse({ id: Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const body = UpdateStudentBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }
  const [s] = await db.update(studentsTable).set(body.data).where(eq(studentsTable.id, params.data.id)).returning();
  if (!s) { res.status(404).json({ error: "Student not found" }); return; }
  res.json(UpdateStudentResponse.parse(mapStudent(s)));
});

export default router;
