import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import cycleRouter from "./cycle";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(cycleRouter);

export default router;