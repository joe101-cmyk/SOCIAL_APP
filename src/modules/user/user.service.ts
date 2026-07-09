import { Request, Response } from "express";
import { Friend_model } from "../../DB/models/Freined.req.model.js";
import { User_model } from "../../DB/models/user.model.js";
import { Post_model } from "../../DB/models/postmodel.js";
import { fcmService } from "../../utils/fcm/fcm.service.js";

class UserService {
    getProfile = async (req: Request, res: Response): Promise<Response> => {
        const user = await User_model.findById(req.user?.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User profile", data: user });
    };

    getPublicProfile = async (req: Request, res: Response): Promise<Response> => {
        const user = await User_model.findById(req.params.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post_model.find({ created_by: user._id, isDeleted: { $ne: true } }).sort({ created_at: -1 }).limit(10);
        return res.status(200).json({ message: "Public profile", data: { user, posts } });
    };

    getUsers = async (req: Request, res: Response): Promise<Response> => {
        const page = Math.max(1, Number(req.query.page || 1));
        const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User_model.find({ isDeleted: { $ne: true } }).select("-password").skip(skip).limit(limit),
            User_model.countDocuments({ isDeleted: { $ne: true } }),
        ]);

        return res.status(200).json({ message: "Users fetched", data: users, pagination: { page, limit, total } });
    };

    updateProfile = async (req: Request, res: Response): Promise<Response> => {
        const user = await User_model.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        Object.assign(user, req.body);
        await user.save();
        return res.status(200).json({ message: "Profile updated", data: user });
    };

    deleteUser = async (req: Request, res: Response): Promise<Response> => {
        const user = await User_model.findById(req.user?.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isDeleted = true;
        user.deletedAt = new Date();
        await user.save();
        return res.status(200).json({ message: "User deleted" });
    };

    logout = async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).json({ message: "Logout successfully" });
    };

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).json({ message: "Refresh token successfully" });
    };

    send_FRIEND_REQ = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = req.body as { userId: string };
        if (userId === req.user?.id) {
            return res.status(400).json({ message: "Cannot send request to yourself" });
        }

        const checkFriendRequest = await Friend_model.findOne({
            senderId: req.user!.id,
            receiverId: userId,
        });

        if (checkFriendRequest) {
            return res.status(400).json({ message: "Friend request already exists" });
        }

        const friendRequest = await Friend_model.create({ senderId: req.user?.id, receiverId: userId });
        return res.status(201).json({ message: "Friend request sent successfully", data: friendRequest });
    };

    accept_FRIEND_REQ = async (req: Request, res: Response): Promise<Response> => {
        const { requestId } = req.body as { requestId: string };

        const friendRequest = await Friend_model.findOneAndUpdate(
            { _id: requestId, receiverId: req.user?.id, status: "pending" },
            { status: "accepted" },
            { new: true }
        );

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        return res.status(200).json({ message: "Friend request accepted successfully", data: friendRequest });
    };

    followUser = async (req: Request, res: Response): Promise<Response> => {
        const { userId } = req.body as { userId: string };
        if (userId === req.user?.id) {
            return res.status(400).json({ message: "Cannot follow yourself" });
        }

        await User_model.findByIdAndUpdate(req.user?.id, { $addToSet: { following: userId } });
        await User_model.findByIdAndUpdate(userId, { $addToSet: { followers: req.user?.id } });

        return res.status(200).json({ message: "User followed" });
    };

    storeFcmToken = async (req: Request, res: Response): Promise<Response> => {
        const { token } = req.body as { token: string };
        await fcmService.storeToken(req.user?.id || "", token);
        return res.status(200).json({ message: "FCM token stored" });
    };
}

export default new UserService();