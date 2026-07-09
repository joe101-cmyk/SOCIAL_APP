import { Request, Response } from "express";

import { Friend_model } from "../../DB/models/Freined.req.model.js";

class UserService {
    constructor() {}

    getProfile = async (
        req: Request,
        res: Response
    ) => {
        return res.status(200).json({
            message: "User profile",
            data: req.user,
        });
    };

    logout = async (
        req: Request,
        res: Response
    ) => {
        return res.status(200).json({
            message: "Logout successfully",
        });
    };

    refreshToken = async (
        req: Request,
        res: Response
    ) => {
        return res.status(200).json({
            message: "Refresh token successfully",
        });
    };

    send_FRIEND_REQ = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const { userId } = req.body as { userId: string };

        const checkFriendRequest = await Friend_model.findOne({
            senderId: req.user!.id,
            receiverId: userId,
        });

        if (checkFriendRequest) {
            return res.status(400).json({
                message: "Friend request already exists",
            });
        }

        const friendRequest = await Friend_model.create({
            senderId: req.user?.id,
            receiverId: userId,
        });

        return res.status(201).json({
            message: "Friend request sent successfully",
            data: friendRequest,
        });
    };

    accept_FRIEND_REQ = async (
        req: Request,
        res: Response
    ): Promise<Response> => {
        const { requestId } = req.body as { requestId: string };

        const friendRequest = await Friend_model.findOneAndUpdate(
            {
                _id: requestId,
                receiverId: req.user?.id,
                status: "pending",
            },
            {
                status: "accepted",
            },
            {
                new: true,
            }
        );

        if (!friendRequest) {
            return res.status(404).json({
                message: "Friend request not found",
            });
        }

        return res.status(200).json({
            message: "Friend request accepted successfully",
            data: friendRequest,
        });
    };
}

export default new UserService();