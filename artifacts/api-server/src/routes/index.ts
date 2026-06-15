import { Router, type IRouter } from "express";
import authRouter from "./auth";
import studentsRouter from "./students";
import examsRouter from "./exams";
import trapsRouter from "./traps";
import dashboardRouter from "./dashboard";
import aiRouter from "./ai";
import adminRouter from "./admin";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => res.json({ status: "ok" }));

router.use(authRouter);
router.use(studentsRouter);
router.use(examsRouter);
router.use(trapsRouter);
router.use(dashboardRouter);
router.use(aiRouter);
router.use(adminRouter);

export default router;
