import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { cycleDataTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/cycle", async (req, res) => {
  try {
    const { cycleDate } = req.body;

    if (!cycleDate) {
      return res.status(400).json({
        success: false,
        message: "Cycle date is required.",
      });
    }

    await db.insert(cycleDataTable).values({
      cycleDate,
    });

    return res.json({
      success: true,
      message: "Cycle date saved successfully.",
    });
  } catch (error) {
    console.error("Cycle data error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save cycle date.",
    });
  }
});

export default router;