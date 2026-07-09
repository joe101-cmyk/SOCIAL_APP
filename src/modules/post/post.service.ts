import { Post_model } from "../../DB/models/postmodel.js";
import { User_model } from "../../DB/models/user.model.js";
import { Request, Response } from "express";
import { Types } from "mongoose";
import { isavaliblity } from "../../utils/enum/auth.enum.js";

export class PostService {
    createPost = async (req: Request, res: Response): Promise<Response> => {
        const { content, avalibality, tages = [], attatchment = [], folder_id } = req.body;

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const targetUser = await User_model.findById(req.user.id);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post_model.create({
            content: content || req.body.contenet,
            folder_id,
            attatchment,
            avalibality: avalibality ?? isavaliblity.public,
            tages,
            created_by: new Types.ObjectId(req.user.id),
        });

        return res.status(201).json({ message: "Post created successfully", data: post });
    };

    getPosts = async (req: Request, res: Response): Promise<Response> => {
        const page = Math.max(1, Number(req.query.page || 1));
        const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            Post_model.find({ isDeleted: { $ne: true } }).sort({ created_at: -1 }).skip(skip).limit(limit).populate("created_by", "username firstname lastname profileImage"),
            Post_model.countDocuments({ isDeleted: { $ne: true } }),
        ]);

        return res.status(200).json({ message: "Posts fetched", data: posts, pagination: { page, limit, total } });
    };

    getPostById = async (req: Request, res: Response): Promise<Response> => {
        const post = await Post_model.findOne({ _id: req.params.id, isDeleted: { $ne: true } }).populate("created_by", "username firstname lastname profileImage");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json({ message: "Post fetched", data: post });
    };

    updatePost = async (req: Request, res: Response): Promise<Response> => {
        const post = await Post_model.findOne({ _id: req.params.id, created_by: req.user?.id, isDeleted: { $ne: true } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        Object.assign(post, req.body);
        await post.save();

        return res.status(200).json({ message: "Post updated", data: post });
    };

    deletePost = async (req: Request, res: Response): Promise<Response> => {
        const post = await Post_model.findOne({ _id: req.params.id, created_by: req.user?.id, isDeleted: { $ne: true } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.isDeleted = true;
        post.deleted_at = new Date();
        await post.save();

        return res.status(200).json({ message: "Post deleted" });
    };
}

export default new PostService();