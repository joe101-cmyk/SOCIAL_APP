    import { Request } from "express"
    import { Response } from "express"
    import { NextFunction } from "express"
import { error } from "node:console";
import { ca } from "zod/locales";


    interface Iserror extends Error{
        statuscode:number;
    };

export class Applicationerror extends Error {
    constructor(message:string,options?:ErrorOptions,public statuscode:number = 400){
        super(message,options);
        this.name = this.constructor.name;

    }
}


export class Badrequestextiption extends Applicationerror {
    constructor(message:string,options?:ErrorOptions){
    super(message,options,404)
    }
}

export class Notfound extends Applicationerror {
    constructor(message:string,options?:ErrorOptions){
    super(message,options,404)
    }
}


export class forbidden extends Applicationerror {
    constructor(message:string,options?:ErrorOptions){
    super(message,options,403)
    }  }


    class unauthorized extends Applicationerror {
        constructor(message:string,options?:ErrorOptions){
        super(message,options,401)
        }  }
        
        export const globalmiddleware = (error:Iserror,req:Request,res:Response,Next:NextFunction)=>{
            const statuscode = error.statuscode || 500;
            res.status(statuscode||500).json({
                message:error.message || "internal server error",stack:error.stack,cause:error.cause
            })
        }

        // class globalmiddleware {
        //     static errorhandler(error:Iserror,req:Request,res:Response,Next:NextFunction){
        //         const statuscode = error.statuscode || 500;
        //         res.status(statuscode||500).json({
        //             message:error.message || "internal server error"
        //         })
        //     }}