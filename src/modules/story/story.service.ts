import { Request, Response } from "express";
import { Story_model } from "../../DB/models/story.model.js";
import { User_model } from "../../DB/models/user.model.js";
import { Friend_model } from "../../DB/models/Freined.req.model.js";

class StoryService {
  create = async (req: Request, res: Response): Promise<Response> => {
    const { mediaUrl, mediaType } = req.body;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await Story_model.create({ ownerId: req.user?.id, mediaUrl, mediaType, expiresAt });
    return res.status(201).json({ message: "Story created", data: story });
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    const story = await Story_model.findOneAndDelete({ _id: req.params.id, ownerId: req.user?.id });
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    return res.status(200).json({ message: "Story deleted" });
  };

  getAll = async (req: Request, res: Response): Promise<Response> => {
    const stories = await Story_model.find({ expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).populate("ownerId", "username firstname lastname");
    return res.status(200).json({ message: "Stories fetched", data: stories });
  };

  getFriendsStories = async (req: Request, res: Response): Promise<Response> => {
    const friends = await Friend_model.find({
      $or: [{ senderId: req.user?.id }, { receiverId: req.user?.id }],
      status: "accepted",
    });

    const friendIds = friends.map((item) => item.senderId.toString() === req.user?.id ? item.receiverId : item.senderId);
    const stories = await Story_model.find({ ownerId: { $in: friendIds }, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).populate("ownerId", "username firstname lastname");

    return res.status(200).json({ message: "Friend stories fetched", data: stories });
  };
}

export default new StoryService();
