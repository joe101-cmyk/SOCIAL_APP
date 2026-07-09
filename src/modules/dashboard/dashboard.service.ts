import { Request, Response } from "express";
import { User_model } from "../../DB/models/user.model.js";
import { Post_model } from "../../DB/models/postmodel.js";
import { Comment_model } from "../../DB/models/comment.model.js";
import { Notification_model } from "../../DB/models/notification.model.js";

class DashboardService {
  getSummary = async (_req: Request, res: Response): Promise<Response> => {
    const [totalUsers, activeUsers, totalPosts, totalComments, totalNotifications, latestUsers, latestPosts] = await Promise.all([
      User_model.countDocuments({ isDeleted: { $ne: true } }),
      User_model.countDocuments({ isDeleted: { $ne: true } }),
      Post_model.countDocuments({ isDeleted: { $ne: true } }),
      Comment_model.countDocuments({ isDeleted: { $ne: true } }),
      Notification_model.countDocuments(),
      User_model.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(5).select("username email createdAt"),
      Post_model.find({ isDeleted: { $ne: true } }).sort({ created_at: -1 }).limit(5).populate("created_by", "username"),
    ]);

    return res.status(200).json({
      message: "Dashboard summary",
      data: {
        totalUsers,
        activeUsers,
        totalPosts,
        totalComments,
        totalNotifications,
        latestUsers,
        latestPosts,
      },
    });
  };
}

export default new DashboardService();
