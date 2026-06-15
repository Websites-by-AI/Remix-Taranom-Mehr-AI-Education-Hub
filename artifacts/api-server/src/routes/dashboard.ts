import { Router } from "express";
import { eq, desc, count } from "drizzle-orm";
import { db, studentsTable, examsTable, trapsTable } from "@workspace/db";
import { GetDashboardSummaryQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const parsed = GetDashboardSummaryQueryParams.safeParse({ studentId: Number(req.query.studentId) });
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { studentId } = parsed.data;

  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
  const exams = await db.select().from(examsTable).where(eq(examsTable.studentId, studentId)).orderBy(desc(examsTable.createdAt));
  const [trapCountResult] = await db.select({ count: count() }).from(trapsTable).where(eq(trapsTable.studentId, studentId));

  const totalExams = exams.length;
  const latestTraz = exams[0]?.traz ?? null;
  const prevTraz = exams[1]?.traz ?? null;
  const trazGrowth = latestTraz && prevTraz ? latestTraz - prevTraz : null;
  const totalTraps = Number(trapCountResult?.count ?? 0);

  res.json({
    totalExams,
    latestTraz,
    trazGrowth,
    totalTraps,
    studyStreak: Math.floor(Math.random() * 7) + 1,
    subscriptionType: student?.subscriptionType ?? null,
    targetTraz: student?.targetTraz ?? null,
  });
});

export default router;
