;
export class Applicationerror extends Error {
    statuscode;
    constructor(message, options, statuscode = 400) {
        super(message, options);
        this.statuscode = statuscode;
        this.name = this.constructor.name;
    }
}
export class Badrequestextiption extends Applicationerror {
    constructor(message, options) {
        super(message, options, 404);
    }
}
export class Notfound extends Applicationerror {
    constructor(message, options) {
        super(message, options, 404);
    }
}
export class forbidden extends Applicationerror {
    constructor(message, options) {
        super(message, options, 403);
    }
}
class unauthorized extends Applicationerror {
    constructor(message, options) {
        super(message, options, 401);
    }
}
export const globalmiddleware = (error, req, res, Next) => {
    const statuscode = error.statuscode || 500;
    res.status(statuscode || 500).json({
        message: error.message || "internal server error", stack: error.stack, cause: error.cause
    });
};
// class globalmiddleware {
//     static errorhandler(error:Iserror,req:Request,res:Response,Next:NextFunction){
//         const statuscode = error.statuscode || 500;
//         res.status(statuscode||500).json({
//             message:error.message || "internal server error"
//         })
//     }}
