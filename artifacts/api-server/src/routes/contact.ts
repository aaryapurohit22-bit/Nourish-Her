import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    await db.insert(contactMessagesTable).values({
      name,
      email,
      message,
    });

    return res.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
});

export default router;