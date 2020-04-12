import { Router, Request, Response } from "express";
import Video from "../models/Video";

import * as c from "../config/config";
import { getUserId } from "../helpers/authHelper";
import {requireAuth} from "../auth/requireAuth";

const router: Router = Router();

// Create video
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const userId = getUserId(req.headers);

  const { title } = req.body;

  if (!title) {
    return res.status(400).send({ message: "Name is required" });
  }

  let video = await new Video({
    title,
    userId,
  });

  video = await video.save();

  res.status(201).send(video);
});

// Get all videos
router.get("/", async (req: Request, res: Response) => {
  const items = [];
  res.send(items);
});

export default router;
