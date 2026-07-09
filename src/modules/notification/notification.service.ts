import { Request, Response } from "express";
import { Notification_model } from "../../DB/models/notification.model.js";
import { User_model } from "../../DB/models/user.model.js";
import { Types } from "mongoose";

class NotificationService {
  create = async (req: Request, res: Response): Promise<Response> => {
    const { title, body, image, receiver, type } = req.body;

    const targetUser = await User_model.findById(receiver);
    if (!targetUser) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const notification = await Notification_model.create({
      title,
      body,
      image,
      sender: req.user?.id,
      receiver,
      type,
      isRead: false,
    });

    return res.status(201).json({ message: "Notification created", data: notification });
  };

  getAll = async (req: Request, res: Response): Promise<Response> => {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 10)));
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Notification_model.find({ receiver: req.user?.id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification_model.countDocuments({ receiver: req.user?.id }),
    ]);

    return res.status(200).json({ message: "Notifications fetched", data: items, pagination: { page, limit, total } });
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    const notification = await Notification_model.findOne({ _id: req.params.id, receiver: req.user?.id });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    return res.status(200).json({ message: "Notification fetched", data: notification });
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const notification = await Notification_model.findOneAndUpdate(
      { _id: req.params.id, receiver: req.user?.id },
      { isRead: true, ...req.body },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    return res.status(200).json({ message: "Notification updated", data: notification });
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    const notification = await Notification_model.findOneAndDelete({ _id: req.params.id, receiver: req.user?.id });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    return res.status(200).json({ message: "Notification deleted" });
  };
}

export default new NotificationService();
