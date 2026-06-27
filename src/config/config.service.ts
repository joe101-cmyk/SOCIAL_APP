import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.join(process.cwd(), "src/config/.env.dev"),
});

function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(` Missing environment variable: ${key}`);
  }

  return value;
}
console.log("ENV SALT:", process.env.SALT);

export const config = {
  PORT: Number(getEnv("PORT")),
  DB_URI: getEnv("DB_URI"),
  NODE_ENV: getEnv("NODE_ENV"),
  SALT: Number(getEnv("SALT")),
  ENC:getEnv("Encryption_Secret_Key"),
  user_email:getEnv("USER_EMAIL"),
  user_password:getEnv("USER_PASSWORD"),
  Token_Access_user_secret_key:getEnv("Token_Access_user_secret_key"),
  Token_Refresh_user_secret_key:getEnv("Token_Refresh_user_secret_key"),
  Token_Access_admin_secret_key:getEnv("Token_Access_admin_secret_key"),
  Token_Refresh_admin_secret_key:getEnv("Token_Refresh_admin_secret_key"),
  Redis_URL:getEnv("REDIS_URL")
};