import crypto from "crypto";
import { config } from "../../config/config.service.js";
const ENCRYPTION_SECRET_KEY = config.ENC;
if (!ENCRYPTION_SECRET_KEY ||
    ENCRYPTION_SECRET_KEY.length !== 64 ||
    !/^[0-9a-fA-F]+$/.test(ENCRYPTION_SECRET_KEY)) {
    throw new Error("Invalid ENCRYPTION_SECRET_KEY");
}
const key = Buffer.from(ENCRYPTION_SECRET_KEY, "hex");
export const encrypt = (text) => {
    if (!text || typeof text !== "string") {
        throw new Error("encrypt: input must be a non-empty string");
    }
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag();
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
};
export const decrypt = (data) => {
    if (!data || !data.includes(":")) {
        throw new Error("decrypt: invalid encrypted data format");
    }
    const [ivHex, tagHex, encryptedText] = data.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
};
