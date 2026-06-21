import { hash, compare } from "bcrypt";
import { config } from "../../config/config.service.js";
export const generateHash = async (plaintxt, saltRound = Number(config.SALT)) => {
    return await hash(plaintxt, saltRound);
};
export const comapareHash = async (plaintxt, hash) => {
    return await compare(plaintxt, hash);
};
