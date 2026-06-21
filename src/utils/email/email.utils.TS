import { config } from "../../config/config.service.js";
import nodemailer from "nodemailer"
import Mail from "nodemailer/lib/mailer"

export const sendEmail = async (data:Mail.Options):Promise<any> =>{
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:config.user_email,
            pass:config.user_password,
        }
    });
    

const info = await transporter.sendMail(data);

return info;

}