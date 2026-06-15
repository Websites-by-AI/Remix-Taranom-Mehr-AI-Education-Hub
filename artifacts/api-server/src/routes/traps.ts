import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, trapsTable } from "@workspace/db";
import { ListTrapsParams, CreateTrapParams, CreateTrapBody, DeleteTrapParams } from "@workspace/api-zod";

const router = Router();

function mapTrap(t: typeof trapsTable.$inferSelect) {
  return {
    id: t.id, studentId: t.studentId, questionTitle: t.questionTitle,
    subject: t.subject, category: t.category, trapType: t.trapType,
    correctAnswer: t.correctAnswer, userMistake: t.userMistake,
    educationalNote: t.educationalNote, importance: t.importance,
    createdAt: t.createdAt.toISOString(),
  };
}

router.get("/students/:id/traps", async (req, res): Promise<void> => {
  const params = ListTrapsParams.safeParse({ id: Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const traps = await db.select().from(trapsTable)
    .where(eq(trapsTable.studentId, params.data.id))
    .orderBy(desc(trapsTable.createdAt));
  res.json(traps.map(mapTrap));
});

router.post("/students/:id/traps", async (req, res): Promise<void> => {
  const params = CreateTrapParams.safeParse({ id: Number(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const body = CreateTrapBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: body.error.message }); return; }
  const [trap] = await db.insert(trapsTable).values({ ...body.data, studentId: params.data.id }).returning();
  res.status(201).json(mapTrap(trap));
});

router.delete("/students/:id/traps/:trapId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const rawTrapId = Array.isArray(req.params.trapId) ? req.params.trapId[0] : req.params.trapId;
  const params = DeleteTrapParams.safeParse({ id: Number(rawId), trapId: Number(rawTrapId) });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [trap] = await db.delete(trapsTable)
    .where(and(eq(trapsTable.id, params.data.trapId), eq(trapsTable.studentId, params.data.id)))
    .returning();
  if (!trap) { res.status(404).json({ error: "Trap not found" }); return; }
  res.sendStatus(204);
});

export default router;
