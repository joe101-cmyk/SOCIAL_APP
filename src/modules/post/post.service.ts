import { postModel, postSchema } from "../../DB/models/postmodel.js";
import { User_model, Userschema } from "../../DB/models/user.model.js";
import { UserRepository } from "../../DB/repositry/user.repo.js";
import { PostRepository } from "../../DB/repositry/post.repo.js";
import { Request, Response } from "express";
import { Types } from "mongoose";

export class PostService {
    private readonly userRepo: UserRepository;
    private readonly postRepo: PostRepository;

    constructor() {
    this.userRepo = new UserRepository(User_model);
    this.postRepo = new PostRepository(postModel);

    }
async createPost(req: Request, res: Response): Promise<Response> {
    const { content, avalibality, tages = [], attatchment = [], folder_id } = req.body;

    if (!req.user) {
        return res.status(401).json({
            message: "User not authenticated",
        });
    }

    const targetUser = await this.userRepo.findById({ id: req.user.id });

    if (!targetUser) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    const post = await this.postRepo.create({
        data: {
            conttent: content,
            folder_id,
            attatchment,
            avalibality,
            tages,
            created_by: new Types.ObjectId(req.user.id),
        }
    });

    return res.status(201).json({
        message: "Post created successfully",
        data: post,
    });
}}