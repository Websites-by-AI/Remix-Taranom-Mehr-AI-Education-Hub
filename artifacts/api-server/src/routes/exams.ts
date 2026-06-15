import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, examsTable } from "@workspace/db";
import { ListExamsParams, CreateExamParams, CreateExamBody } from "@workspace/api-zod";

const router = Router();

function mapExam(e: typeof examsTable.$inferSelect) {
  return {
    id: e.id, studentId: e.studentId, date: e.date, title: e.title,
    traz: e.traz, rank: e.rank, overallPercentage: e.overallPercentage,
    lessonsJson: e.lessonsJson, createdAt: e.createdAt.toISOString(),
  };
}

router.get("/students/:id/exams", async (req, res): Promise<void> => {
  const params = ListExamsParams.safeParse({ id: Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const exams = await db.select().from(examsTable)
    .where(eq(examsTable.studentId, params.data.id))
    .orderBy(desc(examsTable.createdAt));
  res.json(exams.map(mapExam));
});

router.post("/students/:id/exams", async (req, res): Promise<void> => {
  const params = CreateExamParams.safeParse({ id: Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const body = CreateExamBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }
  const [exam] = await db.insert(examsTable).values({ ...body.data, studentId: params.data.id }).returning();
  res.status(201).json(mapExam(exam));
});

export default router;
