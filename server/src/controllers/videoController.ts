import { Router, Request, Response } from "express";
import Video from "../models/Video";

import * as c from "../config/config";
import { getUserId } from "../helpers/authHelper";
import { requireAuth } from "../auth/requireAuth";

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
router.get("/", requireAuth, async (req: Request, res: Response) => {
  const userId = getUserId(req.headers);

  const videos = await Video.findAll({
    where: {
      userId,
    },
  });

  res.status(200).send(videos);
});

// Get one video
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const userId = getUserId(req.headers);
  const { id } = req.params;
  const video = await Video.findOne({
    where: {
      id,
      userId,
    },
  });

  res.status(200).send(video);
});

// Update one video
router.patch("/:id", requireAuth, async (req: Request, res: Response) => {
  const userId = getUserId(req.headers);
  const { id } = req.params;
  const { name, description } = req.body;
  const video = await Video.update(
    {
      name,
      description,
    },
    {
      where: {
        id,
        userId,
      },
    }
  );

  res.status(200).send(video);
});

export default router;
