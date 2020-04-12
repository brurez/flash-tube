import { Router, Request, Response } from "express";
import videoController from "./videoController";

const router: Router = Router();

router.use("/video", videoController);

router.get("/", async (req: Request, res: Response) => {
  res.send('Api route up and running.');
});

export default router;
