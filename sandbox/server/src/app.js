import express from "express";
import morgan from "morgan";
import { createPod } from "./kubernetes/pod.js";
import { createService } from "./kubernetes/service.js";
import { v7 as uuid} from "uuid";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get("/api/sandbox/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/api/sandbox/start", async (req, res) => {
  const sandboxId = uuid();
  try {
    await Promise.all([
      createPod(sandboxId),
      createService(sandboxId)
    ]);
    res.status(201).json({ 
      message: "Sandbox started successfully",
      sandboxId: sandboxId,
      previewUrl: `http://${sandboxId}.preview.localhost`
     });
  } catch (error) {
    console.error("Error creating pod or service:", error);
    res.status(500).json({ error: "Failed to start sandbox" });
  }
});

export default app;