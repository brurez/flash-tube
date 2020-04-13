import { Router, Request, Response } from "express";
import cors from "cors";

import * as AWS from "../aws";
import Video from "../models/Video";
import { getUserId } from "../helpers/authHelper";
import { requireAuth } from "../auth/requireAuth";

const router: Router = Router();

// Create video
router.options("/", cors());
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

  videos.forEach((video) => {
    video.url = AWS.getGetSignedUrl(video.id.toString());
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
  video.url = AWS.getGetSignedUrl(video.id.toString());

  res.status(200).send(video);
});

// Delete a video

router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  const userId = getUserId(req.headers);
  const { id } = req.params;

  const result = await Video.destroy({ where: { id, userId } });
  res.status(200).send({ deletedVideos: result });
});

// Update one video
router.options("/:id", cors());
router.patch("/:id", requireAuth, async (req: Request, res: Response) => {
  const userId = getUserId(req.headers);
  const { id } = req.params;
  const { title, description } = req.body;
  const video = await Video.update(
    {
      title,
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

// Get a signed url to put a new item in the bucket
router.get(
  "/:id/attachment",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const url = AWS.getPutSignedUrl(id);
    console.log("ATTACHMENT URL", id, url);
    res.status(201).send({ url });
  }
);

export default router;
