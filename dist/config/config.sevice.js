import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), ".env") });
function getenv(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`missing env value ${key} `);
    }
    return value;
}
console.log(getenv("PORT"));
export const PORT = getenv("PORT");
export const DB_URI = getenv("DB_URI");
