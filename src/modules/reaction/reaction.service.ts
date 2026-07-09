import { Request, Response } from "express";
import { Reaction_model, ReactionType } from "../../DB/models/reaction.model.js";
import { Post_model } from "../../DB/models/postmodel.js";

class ReactionService {
  setReaction = async (req: Request, res: Response): Promise<Response> => {
    const { postId, type } = req.body;
    const post = await Post_model.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existing = await Reaction_model.findOne({ postId, userId: req.user?.id });
    if (existing) {
      if (existing.type === type) {
        await Reaction_model.deleteOne({ _id: existing._id });
        return res.status(200).json({ message: "Reaction removed" });
      }
      existing.type = type as ReactionType;
      await existing.save();
      return res.status(200).json({ message: "Reaction updated", data: existing });
    }

    const reaction = await Reaction_model.create({ postId, userId: req.user?.id, type });
    return res.status(201).json({ message: "Reaction added", data: reaction });
  };

  getCounts = async (req: Request, res: Response): Promise<Response> => {
    const { postId } = req.params;
    const reactions = await Reaction_model.find({ postId });
    const counts = reactions.reduce<Record<string, number>>((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {});
    return res.status(200).json({ message: "Reaction counts", data: counts });
  };
}

export default new ReactionService();
