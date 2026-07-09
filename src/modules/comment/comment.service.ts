import { Request, Response } from "express";
import { Comment_model } from "../../DB/models/comment.model.js";
import { Post_model } from "../../DB/models/postmodel.js";

class CommentService {
  createComment = async (req: Request, res: Response): Promise<Response> => {
    const { postId, content } = req.body;
    const post = await Post_model.findOne({ _id: postId, isDeleted: { $ne: true } });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment_model.create({
      postId,
      authorId: req.user?.id,
      content,
    });

    return res.status(201).json({ message: "Comment created", data: comment });
  };

  getCommentsByPost = async (req: Request, res: Response): Promise<Response> => {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment_model.find({ postId: req.params.postId, isDeleted: { $ne: true } }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("authorId", "username firstname lastname profileImage"),
      Comment_model.countDocuments({ postId: req.params.postId, isDeleted: { $ne: true } }),
    ]);

    return res.status(200).json({ message: "Comments fetched", data: comments, pagination: { page, limit, total } });
  };

  updateComment = async (req: Request, res: Response): Promise<Response> => {
    const comment = await Comment_model.findOne({ _id: req.params.id, authorId: req.user?.id, isDeleted: { $ne: true } });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    return res.status(200).json({ message: "Comment updated", data: comment });
  };

  deleteComment = async (req: Request, res: Response): Promise<Response> => {
    const comment = await Comment_model.findOne({ _id: req.params.id, authorId: req.user?.id, isDeleted: { $ne: true } });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.isDeleted = true;
    comment.deletedAt = new Date();
    await comment.save();

    return res.status(200).json({ message: "Comment deleted" });
  };
}

export default new CommentService();