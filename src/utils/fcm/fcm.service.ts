import admin from "firebase-admin";
import { User_model } from "../../DB/models/user.model.js";

const firebaseAdmin = admin as any;

export interface FCMNotificationPayload {
  title: string;
  body: string;
  image?: string;
}

class FCMService {
  private initialized = false;

  private initialize() {
    if (this.initialized) {
      return;
    }

    try {
      if (!firebaseAdmin.apps?.length) {
        firebaseAdmin.initializeApp();
      }
      this.initialized = true;
    } catch (error) {
      console.warn("FCM initialization skipped:", (error as Error).message);
    }
  }

  async storeToken(userId: string, token: string) {
    const user = await User_model.findById(userId);
    if (!user) {
      return null;
    }

    if (!user.fcmTokens?.includes(token)) {
      user.fcmTokens = [...(user.fcmTokens || []), token];
      await user.save();
    }

    return user;
  }

  async sendToUser(userId: string, payload: FCMNotificationPayload) {
    this.initialize();

    if (!this.initialized) {
      return false;
    }

    const user = await User_model.findById(userId);
    if (!user?.fcmTokens?.length) {
      return false;
    }

    try {
      await firebaseAdmin.messaging().sendEachForMulticast({
        tokens: user.fcmTokens,
        notification: payload,
      } as any);
      return true;
    } catch (error) {
      console.warn("FCM send failed:", (error as Error).message);
      return false;
    }
  }
}

export const fcmService = new FCMService();
