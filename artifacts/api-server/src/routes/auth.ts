import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";
import { LoginBody } from "@workspace/api-zod";
import crypto from "crypto";

const router = Router();

const sessions = new Map<string, { studentId: number; role: string }>();

export function getSession(token: string | undefined) {
  if (!token) return null;
  return sessions.get(token) || null;
}

function makeSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { code, role } = parsed.data;

  let student = await db.select().from(studentsTable).where(eq(studentsTable.code, code)).then(r => r[0]);

  if (!student) {
    const [byName] = await db.select().from(studentsTable).where(eq(studentsTable.name, code));
    if (!byName) {
      res.status(401).json({ error: "کد داوطلبی یا نام صحیح نیست" });
      return;
    }
    student = byName;
  }

  const sessionRole = role || student.role || "student";
  const token = makeSessionToken();
  sessions.set(token, { studentId: student.id, role: sessionRole });

  res.cookie("taranom_session", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    student: {
      id: student.id,
      name: student.name,
      code: student.code,
      field: student.field,
      grade: student.grade,
      city: student.city,
      age: student.age,
      mainGoal: student.mainGoal,
      subscriptionType: student.subscriptionType,
      paymentStatus: student.paymentStatus,
      currentTraz: student.currentTraz,
      targetTraz: student.targetTraz,
      studyHoursPerDay: student.studyHoursPerDay,
      createdAt: student.createdAt.toISOString(),
    },
    role: sessionRole,
  });
});

router.post("/auth/logout", (req, res): void => {
  const token = req.cookies?.taranom_session;
  if (token) sessions.delete(token);
  res.clearCookie("taranom_session");
  res.json({ success: true });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const token = req.cookies?.taranom_session;
  const session = getSession(token);
  if (!session) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, session.studentId));
  if (!student) {
    res.status(401).json({ error: "Student not found" });
    return;
  }
  res.json({
    id: student.id,
    name: student.name,
    code: student.code,
    field: student.field,
    grade: student.grade,
    city: student.city,
    age: student.age,
    mainGoal: student.mainGoal,
    subscriptionType: student.subscriptionType,
    paymentStatus: student.paymentStatus,
    currentTraz: student.currentTraz,
    targetTraz: student.targetTraz,
    studyHoursPerDay: student.studyHoursPerDay,
    createdAt: student.createdAt.toISOString(),
    role: session.role,
  });
});

export default router;
