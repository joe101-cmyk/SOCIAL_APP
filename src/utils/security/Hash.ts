    import { hash, compare } from "bcrypt";
    import { config} from "../../config/config.service.js";
import { promises } from "node:dns";

export const generateHash = async (plaintxt: string, saltRound: number = Number(config.SALT)):Promise<string> => {
    return await hash(plaintxt, saltRound);
    
};

export const comapareHash = async(plaintxt:string,hash:string):Promise<boolean> =>{
    return await compare(plaintxt , hash)
}